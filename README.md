# BloodBridge 🩸

BloodBridge is a premium, next-generation healthcare platform designed to streamline blood donation, inventory management, and emergency hospital requests. Powered by AI and real-time websockets, it offers a seamless, glassmorphic experience for Donors, Hospitals, and Admins.

---

## 🚀 Features

- **Real-Time Inventory Sync:** WebSocket integration (`Flask-SocketIO`) instantly broadcasts blood inventory updates across all clients without a page reload.
- **AI Demand Forecasting:** Machine learning (`scikit-learn`) model analyzes 90 days of historical request data to predict future blood demand for optimal supply chain management.
- **Intelligent Donor Matching:** Haversine formula calculates spherical distance using geocoordinates to match emergency blood requests with the nearest compatible donors.
- **Glassmorphic UI:** A stunning Next.js frontend with HSL variables, backdrop filters, and smooth micro-animations.
- **AI Chatbot Assistant:** An intelligent proxy widget powered by LLMs (Gemini/Claude) that guides users and answers biomedical queries securely.
- **Digital QR Donor Cards:** Instantly generate and download verified digital QR donor cards as PNGs.
- **Asynchronous Alerts:** Celery background workers trigger SMS (Twilio) and Email (SendGrid) notifications without blocking API endpoints.

---

## 🏗️ Architecture

### Backend (Python)
- **Framework:** Flask (Factory Pattern)
- **Database:** MySQL 8.0 (via SQLAlchemy & Flask-Migrate)
- **WebSockets:** Eventlet + Flask-SocketIO
- **Task Queue:** Celery + Redis
- **Security:** JWT Authentication, Bcrypt, Flask-Limiter, CSRF Protection

### Frontend (TypeScript)
- **Framework:** Next.js 14 (React 18)
- **Styling:** Vanilla CSS (Glassmorphism, HSL Design System - NO Tailwind)
- **Visualizations:** Recharts (Analytics), qrcode.react
- **Exporting:** SSG (Static Site Generation)

---

## 🐳 Quick Start (Docker - Recommended)

Deploy the entire full-stack platform with a single command using Docker Compose.

```bash
# Clone the repository
git clone https://github.com/yourusername/bloodbridge.git
cd bloodbridge

# Start the platform
docker-compose up --build
```
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Database:** `localhost:3306`

---

## 💻 Quick Start (Local Development)

### 1. Setup the Backend
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Start Redis (Requires local Redis installation)
redis-server &

# Initialize the Database
python run.py seed

# Start the Flask API & Socket Server (Eventlet)
python run.py
```

### 2. Start the Celery Worker
In a new terminal window:
```bash
source venv/bin/activate
celery -A blood_bank_app.tasks.celery_app worker --loglevel=info
```

### 3. Setup the Frontend
In another new terminal window:
```bash
cd frontend
npm install
npm run dev
```

---

## 📚 API Documentation

The REST API utilizes standard JWT Bearer token authentication.
The base URL is `/api/v1`. 

Key endpoints include:
- `POST /api/v1/auth/login`
- `GET /api/v1/analytics/forecast` (ML Demand Forecasting)
- `POST /api/v1/chatbot` (AI Proxy)
- `GET /api/v1/requests/<id>/matching-donors` (Haversine Matching)

Detailed Postman collections or OpenAPI swagger docs can be generated based on the blueprints.

---

## 🧪 Testing

The backend includes a comprehensive `pytest` suite ensuring all core logic and critical paths operate reliably.
```bash
python -m pytest tests/ -v
```

---
*Built with precision and discipline.*
