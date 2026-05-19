from flask import Blueprint, render_template, redirect, url_for, flash, session, request, jsonify
from sqlalchemy import func
from blood_bank_app.extensions import db
from blood_bank_app.models import Donor, Donation
from blood_bank_app.utils import login_required

donor_bp = Blueprint('donor', __name__)

@donor_bp.route('/dashboard_donor')
@login_required
def dashboard_donor():
    if session.get('role') != 'donor':
        flash('Access denied', 'error')
        return redirect(url_for('auth.login'))
        
    try:
        user_id = session['user_id']
        
        # Get donor info
        donor = Donor.query.get(user_id)
        if not donor:
            flash('Donor not found', 'error')
            return redirect(url_for('auth.login'))
            
        donor_info = (donor.Name, donor.Blood_Group, donor.Contact, donor.Address, donor.Registration_Date)
        
        # Get donation history
        donation_history = db.session.query(
            Donation.Donation_ID,
            Donation.Blood_Group,
            Donation.Quantity,
            Donation.Date,
            Donation.Status,
            Donation.Admin_Notes
        ).filter(Donation.Donor_ID == user_id)\
         .order_by(Donation.Date.desc()).all()
         
        # Get total donations and blood
        stats = db.session.query(
            func.count(Donation.Donation_ID).label('total_donations'),
            func.coalesce(func.sum(Donation.Quantity), 0).label('total_blood')
        ).filter(Donation.Donor_ID == user_id, Donation.Status == 'Approved').first()
        
        return render_template(
            'dashboard_donor.html',
            donor_info=donor_info,
            donation_history=donation_history,
            stats=stats
        )
    except Exception as e:
        flash('Error loading dashboard', 'error')
        print(f"Donor dashboard error: {e}")
        return redirect(url_for('auth.login'))

@donor_bp.route('/add_donation', methods=['POST'])
@login_required
def add_donation():
    if session.get('role') != 'donor':
        return jsonify({'success': False, 'message': 'Access denied'})
        
    quantity = float(request.form['quantity'])
    donation_date = request.form['date']
    blood_group = request.form['blood_group']
    notes = request.form.get('notes', '')
    
    try:
        new_donation = Donation(
            Donor_ID=session['user_id'],
            Blood_Group=blood_group,
            Quantity=quantity,
            Date=donation_date,
            Admin_Notes=notes
        )
        db.session.add(new_donation)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Donation scheduled successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"Add donation error: {e}")
        return jsonify({'success': False, 'message': 'Failed to schedule donation'})
