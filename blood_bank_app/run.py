#!/usr/bin/env python3
"""
BloodBridge - Startup Script
Run this file to start the application
"""

import os
import sys
from app import app

def check_database_connection():
    """Check if database connection is working"""
    try:
        from app import get_db_connection
        print("🔌 Testing database connection...")
        conn = get_db_connection()
        if conn:
            print("✅ Database connection successful!")
            conn.close()
            return True
        else:
            print("❌ Database connection failed!")
            print("\n💡 Please ensure:")
            print("   1. MySQL server is running")
            print("   2. Database credentials in .env are correct")
            print("   3. Database 'blood_bank_db' exists")
            print("\n   Run: python init_db.py to set up the database")
            return False
    except Exception as e:
        print(f"❌ Error checking database: {e}")
        return False

if __name__ == '__main__':
    # Set environment variables if not already set
    if not os.environ.get('FLASK_ENV'):
        os.environ['FLASK_ENV'] = 'development'
    
    if not os.environ.get('SECRET_KEY'):
        os.environ['SECRET_KEY'] = 'your-secret-key-change-in-production'
    
    # Print startup information
    print("=" * 60)
    print("🩸 BloodBridge")
    print("=" * 60)
    print("🚀 Starting application...")
    
    # Check database connection before starting
    if not check_database_connection():
        print("\n⚠️  Warning: Database connection failed!")
        print("   The application will start, but database features will not work.")
        print("   Please run 'python init_db.py' to set up the database.")
        response = input("\n   Continue anyway? (y/n): ")
        if response.lower() != 'y':
            print("❌ Startup cancelled")
            sys.exit(1)
    
    print("🌐 Server will be available at: http://localhost:5000")
    print("📊 Admin login: admin / admin123")
    print("👤 Demo donor: 1234567890")
    print("🏥 Demo hospital: 555-0101")
    print("=" * 60)
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    
    try:
        # Run the application
        app.run(
            debug=True,
            host='0.0.0.0',
            port=5000,
            threaded=True
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)
