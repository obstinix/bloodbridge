from datetime import datetime
from blood_bank_app.extensions import db

class Admin(db.Model):
    __tablename__ = 'Admin'
    
    Admin_ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Username = db.Column(db.String(50), unique=True, nullable=False)
    Password = db.Column(db.String(255), nullable=False)
    Created_At = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'Admin_ID': self.Admin_ID,
            'Username': self.Username,
            'Created_At': self.Created_At.isoformat() if self.Created_At else None
        }


class Donor(db.Model):
    __tablename__ = 'Donor'
    
    Donor_ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Name = db.Column(db.String(100), nullable=False)
    Age = db.Column(db.Integer, nullable=False)
    Gender = db.Column(db.Enum('Male', 'Female', 'Other'), nullable=False)
    Blood_Group = db.Column(db.Enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'), nullable=False)
    Contact = db.Column(db.String(15), unique=True, nullable=False)
    Address = db.Column(db.Text, nullable=False)
    Registration_Date = db.Column(db.DateTime, default=datetime.utcnow)
    Is_Active = db.Column(db.Boolean, default=True)
    password_hash = db.Column(db.String(255), nullable=False, default='')
    Latitude = db.Column(db.Numeric(10, 8), nullable=False, default=41.878112)
    Longitude = db.Column(db.Numeric(11, 8), nullable=False, default=-87.629798)

    # Relationships
    donations = db.relationship('Donation', backref='donor', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'Donor_ID': self.Donor_ID,
            'Name': self.Name,
            'Age': self.Age,
            'Gender': self.Gender,
            'Blood_Group': self.Blood_Group,
            'Contact': self.Contact,
            'Address': self.Address,
            'Registration_Date': self.Registration_Date.isoformat() if self.Registration_Date else None,
            'Is_Active': self.Is_Active,
            'Latitude': float(self.Latitude) if self.Latitude is not None else 41.878112,
            'Longitude': float(self.Longitude) if self.Longitude is not None else -87.629798
        }


class Hospital(db.Model):
    __tablename__ = 'Hospital'
    
    Hospital_ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Name = db.Column(db.String(200), nullable=False)
    Location = db.Column(db.String(200), nullable=False)
    Contact = db.Column(db.String(15), nullable=False)
    Registration_Date = db.Column(db.DateTime, default=datetime.utcnow)
    Is_Active = db.Column(db.Boolean, default=True)
    password_hash = db.Column(db.String(255), nullable=False, default='')
    Latitude = db.Column(db.Numeric(10, 8), nullable=False, default=41.878112)
    Longitude = db.Column(db.Numeric(11, 8), nullable=False, default=-87.629798)

    # Relationships
    requests = db.relationship('Request', backref='hospital', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'Hospital_ID': self.Hospital_ID,
            'Name': self.Name,
            'Location': self.Location,
            'Contact': self.Contact,
            'Registration_Date': self.Registration_Date.isoformat() if self.Registration_Date else None,
            'Is_Active': self.Is_Active,
            'Latitude': float(self.Latitude) if self.Latitude is not None else 41.878112,
            'Longitude': float(self.Longitude) if self.Longitude is not None else -87.629798
        }


class Donation(db.Model):
    __tablename__ = 'Donation'
    
    Donation_ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Donor_ID = db.Column(db.Integer, db.ForeignKey('Donor.Donor_ID', ondelete='CASCADE'), nullable=False)
    Blood_Group = db.Column(db.Enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'), nullable=False)
    Quantity = db.Column(db.Numeric(5, 2), nullable=False)
    Date = db.Column(db.Date, nullable=False)
    Status = db.Column(db.Enum('Pending', 'Approved', 'Rejected'), default='Pending')
    Admin_Notes = db.Column(db.Text)
    Created_At = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'Donation_ID': self.Donation_ID,
            'Donor_ID': self.Donor_ID,
            'Blood_Group': self.Blood_Group,
            'Quantity': float(self.Quantity) if self.Quantity else 0.0,
            'Date': self.Date.isoformat() if self.Date else None,
            'Status': self.Status,
            'Admin_Notes': self.Admin_Notes,
            'Created_At': self.Created_At.isoformat() if self.Created_At else None
        }


class Request(db.Model):
    __tablename__ = 'Request'
    
    Request_ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Hospital_ID = db.Column(db.Integer, db.ForeignKey('Hospital.Hospital_ID', ondelete='CASCADE'), nullable=False)
    Blood_Group = db.Column(db.Enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'), nullable=False)
    Quantity = db.Column(db.Numeric(5, 2), nullable=False)
    Date = db.Column(db.Date, nullable=False)
    Status = db.Column(db.Enum('Pending', 'Approved', 'Rejected', 'Fulfilled'), default='Pending')
    Admin_Notes = db.Column(db.Text)
    Created_At = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'Request_ID': self.Request_ID,
            'Hospital_ID': self.Hospital_ID,
            'Blood_Group': self.Blood_Group,
            'Quantity': float(self.Quantity) if self.Quantity else 0.0,
            'Date': self.Date.isoformat() if self.Date else None,
            'Status': self.Status,
            'Admin_Notes': self.Admin_Notes,
            'Created_At': self.Created_At.isoformat() if self.Created_At else None
        }


class BloodInventory(db.Model):
    __tablename__ = 'Blood_Inventory'
    
    Inventory_ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Blood_Group = db.Column(db.Enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'), unique=True, nullable=False)
    Available_Quantity = db.Column(db.Numeric(5, 2), default=0.0)
    Last_Updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'Inventory_ID': self.Inventory_ID,
            'Blood_Group': self.Blood_Group,
            'Available_Quantity': float(self.Available_Quantity) if self.Available_Quantity else 0.0,
            'Last_Updated': self.Last_Updated.isoformat() if self.Last_Updated else None
        }
