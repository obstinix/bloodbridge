import pytest
from flask import session
from blood_bank_app.models import Donor

def test_login_admin_success(client):
    response = client.post('/login', data={
        'username': 'admin',
        'password': 'admin123',
        'user_type': 'admin'
    }, follow_redirects=True)
    
    assert response.status_code == 200
    assert b'Login successful!' in response.data
    with client.session_transaction() as sess:
        assert sess['role'] == 'admin'
        assert sess['username'] == 'admin'

def test_login_admin_failure(client):
    response = client.post('/login', data={
        'username': 'admin',
        'password': 'wrongpassword',
        'user_type': 'admin'
    }, follow_redirects=True)
    
    assert response.status_code == 200
    assert b'Invalid credentials' in response.data

def test_login_donor_success(client):
    response = client.post('/login', data={
        'username': '1234567890',
        'password': 'changeme123',
        'user_type': 'donor'
    }, follow_redirects=True)
    
    assert response.status_code == 200
    assert b'Login successful!' in response.data
    with client.session_transaction() as sess:
        assert sess['role'] == 'donor'
        assert sess['username'] == 'Test Donor'

def test_login_hospital_success(client):
    response = client.post('/login', data={
        'username': '555-0101',
        'password': 'changeme123',
        'user_type': 'hospital'
    }, follow_redirects=True)
    
    assert response.status_code == 200
    assert b'Login successful!' in response.data
    with client.session_transaction() as sess:
        assert sess['role'] == 'hospital'
        assert sess['username'] == 'Test Hospital'

def test_register_donor_success(client, app):
    response = client.post('/register_donor', data={
        'name': 'New Donor',
        'age': '24',
        'gender': 'Female',
        'blood_group': 'B-',
        'contact': '9876543210',
        'address': '456 New St',
        'password': 'password123',
        'confirm_password': 'password123'
    }, follow_redirects=True)
    
    assert response.status_code == 200
    assert b'Registration successful! You can now login.' in response.data
    
    with app.app_context():
        donor = Donor.query.filter_by(Contact='9876543210').first()
        assert donor is not None
        assert donor.Name == 'New Donor'
        assert donor.Blood_Group == 'B-'

def test_register_donor_password_mismatch(client):
    response = client.post('/register_donor', data={
        'name': 'New Donor',
        'age': '24',
        'gender': 'Female',
        'blood_group': 'B-',
        'contact': '9876543210',
        'address': '456 New St',
        'password': 'password123',
        'confirm_password': 'wrongpassword'
    }, follow_redirects=True)
    
    assert response.status_code == 200
    assert b'Passwords do not match.' in response.data

def test_register_donor_password_short(client):
    response = client.post('/register_donor', data={
        'name': 'New Donor',
        'age': '24',
        'gender': 'Female',
        'blood_group': 'B-',
        'contact': '9876543210',
        'address': '456 New St',
        'password': 'short',
        'confirm_password': 'short'
    }, follow_redirects=True)
    
    assert response.status_code == 200
    assert b'Password must be at least 8 characters.' in response.data

def test_logout(client):
    # Log in first
    client.post('/login', data={
        'username': 'admin',
        'password': 'admin123',
        'user_type': 'admin'
    })
    
    response = client.get('/logout', follow_redirects=True)
    assert response.status_code == 200
    assert b'You have been logged out' in response.data
    
    with client.session_transaction() as sess:
        assert 'user_id' not in sess
