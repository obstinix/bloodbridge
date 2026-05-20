"""
BloodBridge - Flask Application Entrypoint
Exposes the Flask app instance created via the factory pattern
"""

from blood_bank_app import create_app
from blood_bank_app.extensions import socketio

app = create_app()

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
