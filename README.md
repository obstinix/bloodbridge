# Blood Bank Management System

A comprehensive full-stack web application for managing blood donations, requests, and inventory using Python Flask and MySQL.

## 🏗️ Project Overview

This Blood Bank Management System provides a complete solution for:
- **Donor Management**: Registration, profile management, and donation history tracking
- **Hospital Integration**: Blood request management and real-time inventory tracking
- **Admin Dashboard**: Comprehensive management tools and analytics
- **Inventory Management**: Real-time blood availability monitoring
- **Role-based Authentication**: Secure access for different user types

## ✨ Features

### 🔐 Authentication & Authorization
- Role-based access control (Admin, Donor, Hospital)
- Secure session management
- Password hashing with bcrypt
- Login/logout functionality

### 👥 Donor Management
- Donor registration and profile management
- Donation history tracking
- Blood group compatibility checking
- Donation scheduling and approval workflow

### 🏥 Hospital Management
- Hospital registration and profile management
- Blood request submission and tracking
- Real-time inventory availability
- Request status monitoring

### 👨‍💼 Admin Dashboard
- Comprehensive statistics and analytics
- Blood inventory management
- Donor and request approval workflows
- Real-time monitoring and alerts

### 📊 Inventory Management
- Real-time blood availability tracking
- Automatic inventory updates
- Blood group compatibility matrix
- Low stock alerts

## 🛠️ Technology Stack

- **Backend**: Python Flask
- **Database**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Authentication**: Flask sessions with bcrypt
- **Icons**: Bootstrap Icons
- **Responsive Design**: Mobile-first approach

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Python 3.8+**
- **MySQL 5.7+** or **MySQL 8.0+**
- **pip** (Python package installer)
- **Git** (for cloning the repository)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd blood_bank_app
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Database Setup

#### Option A: Using MySQL Command Line

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE blood_bank_db;

# Import schema
USE blood_bank_db;
SOURCE database/schema.sql;

# Exit MySQL
EXIT;
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create a new schema named `blood_bank_db`
4. Open the `database/schema.sql` file
5. Execute the SQL script

### 5. Configuration

Update the database configuration in `config.py` if needed:

```python
# Database configuration
MYSQL_HOST = 'localhost'
MYSQL_USER = 'root'
MYSQL_PASSWORD = 'your_password'
MYSQL_DATABASE = 'blood_bank_db'
MYSQL_PORT = 3306
```

### 6. Run the Application

```bash
python app.py
```

The application will be available at `http://localhost:5000`

## 🔑 Default Login Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`

### Demo Donor Account
- **Contact**: `1234567890`
- **Password**: Not required (contact-based login)

### Demo Hospital Account
- **Contact**: `555-0101`
- **Password**: Not required (contact-based login)

## 📁 Project Structure

```
blood_bank_app/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── README.md            # Project documentation
├── static/              # Static files
│   ├── css/
│   │   └── style.css    # Custom styles
│   └── js/
│       └── main.js      # JavaScript functionality
├── templates/           # HTML templates
│   ├── base.html        # Base template
│   ├── index.html       # Home page
│   ├── login.html       # Login page
│   ├── register_donor.html
│   ├── dashboard_admin.html
│   ├── dashboard_donor.html
│   ├── dashboard_hospital.html
│   ├── request_blood.html
│   └── donor_list.html
└── database/
    └── schema.sql       # Database schema
```

## 🗄️ Database Schema

The system uses a normalized database design with the following main tables:

- **Admin**: System administrators
- **Donor**: Blood donors with personal information
- **Hospital**: Partner hospitals
- **Donation**: Blood donation records
- **Request**: Blood requests from hospitals
- **Blood_Inventory**: Real-time blood availability

### Key Features:
- 3NF normalization
- Foreign key constraints
- Data validation
- Indexes for performance
- Views for common queries

## 🎯 Usage Guide

### For Administrators

1. **Login** with admin credentials
2. **Dashboard** shows comprehensive statistics
3. **Manage Donors** - View, add, and manage donor information
4. **Approve Requests** - Review and approve blood requests
5. **Approve Donations** - Review and approve blood donations
6. **Monitor Inventory** - Track blood availability in real-time

### For Donors

1. **Register** as a new donor
2. **Login** using contact number
3. **View Profile** - Check personal information and donation history
4. **Schedule Donations** - Submit new donation requests
5. **Track Status** - Monitor approval status of donations

### For Hospitals

1. **Login** using hospital contact number
2. **View Dashboard** - Check blood availability and request history
3. **Request Blood** - Submit new blood requests
4. **Track Requests** - Monitor status of submitted requests
5. **Emergency Contact** - Access emergency contact information

## 🔧 Configuration Options

### Environment Variables

You can configure the application using environment variables:

```bash
export MYSQL_HOST=localhost
export MYSQL_USER=root
export MYSQL_PASSWORD=your_password
export MYSQL_DATABASE=blood_bank_db
export MYSQL_PORT=3306
export SECRET_KEY=your_secret_key
export FLASK_DEBUG=True
```

### Application Settings

Key settings in `config.py`:

- **MAX_DONATION_QUANTITY**: Maximum blood donation amount (500ml)
- **MIN_DONOR_AGE**: Minimum donor age (18)
- **MAX_DONOR_AGE**: Maximum donor age (65)
- **SESSION_LIFETIME**: Session duration (24 hours)

## 🧪 Testing

### Manual Testing

1. **Authentication Testing**
   - Test login with different user types
   - Verify session management
   - Test logout functionality

2. **CRUD Operations**
   - Test donor registration
   - Test blood request submission
   - Test admin approval workflows

3. **Inventory Management**
   - Test blood inventory updates
   - Verify real-time availability
   - Test low stock scenarios

### Automated Testing

To add automated tests, create a `tests/` directory and implement test cases using pytest:

```bash
pip install pytest
pytest tests/
```

## 🚀 Deployment

### Production Deployment

1. **Set Environment Variables**
   ```bash
   export FLASK_ENV=production
   export SECRET_KEY=your_production_secret_key
   ```

2. **Configure Database**
   - Use a production MySQL database
   - Set up proper user permissions
   - Configure connection pooling

3. **Use WSGI Server**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

4. **Reverse Proxy** (Nginx)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

## 🔒 Security Considerations

- **Password Hashing**: Uses bcrypt for secure password storage
- **Session Security**: Secure session management with proper timeouts
- **SQL Injection**: Uses parameterized queries
- **XSS Protection**: Input validation and output escaping
- **CSRF Protection**: Consider adding CSRF tokens for production

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials
   - Ensure database exists

2. **Import Errors**
   - Activate virtual environment
   - Install all dependencies
   - Check Python version

3. **Port Already in Use**
   - Change port in `app.py`
   - Kill existing process using the port

4. **Permission Errors**
   - Check file permissions
   - Ensure proper database user permissions

### Debug Mode

Enable debug mode for development:

```python
app.config['DEBUG'] = True
```

## 📈 Performance Optimization

- **Database Indexing**: Proper indexes on frequently queried columns
- **Connection Pooling**: Use connection pooling for production
- **Caching**: Implement Redis caching for frequently accessed data
- **CDN**: Use CDN for static assets
- **Compression**: Enable gzip compression

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added real-time inventory updates
- **v1.2.0** - Enhanced UI/UX with Bootstrap 5
- **v1.3.0** - Added advanced reporting features

## 🎉 Acknowledgments

- Bootstrap team for the excellent UI framework
- Flask community for the robust web framework
- MySQL team for the reliable database system
- All contributors and testers

---

**Built with ❤️ for saving lives through efficient blood bank management**
Preview/Livelink - https://blood-bank-app-gold.vercel.app/
