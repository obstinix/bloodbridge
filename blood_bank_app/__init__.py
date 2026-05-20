import os
from flask import Flask, render_template
from dotenv import load_dotenv
from blood_bank_app.extensions import db, migrate, csrf, limiter, cors, socketio

# Load environment variables
load_dotenv()

def create_app(config_name=None):
    app = Flask(__name__, template_folder='templates', static_folder='static')
    
    # Load configuration
    from blood_bank_app.config import config
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    csrf.init_app(app)
    limiter.init_app(app)
    socketio.init_app(app)
    
    # Allow CORS from everywhere for Next.js frontend (configure narrowly in production)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    
    # Register blueprints
    from blood_bank_app.blueprints.auth import auth_bp
    from blood_bank_app.blueprints.admin import admin_bp
    from blood_bank_app.blueprints.donor import donor_bp
    from blood_bank_app.blueprints.hospital import hospital_bp
    from blood_bank_app.blueprints.api import api_bp
    from blood_bank_app.blueprints.chatbot import chatbot_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(donor_bp)
    app.register_blueprint(hospital_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(chatbot_bp)
    
    # Import sockets to register event handlers
    from blood_bank_app import sockets
    
    # Exempt API from CSRF protection as it uses JWT tokens
    csrf.exempt(api_bp)
    csrf.exempt(chatbot_bp)
    
    # Add home route directly to the factory
    @app.route('/')
    def index():
        return render_template('index.html')
        
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return render_template('404.html'), 404

    @app.errorhandler(500)
    def internal_error(error):
        return render_template('500.html'), 500
        
    return app
