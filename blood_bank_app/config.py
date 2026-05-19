import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or '9ef05be0f745cd120d57e2d93e157778'
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_USER = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'password')
    MYSQL_DATABASE = os.getenv('MYSQL_DATABASE', 'blood_bank_db')
    MYSQL_PORT = int(os.getenv('MYSQL_PORT', 3306))
    
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
    SESSION_LIFETIME = timedelta(hours=24)
    MIN_DONOR_AGE = 18
    MAX_DONOR_AGE = 65
    MAX_DONATION_QUANTITY = 500
    
    # Blood group compatibility for inventory management
    BLOOD_GROUP_COMPATIBILITY = {
        'A+': ['A+', 'A-', 'O+', 'O-'],
        'A-': ['A-', 'O-'],
        'B+': ['B+', 'B-', 'O+', 'O-'],
        'B-': ['B-', 'O-'],
        'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        'AB-': ['A-', 'B-', 'AB-', 'O-'],
        'O+': ['O+', 'O-'],
        'O-': ['O-']
    }

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
