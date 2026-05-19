from flask import Blueprint, request, jsonify, current_app
import bcrypt
import jwt
from datetime import datetime, timedelta, date
from blood_bank_app.extensions import db
from blood_bank_app.models import Admin, Donor, Hospital, Donation, Request, BloodInventory
from blood_bank_app.utils import update_blood_inventory

api_bp = Blueprint('api', __name__, url_prefix='/api/v1')

def generate_token(user_id, username, role):
    payload = {
        'exp': datetime.utcnow() + timedelta(days=1),
        'iat': datetime.utcnow(),
        'sub': str(user_id),
        'username': username,
        'role': role
    }
    # Return string representation of JWT token
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token.decode('utf-8') if isinstance(token, bytes) else token

def jwt_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'success': False, 'message': 'Authorization token is missing!'}), 401
            
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            request.user_info = data
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'success': False, 'message': 'Invalid token!'}), 401
            
        return f(*args, **kwargs)
    return decorated

@api_bp.route('/auth/login', methods=['POST'])
def api_login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    user_type = data.get('user_type')
    
    if not username or not password or not user_type:
        return jsonify({'success': False, 'message': 'Username, password, and user_type are required'}), 400
        
    try:
        if user_type == 'admin':
            user = Admin.query.filter_by(Username=username).first()
            if user and bcrypt.checkpw(password.encode('utf-8'), user.Password.encode('utf-8')):
                token = generate_token(user.Admin_ID, user.Username, 'admin')
                return jsonify({'success': True, 'token': token, 'role': 'admin', 'name': user.Username})
        
        elif user_type == 'donor':
            user = Donor.query.filter_by(Contact=username, Is_Active=True).first()
            if user and user.password_hash and bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
                token = generate_token(user.Donor_ID, user.Name, 'donor')
                return jsonify({'success': True, 'token': token, 'role': 'donor', 'name': user.Name})
                
        elif user_type == 'hospital':
            user = Hospital.query.filter_by(Contact=username, Is_Active=True).first()
            if user and user.password_hash and bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
                token = generate_token(user.Hospital_ID, user.Name, 'hospital')
                return jsonify({'success': True, 'token': token, 'role': 'hospital', 'name': user.Name})
                
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"API Login error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@api_bp.route('/inventory', methods=['GET'])
@jwt_required
def get_inventory():
    try:
        inventory = BloodInventory.query.order_by(BloodInventory.Blood_Group).all()
        return jsonify({'success': True, 'data': [i.to_dict() for i in inventory]})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/donors', methods=['GET', 'POST'])
@jwt_required
def handle_donors():
    # Only Admin can list all donors
    if request.user_info.get('role') != 'admin':
        return jsonify({'success': False, 'message': 'Access denied'}), 403
        
    if request.method == 'GET':
        try:
            donors = Donor.query.filter_by(Is_Active=True).all()
            return jsonify({'success': True, 'data': [d.to_dict() for d in donors]})
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
            
    elif request.method == 'POST':
        data = request.get_json() or {}
        name = data.get('name')
        age = data.get('age')
        gender = data.get('gender')
        blood_group = data.get('blood_group')
        contact = data.get('contact')
        address = data.get('address')
        
        if not all([name, age, gender, blood_group, contact, address]):
            return jsonify({'success': False, 'message': 'All donor fields are required'}), 400
            
        try:
            existing = Donor.query.filter_by(Contact=contact).first()
            if existing:
                return jsonify({'success': False, 'message': 'Contact number already registered'}), 400
                
            default_hash = bcrypt.hashpw(b'changeme123', bcrypt.gensalt()).decode('utf-8')
            new_donor = Donor(
                Name=name,
                Age=int(age),
                Gender=gender,
                Blood_Group=blood_group,
                Contact=contact,
                Address=address,
                password_hash=default_hash
            )
            db.session.add(new_donor)
            db.session.commit()
            return jsonify({'success': True, 'message': 'Donor added successfully', 'data': new_donor.to_dict()})
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/donations', methods=['GET', 'POST'])
@jwt_required
def handle_donations():
    role = request.user_info.get('role')
    user_id = int(request.user_info.get('sub'))
    
    if request.method == 'GET':
        try:
            if role == 'admin':
                donations = Donation.query.order_by(Donation.Created_At.desc()).all()
            elif role == 'donor':
                donations = Donation.query.filter_by(Donor_ID=user_id).order_by(Donation.Date.desc()).all()
            else:
                return jsonify({'success': False, 'message': 'Access denied'}), 403
            return jsonify({'success': True, 'data': [d.to_dict() for d in donations]})
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
            
    elif request.method == 'POST':
        if role != 'donor':
            return jsonify({'success': False, 'message': 'Only donors can schedule donations'}), 403
            
        data = request.get_json() or {}
        blood_group = data.get('blood_group')
        quantity = data.get('quantity')
        notes = data.get('notes', '')
        
        if not blood_group or not quantity:
            return jsonify({'success': False, 'message': 'Blood group and quantity are required'}), 400
            
        try:
            new_donation = Donation(
                Donor_ID=user_id,
                Blood_Group=blood_group,
                Quantity=float(quantity),
                Date=date.today(),
                Admin_Notes=notes
            )
            db.session.add(new_donation)
            db.session.commit()
            return jsonify({'success': True, 'message': 'Donation scheduled successfully', 'data': new_donation.to_dict()})
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/requests', methods=['GET', 'POST'])
@jwt_required
def handle_requests():
    role = request.user_info.get('role')
    user_id = int(request.user_info.get('sub'))
    
    if request.method == 'GET':
        try:
            if role == 'admin':
                requests_data = Request.query.order_by(Request.Created_At.desc()).all()
            elif role == 'hospital':
                requests_data = Request.query.filter_by(Hospital_ID=user_id).order_by(Request.Date.desc()).all()
            else:
                return jsonify({'success': False, 'message': 'Access denied'}), 403
            return jsonify({'success': True, 'data': [r.to_dict() for r in requests_data]})
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
            
    elif request.method == 'POST':
        if role != 'hospital':
            return jsonify({'success': False, 'message': 'Only hospitals can submit requests'}), 403
            
        data = request.get_json() or {}
        blood_group = data.get('blood_group')
        quantity = data.get('quantity')
        
        if not blood_group or not quantity:
            return jsonify({'success': False, 'message': 'Blood group and quantity are required'}), 400
            
        try:
            new_request = Request(
                Hospital_ID=user_id,
                Blood_Group=blood_group,
                Quantity=float(quantity),
                Date=date.today()
            )
            db.session.add(new_request)
            db.session.commit()
            return jsonify({'success': True, 'message': 'Request submitted successfully', 'data': new_request.to_dict()})
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/donations/<int:donation_id>/approve', methods=['POST'])
@jwt_required
def approve_donation_api(donation_id):
    if request.user_info.get('role') != 'admin':
        return jsonify({'success': False, 'message': 'Access denied'}), 403
    try:
        don = Donation.query.filter_by(Donation_ID=donation_id, Status='Pending').first()
        if not don:
            return jsonify({'success': False, 'message': 'Donation not found or already processed'}), 404
            
        don.Status = 'Approved'
        if update_blood_inventory(don.Blood_Group, don.Quantity, 'add'):
            db.session.commit()
            return jsonify({'success': True, 'message': 'Donation approved successfully', 'data': don.to_dict()})
        else:
            db.session.rollback()
            return jsonify({'success': False, 'message': 'Inventory update failed'}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/requests/<int:request_id>/approve', methods=['POST'])
@jwt_required
def approve_request_api(request_id):
    if request.user_info.get('role') != 'admin':
        return jsonify({'success': False, 'message': 'Access denied'}), 403
    try:
        req = Request.query.filter_by(Request_ID=request_id, Status='Pending').first()
        if not req:
            return jsonify({'success': False, 'message': 'Request not found or already processed'}), 404
            
        # Check if enough blood is available
        inventory = BloodInventory.query.filter_by(Blood_Group=req.Blood_Group).first()
        if not inventory or float(inventory.Available_Quantity) < float(req.Quantity):
            return jsonify({'success': False, 'message': 'Insufficient blood available in inventory'}), 400
            
        req.Status = 'Approved'
        if update_blood_inventory(req.Blood_Group, req.Quantity, 'subtract'):
            db.session.commit()
            return jsonify({'success': True, 'message': 'Request approved successfully', 'data': req.to_dict()})
        else:
            db.session.rollback()
            return jsonify({'success': False, 'message': 'Inventory update failed'}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
