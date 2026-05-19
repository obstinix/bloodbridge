"""Set bcrypt password for all existing demo rows. Run once after migration."""
import os, bcrypt, mysql.connector
from dotenv import load_dotenv
load_dotenv()

host = os.getenv('MYSQL_HOST', 'localhost')
user = os.getenv('MYSQL_USER', 'root')
password = os.getenv('MYSQL_PASSWORD', 'password')
database = os.getenv('MYSQL_DATABASE', 'blood_bank_db')
port = int(os.getenv('MYSQL_PORT', 3306))

try:
    conn = mysql.connector.connect(
        host=host, user=user,
        password=password, database=database,
        port=port
    )
    cursor = conn.cursor()
    default_hash = bcrypt.hashpw(b'changeme123', bcrypt.gensalt()).decode('utf-8')
    
    # Update Donor table
    cursor.execute("UPDATE Donor SET password_hash = %s WHERE password_hash = '' OR password_hash IS NULL", (default_hash,))
    conn.commit()
    donor_count = cursor.rowcount
    
    # Update Hospital table
    cursor.execute("UPDATE Hospital SET password_hash = %s WHERE password_hash = '' OR password_hash IS NULL", (default_hash,))
    conn.commit()
    hospital_count = cursor.rowcount
    
    cursor.close()
    conn.close()
    print(f"Seeded password hashes. Donor rows: {donor_count}, Hospital rows: {hospital_count}. Default password: changeme123")
except Exception as e:
    print(f"Seeding error: {e}")
