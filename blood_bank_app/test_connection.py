#!/usr/bin/env python3
"""
Test database connection script
This script tests the database connection and configuration
"""

from app import get_db_connection
from config import config

def test_connection():
    """Test database connection"""
    print("=" * 60)
    print("Testing Database Connection")
    print("=" * 60)
    
    print("\nCurrent Configuration:")
    print(f"   Host: {config['development'].MYSQL_HOST}")
    print(f"   User: {config['development'].MYSQL_USER}")
    print(f"   Password: {'*' * len(config['development'].MYSQL_PASSWORD) if config['development'].MYSQL_PASSWORD else '(empty)'}")
    print(f"   Database: {config['development'].MYSQL_DATABASE}")
    print(f"   Port: {config['development'].MYSQL_PORT}")
    
    print("\nTesting connection...")
    connection = get_db_connection()
    
    if connection:
        print("Connection successful!")
        
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT DATABASE()")
            current_db = cursor.fetchone()[0]
            print(f"   Current database: {current_db}")
            
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()[0]
            print(f"   MySQL version: {version}")
            
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            print(f"   Tables found: {len(tables)}")
            if tables:
                print("   Tables:", ", ".join([t[0] for t in tables]))
            
            cursor.close()
            connection.close()
            
            print("\nAll tests passed!")
            print("=" * 60)
            return True
            
        except Exception as e:
            print(f"\nError testing database: {e}")
            if connection:
                connection.close()
            return False
    else:
        print("\nConnection failed!")
        print("Please check your MySQL configuration and ensure:")
        print("   1. MySQL server is running")
        print("   2. Database credentials in .env are correct")
        print("   3. Database 'blood_bank_db' exists")
        print("=" * 60)
        return False

if __name__ == "__main__":
    success = test_connection()
    exit(0 if success else 1)

