"""
BloodBridge - Flask Application Entrypoint
Exposes the Flask app instance created via the factory pattern
"""

from blood_bank_app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
