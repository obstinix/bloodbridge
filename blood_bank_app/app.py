"""
Blood Bank Management System - Main Flask Application
A comprehensive system for managing blood donations, requests, and inventory
"""

from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
import mysql.connector
from mysql.connector import Error
import bcrypt
from datetime import datetime, date
import os
from config import config

# Initialize Flask app
# Get the directory where this file is located
base_dir = os.path.dirname(os.path.abspath(__file__))
template_dir = os.path.join(base_dir, 'templates')
static_dir = os.path.join(base_dir, 'static')

app = Flask(__name__, 
            template_folder=template_dir,
            static_folder=static_dir)

# Use production config for Vercel, development for local
config_name = os.environ.get('FLASK_ENV', 'development')
if config_name == 'production':
    app.config.from_object(config['production'])
else:
    app.config.from_object(config['development'])

# Database connection helper
def get_db_connection():
    """Create and return database connection"""
    try:
        connection = mysql.connector.connect(
            host=app.config['MYSQL_HOST'],
            user=app.config['MYSQL_USER'],
            password=app.config['MYSQL_PASSWORD'],
            database=app.config['MYSQL_DATABASE'],
            port=app.config['MYSQL_PORT'],
            autocommit=False,
            connect_timeout=10
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        print(f"   Host: {app.config['MYSQL_HOST']}")
        print(f"   User: {app.config['MYSQL_USER']}")
        print(f"   Database: {app.config['MYSQL_DATABASE']}")
        print(f"   Port: {app.config['MYSQL_PORT']}")
        return None
    except Exception as e:
        print(f"Unexpected error connecting to database: {e}")
        return None

# Authentication decorators
def login_required(f):
    """Decorator to require login for protected routes"""
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Decorator to require admin role for admin-only routes"""
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or session.get('role') != 'admin':
            flash('Admin access required.', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Blood inventory management
def update_blood_inventory(blood_group, quantity_change, operation='add'):
    """Update blood inventory when donations are approved or requests are fulfilled"""
    try:
        conn = get_db_connection()
        if not conn:
            return False
        
        cursor = conn.cursor()
        
        if operation == 'add':
            # Add blood to inventory (donation approved)
            query = """
            INSERT INTO Blood_Inventory (Blood_Group, Available_Quantity) 
            VALUES (%s, %s) 
            ON DUPLICATE KEY UPDATE 
            Available_Quantity = Available_Quantity + %s
            """
            cursor.execute(query, (blood_group, quantity_change, quantity_change))
        elif operation == 'subtract':
            # Subtract blood from inventory (request fulfilled)
            query = """
            UPDATE Blood_Inventory 
            SET Available_Quantity = GREATEST(0, Available_Quantity - %s) 
            WHERE Blood_Group = %s
            """
            cursor.execute(query, (quantity_change, blood_group))
        
        conn.commit()
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()
        return True
    except Error as e:
        print(f"Error updating blood inventory: {e}")
        return False

# Routes
@app.route('/')
def index():
    """Home page"""
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Login page for admin, donor, and hospital"""
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user_type = request.form['user_type']
        
        try:
            conn = get_db_connection()
            if not conn:
                flash('Database connection error', 'error')
                return render_template('login.html')
            
            cursor = conn.cursor()
            
            if user_type == 'admin':
                # Admin login
                cursor.execute("SELECT Admin_ID, Username, Password FROM Admin WHERE Username = %s", (username,))
                user = cursor.fetchone()
                
                if user and bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
                    session['user_id'] = user[0]
                    session['username'] = user[1]
                    session['role'] = 'admin'
                    session.permanent = True
                    flash('Login successful!', 'success')
                    return redirect(url_for('dashboard_admin'))
            
            elif user_type == 'donor':
                # Donor login (using contact number as username)
                cursor.execute("SELECT Donor_ID, Name, Contact FROM Donor WHERE Contact = %s", (username,))
                user = cursor.fetchone()
                
                if user:
                    session['user_id'] = user[0]
                    session['username'] = user[1]
                    session['role'] = 'donor'
                    session.permanent = True
                    flash('Login successful!', 'success')
                    return redirect(url_for('dashboard_donor'))
            
            elif user_type == 'hospital':
                # Hospital login (using contact number as username)
                cursor.execute("SELECT Hospital_ID, Name, Contact FROM Hospital WHERE Contact = %s", (username,))
                user = cursor.fetchone()
                
                if user:
                    session['user_id'] = user[0]
                    session['username'] = user[1]
                    session['role'] = 'hospital'
                    session.permanent = True
                    flash('Login successful!', 'success')
                    return redirect(url_for('dashboard_hospital'))
            
            flash('Invalid credentials', 'error')
            
        except Error as e:
            flash('Database error', 'error')
            print(f"Database error: {e}")
        finally:
            if 'conn' in locals() and conn:
                if 'cursor' in locals() and cursor:
                    cursor.close()
                conn.close()
    
    return render_template('login.html')

@app.route('/register_donor', methods=['GET', 'POST'])
def register_donor():
    """Donor registration page"""
    if request.method == 'POST':
        name = request.form['name']
        age = int(request.form['age'])
        gender = request.form['gender']
        blood_group = request.form['blood_group']
        contact = request.form['contact']
        address = request.form['address']
        
        # Validate age
        if age < app.config['MIN_DONOR_AGE'] or age > app.config['MAX_DONOR_AGE']:
            flash(f'Age must be between {app.config["MIN_DONOR_AGE"]} and {app.config["MAX_DONOR_AGE"]}', 'error')
            return render_template('register_donor.html')
        
        try:
            conn = get_db_connection()
            if not conn:
                flash('Database connection error', 'error')
                return render_template('register_donor.html')
            
            cursor = conn.cursor()
            
            # Check if contact already exists
            cursor.execute("SELECT Donor_ID FROM Donor WHERE Contact = %s", (contact,))
            if cursor.fetchone():
                flash('Contact number already registered', 'error')
                return render_template('register_donor.html')
            
            # Insert new donor
            cursor.execute("""
                INSERT INTO Donor (Name, Age, Gender, Blood_Group, Contact, Address) 
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (name, age, gender, blood_group, contact, address))
            
            conn.commit()
            flash('Registration successful! You can now login.', 'success')
            return redirect(url_for('login'))
            
        except Error as e:
            flash('Registration failed', 'error')
            print(f"Database error: {e}")
        finally:
            if 'conn' in locals() and conn:
                if 'cursor' in locals() and cursor:
                    cursor.close()
                conn.close()
    
    return render_template('register_donor.html')

@app.route('/logout')
def logout():
    """Logout and clear session"""
    session.clear()
    flash('You have been logged out', 'info')
    return redirect(url_for('index'))

@app.route('/dashboard_admin')
@admin_required
def dashboard_admin():
    """Admin dashboard with statistics and management options"""
    try:
        conn = get_db_connection()
        if not conn:
            flash('Database connection error', 'error')
            return redirect(url_for('login'))
        
        cursor = conn.cursor()
        
        # Get statistics
        cursor.execute("SELECT COUNT(*) FROM Donor WHERE Is_Active = TRUE")
        total_donors = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM Hospital WHERE Is_Active = TRUE")
        total_hospitals = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM Request WHERE Status = 'Pending'")
        pending_requests = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM Donation WHERE Status = 'Pending'")
        pending_donations = cursor.fetchone()[0]
        
        # Get blood inventory
        cursor.execute("SELECT Blood_Group, Available_Quantity FROM Blood_Inventory ORDER BY Blood_Group")
        blood_inventory = cursor.fetchall()
        
        # Get recent requests
        cursor.execute("""
            SELECT r.Request_ID, h.Name, r.Blood_Group, r.Quantity, r.Date, r.Status
            FROM Request r
            JOIN Hospital h ON r.Hospital_ID = h.Hospital_ID
            ORDER BY r.Created_At DESC
            LIMIT 10
        """)
        recent_requests = cursor.fetchall()
        
        # Get recent donations
        cursor.execute("""
            SELECT d.Donation_ID, do.Name, d.Blood_Group, d.Quantity, d.Date, d.Status
            FROM Donation d
            JOIN Donor do ON d.Donor_ID = do.Donor_ID
            ORDER BY d.Created_At DESC
            LIMIT 10
        """)
        recent_donations = cursor.fetchall()
        
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()
        
        return render_template('dashboard_admin.html',
                             total_donors=total_donors,
                             total_hospitals=total_hospitals,
                             pending_requests=pending_requests,
                             pending_donations=pending_donations,
                             blood_inventory=blood_inventory,
                             recent_requests=recent_requests,
                             recent_donations=recent_donations)
    
    except Error as e:
        flash('Error loading dashboard', 'error')
        print(f"Database error: {e}")
        return redirect(url_for('login'))

@app.route('/dashboard_donor')
@login_required
def dashboard_donor():
    """Donor dashboard showing donation history"""
    if session.get('role') != 'donor':
        flash('Access denied', 'error')
        return redirect(url_for('login'))
    
    try:
        conn = get_db_connection()
        if not conn:
            flash('Database connection error', 'error')
            return redirect(url_for('login'))
        
        cursor = conn.cursor()
        
        # Get donor information
        cursor.execute("""
            SELECT Name, Blood_Group, Contact, Address, Registration_Date
            FROM Donor WHERE Donor_ID = %s
        """, (session['user_id'],))
        donor_info = cursor.fetchone()
        
        # Get donation history
        cursor.execute("""
            SELECT Donation_ID, Blood_Group, Quantity, Date, Status, Admin_Notes
            FROM Donation WHERE Donor_ID = %s
            ORDER BY Date DESC
        """, (session['user_id'],))
        donation_history = cursor.fetchall()
        
        # Get total donations
        cursor.execute("""
            SELECT COUNT(*) as total_donations, COALESCE(SUM(Quantity), 0) as total_blood
            FROM Donation WHERE Donor_ID = %s AND Status = 'Approved'
        """, (session['user_id'],))
        stats = cursor.fetchone()
        
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()
        
        return render_template('dashboard_donor.html',
                             donor_info=donor_info,
                             donation_history=donation_history,
                             stats=stats)
    
    except Error as e:
        flash('Error loading dashboard', 'error')
        print(f"Database error: {e}")
        return redirect(url_for('login'))

@app.route('/dashboard_hospital')
@login_required
def dashboard_hospital():
    """Hospital dashboard for managing blood requests"""
    if session.get('role') != 'hospital':
        flash('Access denied', 'error')
        return redirect(url_for('login'))
    
    try:
        conn = get_db_connection()
        if not conn:
            flash('Database connection error', 'error')
            return redirect(url_for('login'))
        
        cursor = conn.cursor()
        
        # Get hospital information
        cursor.execute("""
            SELECT Name, Location, Contact, Registration_Date
            FROM Hospital WHERE Hospital_ID = %s
        """, (session['user_id'],))
        hospital_info = cursor.fetchone()
        
        # Get request history
        cursor.execute("""
            SELECT Request_ID, Blood_Group, Quantity, Date, Status, Admin_Notes
            FROM Request WHERE Hospital_ID = %s
            ORDER BY Date DESC
        """, (session['user_id'],))
        request_history = cursor.fetchall()
        
        # Get blood availability
        cursor.execute("SELECT Blood_Group, Available_Quantity FROM Blood_Inventory ORDER BY Blood_Group")
        blood_availability = cursor.fetchall()
        
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()
        
        return render_template('dashboard_hospital.html',
                             hospital_info=hospital_info,
                             request_history=request_history,
                             blood_availability=blood_availability)
    
    except Error as e:
        flash('Error loading dashboard', 'error')
        print(f"Database error: {e}")
        return redirect(url_for('login'))

@app.route('/add_donor', methods=['POST'])
@admin_required
def add_donor():
    """Add new donor (admin function)"""
    name = request.form['name']
    age = int(request.form['age'])
    gender = request.form['gender']
    blood_group = request.form['blood_group']
    contact = request.form['contact']
    address = request.form['address']
    
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database connection error'})
        
        cursor = conn.cursor()
        
        # Check if contact already exists
        cursor.execute("SELECT Donor_ID FROM Donor WHERE Contact = %s", (contact,))
        if cursor.fetchone():
            return jsonify({'success': False, 'message': 'Contact number already registered'})
        
        # Insert new donor
        cursor.execute("""
            INSERT INTO Donor (Name, Age, Gender, Blood_Group, Contact, Address) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (name, age, gender, blood_group, contact, address))
        
        conn.commit()
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()
        
        return jsonify({'success': True, 'message': 'Donor added successfully'})
    
    except Error as e:
        print(f"Database error: {e}")
        return jsonify({'success': False, 'message': 'Failed to add donor'})

@app.route('/add_request', methods=['POST'])
@login_required
def add_request():
    """Add new blood request (hospital function)"""
    if session.get('role') != 'hospital':
        return jsonify({'success': False, 'message': 'Access denied'})
    
    blood_group = request.form['blood_group']
    quantity = float(request.form['quantity'])
    request_date = request.form['date']
    
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database connection error'})
        
        cursor = conn.cursor()
        
        # Insert new request
        cursor.execute("""
            INSERT INTO Request (Hospital_ID, Blood_Group, Quantity, Date) 
            VALUES (%s, %s, %s, %s)
        """, (session['user_id'], blood_group, quantity, request_date))
        
        conn.commit()
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()
        
        return jsonify({'success': True, 'message': 'Blood request submitted successfully'})
    
    except Error as e:
        print(f"Database error: {e}")
        return jsonify({'success': False, 'message': 'Failed to submit request'})

@app.route('/approve_request/<int:request_id>')
@admin_required
def approve_request(request_id):
    """Approve blood request and update inventory"""
    try:
        conn = get_db_connection()
        if not conn:
            flash('Database connection error', 'error')
            return redirect(url_for('dashboard_admin'))
        
        cursor = conn.cursor()
        
        # Get request details
        cursor.execute("""
            SELECT Blood_Group, Quantity FROM Request 
            WHERE Request_ID = %s AND Status = 'Pending'
        """, (request_id,))
        request_data = cursor.fetchone()
        
        if not request_data:
            flash('Request not found or already processed', 'error')
            return redirect(url_for('dashboard_admin'))
        
        blood_group, quantity = request_data
        
        # Check if enough blood is available
        cursor.execute("""
            SELECT Available_Quantity FROM Blood_Inventory 
            WHERE Blood_Group = %s
        """, (blood_group,))
        available = cursor.fetchone()
        
        if not available or available[0] < quantity:
            flash('Insufficient blood available', 'error')
            return redirect(url_for('dashboard_admin'))
        
        # Update request status
        cursor.execute("""
            UPDATE Request SET Status = 'Approved' 
            WHERE Request_ID = %s
        """, (request_id,))
        
        # Update blood inventory
        if update_blood_inventory(blood_group, quantity, 'subtract'):
            conn.commit()
            flash('Request approved and inventory updated', 'success')
        else:
            flash('Request approved but inventory update failed', 'warning')
        
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()
        
    except Error as e:
        flash('Error processing request', 'error')
        print(f"Database error: {e}")
    
    return redirect(url_for('dashboard_admin'))

@app.route('/approve_donation/<int:donation_id>')
@admin_required
def approve_donation(donation_id):
    """Approve blood donation and update inventory"""
    try:
        conn = get_db_connection()
        if not conn:
            flash('Database connection error', 'error')
            return redirect(url_for('dashboard_admin'))
        
        cursor = conn.cursor()
        
        # Get donation details
        cursor.execute("""
            SELECT Blood_Group, Quantity FROM Donation 
            WHERE Donation_ID = %s AND Status = 'Pending'
        """, (donation_id,))
        donation_data = cursor.fetchone()
        
        if not donation_data:
            flash('Donation not found or already processed', 'error')
            return redirect(url_for('dashboard_admin'))
        
        blood_group, quantity = donation_data
        
        # Update donation status
        cursor.execute("""
            UPDATE Donation SET Status = 'Approved' 
            WHERE Donation_ID = %s
        """, (donation_id,))
        
        # Update blood inventory
        if update_blood_inventory(blood_group, quantity, 'add'):
            conn.commit()
            flash('Donation approved and inventory updated', 'success')
        else:
            flash('Donation approved but inventory update failed', 'warning')
        
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()
        
    except Error as e:
        flash('Error processing donation', 'error')
        print(f"Database error: {e}")
    
    return redirect(url_for('dashboard_admin'))

@app.route('/donor_list')
@admin_required
def donor_list():
    """Display list of all donors"""
    try:
        conn = get_db_connection()
        if not conn:
            flash('Database connection error', 'error')
            return redirect(url_for('dashboard_admin'))
        
        cursor = conn.cursor()
        
        # Get all donors with donation summary
        cursor.execute("""
            SELECT d.Donor_ID, d.Name, d.Age, d.Gender, d.Blood_Group, 
                   d.Contact, d.Address, d.Registration_Date,
                   COUNT(dn.Donation_ID) as Total_Donations,
                   COALESCE(SUM(dn.Quantity), 0) as Total_Blood_Donated
            FROM Donor d
            LEFT JOIN Donation dn ON d.Donor_ID = dn.Donor_ID AND dn.Status = 'Approved'
            WHERE d.Is_Active = TRUE
            GROUP BY d.Donor_ID
            ORDER BY d.Name
        """)
        donors = cursor.fetchall()
        
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()
        
        return render_template('donor_list.html', donors=donors)
    
    except Error as e:
        flash('Error loading donor list', 'error')
        print(f"Database error: {e}")
        return redirect(url_for('dashboard_admin'))

@app.route('/add_donation', methods=['POST'])
@login_required
def add_donation():
    """Add new blood donation (donor function)"""
    if session.get('role') != 'donor':
        return jsonify({'success': False, 'message': 'Access denied'})
    
    quantity = float(request.form['quantity'])
    donation_date = request.form['date']
    blood_group = request.form['blood_group']
    notes = request.form.get('notes', '')
    
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database connection error'})
        
        cursor = conn.cursor()
        
        # Insert new donation
        cursor.execute("""
            INSERT INTO Donation (Donor_ID, Blood_Group, Quantity, Date, Admin_Notes) 
            VALUES (%s, %s, %s, %s, %s)
        """, (session['user_id'], blood_group, quantity, donation_date, notes))
        
        conn.commit()
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()
        
        return jsonify({'success': True, 'message': 'Donation scheduled successfully'})
    
    except Error as e:
        print(f"Database error: {e}")
        return jsonify({'success': False, 'message': 'Failed to schedule donation'})

@app.route('/request_blood')
@login_required
def request_blood():
    """Blood request page for hospitals"""
    if session.get('role') != 'hospital':
        flash('Access denied', 'error')
        return redirect(url_for('login'))
    
    try:
        conn = get_db_connection()
        if not conn:
            flash('Database connection error', 'error')
            return redirect(url_for('dashboard_hospital'))
        
        cursor = conn.cursor()
        
        # Get blood availability
        cursor.execute("SELECT Blood_Group, Available_Quantity FROM Blood_Inventory ORDER BY Blood_Group")
        blood_availability = cursor.fetchall()
        
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()
        
        return render_template('request_blood.html', blood_availability=blood_availability)
    
    except Error as e:
        flash('Error loading page', 'error')
        print(f"Database error: {e}")
        return redirect(url_for('dashboard_hospital'))

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
