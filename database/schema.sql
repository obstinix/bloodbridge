-- Blood Bank Management System Database Schema
-- Following 3NF normalization principles

-- Create database
CREATE DATABASE IF NOT EXISTS blood_bank_db;
USE blood_bank_db;

-- Admin table for system administrators
CREATE TABLE Admin (
    Admin_ID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donor table for blood donors
CREATE TABLE Donor (
    Donor_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Age INT NOT NULL CHECK (Age >= 18 AND Age <= 65),
    Gender ENUM('Male', 'Female', 'Other') NOT NULL,
    Blood_Group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    Contact VARCHAR(15) UNIQUE NOT NULL,
    Address TEXT NOT NULL,
    Registration_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Is_Active BOOLEAN DEFAULT TRUE
);

-- Hospital table for requesting hospitals
CREATE TABLE Hospital (
    Hospital_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Location VARCHAR(200) NOT NULL,
    Contact VARCHAR(15) NOT NULL,
    Registration_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Is_Active BOOLEAN DEFAULT TRUE
);

-- Donation table for blood donations
CREATE TABLE Donation (
    Donation_ID INT AUTO_INCREMENT PRIMARY KEY,
    Donor_ID INT NOT NULL,
    Blood_Group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    Quantity DECIMAL(5,2) NOT NULL CHECK (Quantity > 0 AND Quantity <= 500),
    Date DATE NOT NULL,
    Status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    Admin_Notes TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Donor_ID) REFERENCES Donor(Donor_ID) ON DELETE CASCADE
);

-- Request table for blood requests from hospitals
CREATE TABLE Request (
    Request_ID INT AUTO_INCREMENT PRIMARY KEY,
    Hospital_ID INT NOT NULL,
    Blood_Group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    Quantity DECIMAL(5,2) NOT NULL CHECK (Quantity > 0),
    Date DATE NOT NULL,
    Status ENUM('Pending', 'Approved', 'Rejected', 'Fulfilled') DEFAULT 'Pending',
    Admin_Notes TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Hospital_ID) REFERENCES Hospital(Hospital_ID) ON DELETE CASCADE
);

-- Blood inventory table for tracking available blood
CREATE TABLE Blood_Inventory (
    Inventory_ID INT AUTO_INCREMENT PRIMARY KEY,
    Blood_Group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    Available_Quantity DECIMAL(5,2) DEFAULT 0,
    Last_Updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_blood_group (Blood_Group)
);

-- Insert default admin user (password: admin123)
INSERT INTO Admin (Username, Password) VALUES 
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QzQz2e');

-- Insert sample blood inventory
INSERT INTO Blood_Inventory (Blood_Group, Available_Quantity) VALUES 
('A+', 0), ('A-', 0), ('B+', 0), ('B-', 0),
('AB+', 0), ('AB-', 0), ('O+', 0), ('O-', 0);

-- Insert sample data for testing
INSERT INTO Donor (Name, Age, Gender, Blood_Group, Contact, Address) VALUES 
('John Doe', 25, 'Male', 'O+', '1234567890', '123 Main St, City'),
('Jane Smith', 30, 'Female', 'A+', '0987654321', '456 Oak Ave, Town'),
('Mike Johnson', 28, 'Male', 'B+', '1122334455', '789 Pine Rd, Village');

INSERT INTO Hospital (Name, Location, Contact) VALUES 
('City General Hospital', 'Downtown City', '555-0101'),
('Metro Medical Center', 'Uptown District', '555-0102'),
('Community Health Center', 'Suburb Area', '555-0103');

-- Create indexes for better performance
CREATE INDEX idx_donor_blood_group ON Donor(Blood_Group);
CREATE INDEX idx_donation_date ON Donation(Date);
CREATE INDEX idx_request_date ON Request(Date);
CREATE INDEX idx_request_status ON Request(Status);
CREATE INDEX idx_donation_status ON Donation(Status);

-- Create views for common queries
CREATE VIEW donor_donation_summary AS
SELECT 
    d.Donor_ID,
    d.Name,
    d.Blood_Group,
    COUNT(dn.Donation_ID) as Total_Donations,
    COALESCE(SUM(dn.Quantity), 0) as Total_Blood_Donated,
    MAX(dn.Date) as Last_Donation_Date
FROM Donor d
LEFT JOIN Donation dn ON d.Donor_ID = dn.Donor_ID AND dn.Status = 'Approved'
GROUP BY d.Donor_ID, d.Name, d.Blood_Group;

CREATE VIEW blood_availability AS
SELECT 
    Blood_Group,
    Available_Quantity,
    CASE 
        WHEN Available_Quantity = 0 THEN 'Critical'
        WHEN Available_Quantity < 50 THEN 'Low'
        WHEN Available_Quantity < 100 THEN 'Moderate'
        ELSE 'Good'
    END as Status
FROM Blood_Inventory
ORDER BY Blood_Group;
