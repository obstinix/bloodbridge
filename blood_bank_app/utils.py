from functools import wraps
from flask import session, flash, redirect, url_for

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'error')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or session.get('role') != 'admin':
            flash('Admin access required.', 'error')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function

def update_blood_inventory(blood_group, quantity_change, operation='add'):
    from blood_bank_app.models import BloodInventory
    from blood_bank_app.extensions import db
    try:
        inventory = BloodInventory.query.filter_by(Blood_Group=blood_group).first()
        if not inventory:
            inventory = BloodInventory(Blood_Group=blood_group, Available_Quantity=0.0)
            db.session.add(inventory)
            
        quantity_change_float = float(quantity_change)
        if operation == 'add':
            inventory.Available_Quantity = float(inventory.Available_Quantity) + quantity_change_float
        elif operation == 'subtract':
            inventory.Available_Quantity = max(0.0, float(inventory.Available_Quantity) - quantity_change_float)
            
        db.session.commit()
        return True
    except Exception as e:
        print(f"Error updating blood inventory: {e}")
        db.session.rollback()
        return False

