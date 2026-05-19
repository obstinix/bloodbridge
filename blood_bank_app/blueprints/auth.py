from flask import Blueprint, render_template, request, redirect, url_for, flash, session
import bcrypt
from blood_bank_app.extensions import db, limiter
from blood_bank_app.models import Admin, Donor, Hospital

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
@limiter.limit("10 per minute; 50 per hour")
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user_type = request.form['user_type']
        
        try:
            if user_type == 'admin':
                user = Admin.query.filter_by(Username=username).first()
                if user and bcrypt.checkpw(password.encode('utf-8'), user.Password.encode('utf-8')):
                    session['user_id'] = user.Admin_ID
                    session['username'] = user.Username
                    session['role'] = 'admin'
                    session.permanent = True
                    flash('Login successful!', 'success')
                    return redirect(url_for('admin.dashboard_admin'))
            
            elif user_type == 'donor':
                user = Donor.query.filter_by(Contact=username, Is_Active=True).first()
                if user and user.password_hash and bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
                    session['user_id'] = user.Donor_ID
                    session['username'] = user.Name
                    session['role'] = 'donor'
                    session.permanent = True
                    flash('Login successful!', 'success')
                    return redirect(url_for('donor.dashboard_donor'))
            
            elif user_type == 'hospital':
                user = Hospital.query.filter_by(Contact=username, Is_Active=True).first()
                if user and user.password_hash and bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
                    session['user_id'] = user.Hospital_ID
                    session['username'] = user.Name
                    session['role'] = 'hospital'
                    session.permanent = True
                    flash('Login successful!', 'success')
                    return redirect(url_for('hospital.dashboard_hospital'))
            
            flash('Invalid credentials. Please try again.', 'error')
            
        except Exception as e:
            flash('Database error', 'error')
            print(f"Auth error: {e}")
            
    return render_template('login.html')

@auth_bp.route('/register_donor', methods=['GET', 'POST'])
def register_donor():
    from flask import current_app
    if request.method == 'POST':
        name = request.form['name']
        age = int(request.form['age'])
        gender = request.form['gender']
        blood_group = request.form['blood_group']
        contact = request.form['contact']
        address = request.form['address']
        password = request.form['password']
        confirm = request.form['confirm_password']
        
        if password != confirm:
            flash('Passwords do not match.', 'error')
            return render_template('register_donor.html')
        if len(password) < 8:
            flash('Password must be at least 8 characters.', 'error')
            return render_template('register_donor.html')
            
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        min_age = current_app.config.get('MIN_DONOR_AGE', 18)
        max_age = current_app.config.get('MAX_DONOR_AGE', 65)
        if age < min_age or age > max_age:
            flash(f'Age must be between {min_age} and {max_age}', 'error')
            return render_template('register_donor.html')
            
        try:
            # Check if contact already exists
            existing_donor = Donor.query.filter_by(Contact=contact).first()
            if existing_donor:
                flash('Contact number already registered', 'error')
                return render_template('register_donor.html')
                
            new_donor = Donor(
                Name=name,
                Age=age,
                Gender=gender,
                Blood_Group=blood_group,
                Contact=contact,
                Address=address,
                password_hash=password_hash
            )
            db.session.add(new_donor)
            db.session.commit()
            flash('Registration successful! You can now login.', 'success')
            return redirect(url_for('auth.login'))
            
        except Exception as e:
            db.session.rollback()
            flash('Registration failed', 'error')
            print(f"Registration error: {e}")
            
    return render_template('register_donor.html')

@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out', 'info')
    return redirect(url_for('index'))
