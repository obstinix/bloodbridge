#!/usr/bin/env python3
"""
Blood Bank Management System - Startup Script
Run this file to start the application
"""

import os
import sys
from app import app

if __name__ == '__main__':
    # Set environment variables if not already set
    if not os.environ.get('FLASK_ENV'):
        os.environ['FLASK_ENV'] = 'development'
    
    if not os.environ.get('SECRET_KEY'):
        os.environ['SECRET_KEY'] = 'your-secret-key-change-in-production'
    
    # Print startup information
    print("=" * 60)
    print("🩸 Blood Bank Management System")
    print("=" * 60)
    print("🚀 Starting application...")
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
