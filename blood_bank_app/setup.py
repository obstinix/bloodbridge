#!/usr/bin/env python3
"""
Blood Bank Management System - Setup Script
This script helps set up the application for first-time use
"""

import os
import sys
import subprocess
import mysql.connector
from mysql.connector import Error

def print_header():
    """Print setup header"""
    print("=" * 60)
    print("🩸 Blood Bank Management System - Setup")
    print("=" * 60)

def check_python_version():
    """Check if Python version is compatible"""
    print("🐍 Checking Python version...")
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"   Current version: {sys.version}")
        return False
    print(f"✅ Python {sys.version.split()[0]} detected")
    return True

def install_dependencies():
    """Install required Python packages"""
    print("\n📦 Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def test_database_connection():
    """Test database connection"""
    print("\n🗄️ Testing database connection...")
    
    # Get database configuration
    host = input("MySQL Host (localhost): ") or "localhost"
    user = input("MySQL Username (root): ") or "root"
    password = input("MySQL Password: ")
    database = input("Database name (blood_bank_db): ") or "blood_bank_db"
    port = input("MySQL Port (3306): ") or "3306"
    
    try:
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            port=int(port)
        )
        
        if connection.is_connected():
            print("✅ Database connection successful")
            
            # Create database if it doesn't exist
            cursor = connection.cursor()
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database}")
            print(f"✅ Database '{database}' created/verified")
            
            # Import schema
            print("📋 Importing database schema...")
            with open('database/schema.sql', 'r') as file:
                sql_script = file.read()
            
            # Split script into individual statements
            statements = [stmt.strip() for stmt in sql_script.split(';') if stmt.strip()]
            
            for statement in statements:
                if statement:
                    cursor.execute(statement)
            
            connection.commit()
            print("✅ Database schema imported successfully")
            
            cursor.close()
            connection.close()
            
            # Update config.py with database settings
            update_config_file(host, user, password, database, port)
            
            return True
            
    except Error as e:
        print(f"❌ Database connection failed: {e}")
        return False

def update_config_file(host, user, password, database, port):
    """Update config.py with database settings"""
    print("\n⚙️ Updating configuration...")
    
    config_content = f'''"""
Configuration file for Blood Bank Management System
Contains database configuration and application settings
"""

import os
from datetime import timedelta

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-change-in-production'
    
    # Database configuration
    MYSQL_HOST = os.environ.get('MYSQL_HOST') or '{host}'
    MYSQL_USER = os.environ.get('MYSQL_USER') or '{user}'
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD') or '{password}'
    MYSQL_DATABASE = os.environ.get('MYSQL_DATABASE') or '{database}'
    MYSQL_PORT = int(os.environ.get('MYSQL_PORT') or {port})
    
    # Session configuration
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
    
    # Application settings
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Blood bank specific settings
    MAX_DONATION_QUANTITY = 500  # Maximum blood donation in ml
    MIN_DONOR_AGE = 18
    MAX_DONOR_AGE = 65
    
    # Blood group compatibility for inventory management
    BLOOD_GROUP_COMPATIBILITY = {{
        'A+': ['A+', 'A-', 'O+', 'O-'],
        'A-': ['A-', 'O-'],
        'B+': ['B+', 'B-', 'O+', 'O-'],
        'B-': ['B-', 'O-'],
        'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        'AB-': ['A-', 'B-', 'AB-', 'O-'],
        'O+': ['O+', 'O-'],
        'O-': ['O-']
    }}

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False

# Configuration dictionary
config = {{
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}}
'''
    
    with open('config.py', 'w') as file:
        file.write(config_content)
    
    print("✅ Configuration updated successfully")

def create_directories():
    """Create necessary directories"""
    print("\n📁 Creating directories...")
    directories = ['logs', 'uploads', 'static/uploads']
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"✅ Created directory: {directory}")
        else:
            print(f"ℹ️ Directory already exists: {directory}")

def print_success_message():
    """Print setup completion message"""
    print("\n" + "=" * 60)
    print("🎉 Setup completed successfully!")
    print("=" * 60)
    print("🚀 To start the application, run:")
    print("   python run.py")
    print("   or")
    print("   python app.py")
    print("\n🌐 The application will be available at:")
    print("   http://localhost:5000")
    print("\n🔑 Default login credentials:")
    print("   Admin: admin / admin123")
    print("   Donor: 1234567890 (no password)")
    print("   Hospital: 555-0101 (no password)")
    print("=" * 60)

def main():
    """Main setup function"""
    print_header()
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Test database connection and setup
    if not test_database_connection():
        print("\n❌ Setup failed due to database issues")
        print("   Please check your MySQL installation and credentials")
        sys.exit(1)
    
    # Print success message
    print_success_message()

if __name__ == "__main__":
    main()
