# 🚀 Quick Start Guide

## Prerequisites

Before running this application, ensure you have:
- ✅ Python 3.8 or higher installed
- ✅ MySQL server installed and running
- ✅ pip (Python package installer)

## Step 1: Install Dependencies

Navigate to the `blood_bank_app` directory and install the required packages:

```bash
cd blood_bank_app
pip install -r requirements.txt
```

## Step 2: Configure Database

Edit the `.env` file with your MySQL credentials:

```
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=blood_bank_db
MYSQL_PORT=3306
```

**Important:** Replace `your_mysql_password` with your actual MySQL root password (or leave empty if no password is set).

## Step 3: Initialize Database

Run the database initialization script:

```bash
python init_db.py
```

This will:
- Create the `blood_bank_db` database if it doesn't exist
- Import all necessary tables and sample data
- Verify the setup

## Step 4: Test Connection (Optional)

Test the database connection:

```bash
python test_connection.py
```

## Step 5: Run the Application

Start the Flask application:

```bash
python run.py
```

Or alternatively:

```bash
python app.py
```

## Step 6: Access the Application

Open your web browser and navigate to:

**http://localhost:5000**

## 📝 Default Login Credentials

### Admin Account
- **Username:** `admin`
- **Password:** `admin123`

### Demo Donor Account
- **Contact:** `1234567890`
- **Password:** (no password required)

### Demo Hospital Account
- **Contact:** `555-0101`
- **Password:** (no password required)

## 🔧 Troubleshooting

### Database Connection Error

If you get a database connection error:

1. **Check MySQL is running:**
   - Windows: Open Services and check if MySQL service is running
   - Linux/Mac: `sudo service mysql status` or `brew services list`

2. **Verify credentials in `.env` file:**
   - Make sure your MySQL username and password are correct

3. **Create database manually (if needed):**
   ```bash
   mysql -u root -p
   CREATE DATABASE blood_bank_db;
   EXIT;
   ```

### Port Already in Use

If port 5000 is already in use:

1. Find the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Linux/Mac
   lsof -i :5000
   ```

2. Kill the process or change the port in `run.py`

### Import Errors

If you get import errors:

1. Make sure you've installed all dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Activate virtual environment if using one:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

## 📞 Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Review the troubleshooting section above
3. Check that all prerequisites are installed
4. Ensure MySQL server is running

---

**Happy Coding! 🩸**

