#!/usr/bin/env python3
"""
Database initialization script for Blood Bank Management System
This script creates the database and imports the schema
"""

import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_mysql_connection():
    """Get MySQL connection without database"""
    try:
        connection = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', ''),
            port=int(os.getenv('MYSQL_PORT', 3306))
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def create_database():
    """Create database if it doesn't exist"""
    print("=" * 60)
    print("Blood Bank Management System - Database Setup")
    print("=" * 60)
    
    connection = get_mysql_connection()
    if not connection:
        print("\nFailed to connect to MySQL server")
        print("Please ensure MySQL is running and credentials are correct")
        return False
    
    try:
        cursor = connection.cursor()
        database_name = os.getenv('MYSQL_DATABASE', 'blood_bank_db')
        
        print(f"\nCreating database '{database_name}'...")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database_name}")
        print(f"Database '{database_name}' created/verified")
        
        # Switch to the database
        cursor.execute(f"USE {database_name}")
        
        # Read and execute schema
        print("\nImporting database schema...")
        with open('database/schema.sql', 'r', encoding='utf-8') as file:
            schema = file.read()
        
        # Split by semicolon and execute each statement
        statements = [stmt.strip() for stmt in schema.split(';') if stmt.strip()]
        
        executed = 0
        for statement in statements:
            try:
                # Skip empty statements
                if not statement.strip():
                    continue
                
                # Skip CREATE DATABASE and USE statements
                if statement.upper().startswith('CREATE DATABASE'):
                    continue
                if statement.upper().startswith('USE'):
                    continue
                
                # Execute the statement
                cursor.execute(statement)
                executed += 1
            except Error as e:
                print(f"Warning: {str(e)[:100]}")
                continue
        
        connection.commit()
        print(f"Imported {executed} schema statements")
        
        cursor.close()
        connection.close()
        
        print("\n" + "=" * 60)
        print("Database setup completed successfully!")
        print("=" * 60)
        print("\nYou can now run the application with:")
        print("   python run.py")
        print("   or")
        print("   python app.py")
        print("\nDefault login credentials:")
        print("   Admin: admin / admin123")
        print("   Donor: 1234567890")
        print("   Hospital: 555-0101")
        print("=" * 60)
        
        return True
        
    except Error as e:
        print(f"\nDatabase setup failed: {e}")
        if connection:
            connection.close()
        return False

if __name__ == "__main__":
    success = create_database()
    exit(0 if success else 1)

