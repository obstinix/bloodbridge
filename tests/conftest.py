import pytest
import os
import bcrypt
from datetime import date
from blood_bank_app import create_app
from blood_bank_app.extensions import db
from blood_bank_app.models import Admin, Donor, Hospital, BloodInventory

@pytest.fixture
def app():
    # Force testing configuration
    os.environ['FLASK_ENV'] = 'testing'
    
    app = create_app('testing')
    
    # Configure SQLite in-memory database for testing
    app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'WTF_CSRF_ENABLED': False  # Disable CSRF for easier testing
    })
    
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Seed test database
        seed_test_data()
        
        yield app
        
        # Clean up database
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def seed_test_data():
    # Admin (password: admin123)
    admin_password = bcrypt.hashpw(b'admin123', bcrypt.gensalt()).decode('utf-8')
    admin = Admin(Username='admin', Password=admin_password)
    db.session.add(admin)
    
    # Donor (password: changeme123)
    donor_password = bcrypt.hashpw(b'changeme123', bcrypt.gensalt()).decode('utf-8')
    donor = Donor(
        Name='Test Donor',
        Age=25,
        Gender='Male',
        Blood_Group='O+',
        Contact='1234567890',
        Address='123 Test St',
        password_hash=donor_password
    )
    db.session.add(donor)
    
    # Hospital (password: changeme123)
    hospital_password = bcrypt.hashpw(b'changeme123', bcrypt.gensalt()).decode('utf-8')
    hospital = Hospital(
        Name='Test Hospital',
        Location='Test Location',
        Contact='555-0101',
        password_hash=hospital_password
    )
    db.session.add(hospital)
    
    # Blood Inventory
    groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    for group in groups:
        inv = BloodInventory(Blood_Group=group, Available_Quantity=10.0 if group == 'O+' else 0.0)
        db.session.add(inv)
        
    db.session.commit()
