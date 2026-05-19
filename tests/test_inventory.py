import pytest
import json

def test_api_login_success(client):
    response = client.post('/api/v1/auth/login', json={
        'username': '1234567890',
        'password': 'changeme123',
        'user_type': 'donor'
    })
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True
    assert 'token' in data
    assert data['role'] == 'donor'

def test_api_login_invalid_credentials(client):
    response = client.post('/api/v1/auth/login', json={
        'username': '1234567890',
        'password': 'wrongpassword',
        'user_type': 'donor'
    })
    
    assert response.status_code == 401
    data = json.loads(response.data)
    assert data['success'] is False
    assert 'Invalid credentials' in data['message']

def test_get_inventory_success(client):
    # Log in first to get JWT token
    login_response = client.post('/api/v1/auth/login', json={
        'username': '1234567890',
        'password': 'changeme123',
        'user_type': 'donor'
    })
    token = json.loads(login_response.data)['token']
    
    # Fetch inventory
    response = client.get('/api/v1/inventory', headers={
        'Authorization': f'Bearer {token}'
    })
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True
    assert len(data['data']) == 8
    
    # Check that O+ is set to 10.0 (from conftest.py seed data)
    o_plus_inv = next(item for item in data['data'] if item['Blood_Group'] == 'O+')
    assert o_plus_inv['Available_Quantity'] == 10.0

def test_get_inventory_unauthorized(client):
    response = client.get('/api/v1/inventory')
    assert response.status_code == 401
    data = json.loads(response.data)
    assert data['success'] is False

def test_post_donation_success(client):
    # Log in as a donor
    login_response = client.post('/api/v1/auth/login', json={
        'username': '1234567890',
        'password': 'changeme123',
        'user_type': 'donor'
    })
    token = json.loads(login_response.data)['token']
    
    # Schedule a donation
    response = client.post('/api/v1/donations', headers={
        'Authorization': f'Bearer {token}'
    }, json={
        'blood_group': 'O+',
        'quantity': 350.0,
        'notes': 'Regular donor'
    })
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True
    assert 'Donation scheduled successfully' in data['message']
    assert data['data']['Blood_Group'] == 'O+'
    assert data['data']['Quantity'] == 350.0
    assert data['data']['Status'] == 'Pending'

def test_post_request_success(client):
    # Log in as a hospital
    login_response = client.post('/api/v1/auth/login', json={
        'username': '555-0101',
        'password': 'changeme123',
        'user_type': 'hospital'
    })
    token = json.loads(login_response.data)['token']
    
    # Submit request
    response = client.post('/api/v1/requests', headers={
        'Authorization': f'Bearer {token}'
    }, json={
        'blood_group': 'A+',
        'quantity': 150.0
    })
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True
    assert 'Request submitted successfully' in data['message']
    assert data['data']['Blood_Group'] == 'A+'
    assert data['data']['Quantity'] == 150.0
    assert data['data']['Status'] == 'Pending'
