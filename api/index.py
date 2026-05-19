"""
Vercel serverless function entry point for Flask app
This wraps the Flask application for serverless deployment
"""

import sys
import os

# Add the blood_bank_app directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
blood_bank_app_dir = os.path.join(current_dir, '..', 'blood_bank_app')
sys.path.insert(0, blood_bank_app_dir)

# Set environment to production for Vercel
os.environ['FLASK_ENV'] = 'production'

from app import app

# Export the Flask app for Vercel Python runtime
# Vercel will automatically use this as the WSGI application
