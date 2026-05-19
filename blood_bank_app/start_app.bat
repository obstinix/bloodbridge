@echo off
REM Blood Bank Management System - Quick Start Script
REM This script helps you start the application quickly

echo ============================================================
echo 🩸 Blood Bank Management System - Quick Start
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo    Please install Python 3.8 or higher
    pause
    exit /b 1
)

echo ✅ Python found
echo.

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found
    echo    Creating default .env file...
    (
        echo # Blood Bank Management System - Environment Configuration
        echo # Update these values with your MySQL credentials
        echo.
        echo # Database Configuration
        echo MYSQL_HOST=localhost
        echo MYSQL_USER=root
        echo MYSQL_PASSWORD=
        echo MYSQL_DATABASE=blood_bank_db
        echo MYSQL_PORT=3306
        echo.
        echo # Flask Configuration
        echo FLASK_ENV=development
        echo FLASK_DEBUG=True
        echo SECRET_KEY=your-secret-key-change-in-production-12345
    ) > .env
    echo    ✅ Created .env file
    echo    ⚠️  Please edit .env file with your MySQL credentials
    echo.
    pause
)

REM Check if database exists by testing connection
echo 🔌 Testing database connection...
python test_connection.py >nul 2>&1

if errorlevel 1 (
    echo ❌ Database connection failed!
    echo.
    echo 💡 Quick setup instructions:
    echo    1. Edit .env file with your MySQL credentials
    echo    2. Make sure MySQL server is running
    echo    3. Run: python init_db.py
    echo.
    set /p choice="   Continue anyway? (y/n): "
    if /i not "%choice%"=="y" (
        echo ❌ Startup cancelled
        pause
        exit /b 1
    )
    echo.
)

echo.
echo 🚀 Starting application...
echo 🌐 Server will be available at: http://localhost:5000
echo 📊 Admin login: admin / admin123
echo ============================================================
echo.

REM Start the application
python run.py

pause

