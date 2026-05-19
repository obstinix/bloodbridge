from flask import Blueprint, render_template, redirect, url_for, flash, request, jsonify
import bcrypt
from sqlalchemy import func
from blood_bank_app.extensions import db
from blood_bank_app.models import Admin, Donor, Hospital, Donation, Request, BloodInventory
from blood_bank_app.utils import admin_required, update_blood_inventory

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard_admin')
@admin_required
def dashboard_admin():
    try:
        total_donors = Donor.query.filter_by(Is_Active=True).count()
        total_hospitals = Hospital.query.filter_by(Is_Active=True).count()
        pending_requests = Request.query.filter_by(Status='Pending').count()
        pending_donations = Donation.query.filter_by(Status='Pending').count()
        
        # Get blood inventory as tuples
        blood_inventory = db.session.query(
            BloodInventory.Blood_Group,
            BloodInventory.Available_Quantity
        ).order_by(BloodInventory.Blood_Group).all()
        
        # Get recent requests
        recent_requests = db.session.query(
            Request.Request_ID,
            Hospital.Name,
            Request.Blood_Group,
            Request.Quantity,
            Request.Date,
            Request.Status
        ).join(Hospital, Request.Hospital_ID == Hospital.Hospital_ID)\
         .order_by(Request.Created_At.desc())\
         .limit(10).all()
         
        # Get recent donations
        recent_donations = db.session.query(
            Donation.Donation_ID,
            Donor.Name,
            Donation.Blood_Group,
            Donation.Quantity,
            Donation.Date,
            Donation.Status
        ).join(Donor, Donation.Donor_ID == Donor.Donor_ID)\
         .order_by(Donation.Created_At.desc())\
         .limit(10).all()
         
        return render_template(
            'dashboard_admin.html',
            total_donors=total_donors,
            total_hospitals=total_hospitals,
            pending_requests=pending_requests,
            pending_donations=pending_donations,
            blood_inventory=blood_inventory,
            recent_requests=recent_requests,
            recent_donations=recent_donations
        )
    except Exception as e:
        flash('Error loading dashboard', 'error')
        print(f"Admin dashboard error: {e}")
        return redirect(url_for('auth.login'))

@admin_bp.route('/add_donor', methods=['POST'])
@admin_required
def add_donor():
    name = request.form['name']
    age = int(request.form['age'])
    gender = request.form['gender']
    blood_group = request.form['blood_group']
    contact = request.form['contact']
    address = request.form['address']
    
    try:
        # Check if contact already exists
        existing_donor = Donor.query.filter_by(Contact=contact).first()
        if existing_donor:
            return jsonify({'success': False, 'message': 'Contact number already registered'})
            
        default_hash = bcrypt.hashpw(b'changeme123', bcrypt.gensalt()).decode('utf-8')
        new_donor = Donor(
            Name=name,
            Age=age,
            Gender=gender,
            Blood_Group=blood_group,
            Contact=contact,
            Address=address,
            password_hash=default_hash
        )
        db.session.add(new_donor)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Donor added successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"Add donor error: {e}")
        return jsonify({'success': False, 'message': 'Failed to add donor'})

@admin_bp.route('/approve_request/<int:request_id>')
@admin_required
def approve_request(request_id):
    try:
        req = Request.query.filter_by(Request_ID=request_id, Status='Pending').first()
        if not req:
            flash('Request not found or already processed', 'error')
            return redirect(url_for('admin.dashboard_admin'))
            
        # Check if enough blood is available
        inventory = BloodInventory.query.filter_by(Blood_Group=req.Blood_Group).first()
        if not inventory or float(inventory.Available_Quantity) < float(req.Quantity):
            flash('Insufficient blood available', 'error')
            return redirect(url_for('admin.dashboard_admin'))
            
        req.Status = 'Approved'
        if update_blood_inventory(req.Blood_Group, req.Quantity, 'subtract'):
            db.session.commit()
            flash('Request approved and inventory updated', 'success')
        else:
            db.session.rollback()
            flash('Request approved but inventory update failed', 'warning')
            
    except Exception as e:
        db.session.rollback()
        flash('Error processing request', 'error')
        print(f"Approve request error: {e}")
        
    return redirect(url_for('admin.dashboard_admin'))

@admin_bp.route('/approve_donation/<int:donation_id>')
@admin_required
def approve_donation(donation_id):
    try:
        don = Donation.query.filter_by(Donation_ID=donation_id, Status='Pending').first()
        if not don:
            flash('Donation not found or already processed', 'error')
            return redirect(url_for('admin.dashboard_admin'))
            
        don.Status = 'Approved'
        if update_blood_inventory(don.Blood_Group, don.Quantity, 'add'):
            db.session.commit()
            flash('Donation approved and inventory updated', 'success')
        else:
            db.session.rollback()
            flash('Donation approved but inventory update failed', 'warning')
            
    except Exception as e:
        db.session.rollback()
        flash('Error processing donation', 'error')
        print(f"Approve donation error: {e}")
        
    return redirect(url_for('admin.dashboard_admin'))

@admin_bp.route('/donor_list')
@admin_required
def donor_list():
    try:
        donors = db.session.query(
            Donor.Donor_ID,
            Donor.Name,
            Donor.Age,
            Donor.Gender,
            Donor.Blood_Group,
            Donor.Contact,
            Donor.Address,
            Donor.Registration_Date,
            func.count(Donation.Donation_ID).label('Total_Donations'),
            func.coalesce(func.sum(Donation.Quantity), 0).label('Total_Blood_Donated')
        ).outerjoin(Donation, (Donor.Donor_ID == Donation.Donor_ID) & (Donation.Status == 'Approved'))\
         .filter(Donor.Is_Active == True)\
         .group_by(Donor.Donor_ID)\
         .order_by(Donor.Name).all()
         
        return render_template('donor_list.html', donors=donors)
    except Exception as e:
        flash('Error loading donor list', 'error')
        print(f"Donor list error: {e}")
        return redirect(url_for('admin.dashboard_admin'))
