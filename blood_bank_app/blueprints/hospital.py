from flask import Blueprint, render_template, redirect, url_for, flash, session, request, jsonify
from blood_bank_app.extensions import db
from blood_bank_app.models import Hospital, Request, BloodInventory
from blood_bank_app.utils import login_required

hospital_bp = Blueprint('hospital', __name__)

@hospital_bp.route('/dashboard_hospital')
@login_required
def dashboard_hospital():
    if session.get('role') != 'hospital':
        flash('Access denied', 'error')
        return redirect(url_for('auth.login'))
        
    try:
        user_id = session['user_id']
        
        # Get hospital info
        hospital = Hospital.query.get(user_id)
        if not hospital:
            flash('Hospital not found', 'error')
            return redirect(url_for('auth.login'))
            
        hospital_info = (hospital.Name, hospital.Location, hospital.Contact, hospital.Registration_Date)
        
        # Get request history
        request_history = db.session.query(
            Request.Request_ID,
            Request.Blood_Group,
            Request.Quantity,
            Request.Date,
            Request.Status,
            Request.Admin_Notes
        ).filter(Request.Hospital_ID == user_id)\
         .order_by(Request.Date.desc()).all()
         
        # Get blood inventory/availability
        blood_availability = db.session.query(
            BloodInventory.Blood_Group,
            BloodInventory.Available_Quantity
        ).order_by(BloodInventory.Blood_Group).all()
        
        return render_template(
            'dashboard_hospital.html',
            hospital_info=hospital_info,
            request_history=request_history,
            blood_availability=blood_availability
        )
    except Exception as e:
        flash('Error loading dashboard', 'error')
        print(f"Hospital dashboard error: {e}")
        return redirect(url_for('auth.login'))

@hospital_bp.route('/request_blood')
@login_required
def request_blood():
    if session.get('role') != 'hospital':
        flash('Access denied', 'error')
        return redirect(url_for('auth.login'))
        
    try:
        # Get blood inventory/availability
        blood_availability = db.session.query(
            BloodInventory.Blood_Group,
            BloodInventory.Available_Quantity
        ).order_by(BloodInventory.Blood_Group).all()
        
        return render_template('request_blood.html', blood_availability=blood_availability)
    except Exception as e:
        flash('Error loading page', 'error')
        print(f"Request blood page error: {e}")
        return redirect(url_for('hospital.dashboard_hospital'))

@hospital_bp.route('/add_request', methods=['POST'])
@login_required
def add_request():
    if session.get('role') != 'hospital':
        return jsonify({'success': False, 'message': 'Access denied'})
        
    blood_group = request.form['blood_group']
    quantity = float(request.form['quantity'])
    request_date = request.form['date']
    
    try:
        new_request = Request(
            Hospital_ID=session['user_id'],
            Blood_Group=blood_group,
            Quantity=quantity,
            Date=request_date
        )
        db.session.add(new_request)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Blood request submitted successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"Add request error: {e}")
        return jsonify({'success': False, 'message': 'Failed to submit request'})
