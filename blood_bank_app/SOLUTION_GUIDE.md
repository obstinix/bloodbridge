# 🔧 Database & Backend Connection Issues - SOLUTION GUIDE

## ✅ What Was Fixed

### 1. Environment Configuration
- ✅ Created `.env` file for database credentials
- ✅ Updated `config.py` to load environment variables using `python-dotenv`
- ✅ Added proper error handling for database connections

### 2. Database Initialization
- ✅ Created `init_db.py` script to automatically set up the database
- ✅ Created `test_connection.py` script to verify database connectivity
- ✅ Database connection now properly uses environment variables

### 3. Backend Improvements
- ✅ Enhanced error messages for database connection failures
- ✅ Added connection timeout handling
- ✅ Improved startup validation in `run.py`
- ✅ Better debugging information output

## 🚀 How to Run the Application

### Step 1: Configure Database Credentials

Edit the `.env` file in the `blood_bank_app` folder:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=    # Leave empty if no password, or enter your MySQL password
MYSQL_DATABASE=blood_bank_db
MYSQL_PORT=3306
```

**Important:** 
- If your MySQL root has no password, leave `MYSQL_PASSWORD` empty
- If your MySQL uses a different port, change `MYSQL_PORT`

### Step 2: Install Dependencies

Make sure all required packages are installed:

```bash
cd blood_bank_app
pip install -r requirements.txt
```

### Step 3: Initialize Database

Run the database setup script:

```bash
python init_db.py
```

This will:
- Connect to MySQL server
- Create the `blood_bank_db` database
- Import all tables and sample data
- Verify the setup

### Step 4: Test Connection (Optional)

Verify the database connection:

```bash
python test_connection.py
```

### Step 5: Start the Application

Run the Flask application:

```bash
python run.py
```

The application will start at: **http://localhost:5000**

## 🔑 Default Login Credentials

- **Admin:** `admin` / `admin123`
- **Donor:** `1234567890` (no password)
- **Hospital:** `555-0101` (no password)

## 🐛 Common Issues & Solutions

### Issue 1: "Error connecting to MySQL"

**Symptoms:**
- Application starts but can't connect to database
- Error message shows connection failed

**Solutions:**

1. **Check if MySQL is running:**
   - Windows: Open Services (`services.msc`) and check if MySQL service is running
   - Start the MySQL service if it's stopped

2. **Verify credentials in `.env` file:**
   ```env
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_actual_password
   ```

3. **Test MySQL connection manually:**
   ```bash
   mysql -u root -p
   ```
   If this fails, MySQL is not configured correctly

4. **Check MySQL port:**
   - Default port is 3306
   - If using a different port, update `MYSQL_PORT` in `.env`

### Issue 2: "Database 'blood_bank_db' doesn't exist"

**Symptoms:**
- Database connection works but tables are missing

**Solutions:**

1. Run the database initialization script:
   ```bash
   python init_db.py
   ```

2. If script fails, manually create the database:
   ```bash
   mysql -u root -p
   ```
   Then in MySQL:
   ```sql
   CREATE DATABASE blood_bank_db;
   USE blood_bank_db;
   SOURCE database/schema.sql;
   EXIT;
   ```

### Issue 3: "Access denied for user"

**Symptoms:**
- Error: "Access denied for user 'root'@'localhost'"

**Solutions:**

1. **Check MySQL user permissions:**
   ```sql
   mysql -u root -p
   SELECT User, Host FROM mysql.user WHERE User='root';
   ```

2. **Grant permissions if needed:**
   ```sql
   GRANT ALL PRIVILEGES ON blood_bank_db.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Issue 4: "Port 5000 already in use"

**Symptoms:**
- Error: "Address already in use"

**Solutions:**

1. **Find the process using port 5000:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # The last column shows PID, kill it with:
   taskkill /PID [PID_number] /F
   ```

2. **Or change the port in run.py:**
   ```python
   app.run(debug=True, host='0.0.0.0', port=5001)  # Use port 5001
   ```

### Issue 5: Import Errors

**Symptoms:**
- "ModuleNotFoundError: No module named 'flask'"
- Or similar import errors

**Solutions:**

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Check if using virtual environment:**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate (Windows)
   venv\Scripts\activate
   
   # Activate (Linux/Mac)
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

## 📊 Troubleshooting Checklist

Before running the application, verify:

- [ ] MySQL server is installed and running
- [ ] Python 3.8+ is installed
- [ ] All dependencies are installed (`pip install -r requirements.txt`)
- [ ] `.env` file is configured with correct MySQL credentials
- [ ] Database `blood_bank_db` exists (run `python init_db.py`)
- [ ] Port 5000 is not in use
- [ ] Firewall allows connections on port 5000

## 🧪 Testing the Setup

Run these commands to verify everything works:

```bash
# Test database connection
python test_connection.py

# Start the application
python run.py
```

If all tests pass, you should see:
- ✅ Database connection successful
- ✅ Server running at http://localhost:5000
- ✅ Can login with admin credentials

## 📝 Additional Notes

### For Development

If you want to see more detailed error messages:

1. Flask debug mode is enabled by default in `run.py`
2. Database connection errors are printed to console
3. Check terminal output for detailed error information

### For Production

Before deploying to production:

1. Change `SECRET_KEY` in `.env` to a strong random string
2. Set `DEBUG=False` in production
3. Use a production WSGI server (like Gunicorn)
4. Configure proper MySQL user with limited permissions
5. Use environment variables for sensitive data

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Check the error message** - it usually tells you what's wrong
2. **Verify MySQL is running** - The most common issue
3. **Check `.env` file** - Make sure credentials are correct
4. **Run `python test_connection.py`** - This will show specific errors
5. **Check firewall/antivirus** - May be blocking connections

### Enable Debug Mode

To get more detailed error messages:

1. Open Python terminal
2. Run:
   ```python
   from app import app
   app.config['DEBUG'] = True
   ```

## ✅ Verification

Once everything is set up, you should be able to:

- [x] Access http://localhost:5000
- [x] See the home page
- [x] Login as admin (admin/admin123)
- [x] See the admin dashboard
- [x] View blood inventory
- [x] Access donor and hospital dashboards

---

**Need more help?** Check the `QUICKSTART.md` file for basic setup instructions.

