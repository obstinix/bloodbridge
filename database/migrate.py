"""Run all pending SQL migrations in order."""
import os, glob, mysql.connector
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

    # Create migrations table if absent
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS _migrations (
            filename VARCHAR(255) PRIMARY KEY,
            run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    for path in sorted(glob.glob('database/migrations/*.sql')):
        fname = os.path.basename(path)
        cursor.execute("SELECT filename FROM _migrations WHERE filename=%s", (fname,))
        if cursor.fetchone():
            continue
        print(f"Running {fname}...")
        with open(path) as f:
            for stmt in f.read().split(';'):
                stmt = stmt.strip()
                if stmt:
                    cursor.execute(stmt)
        cursor.execute("INSERT INTO _migrations (filename) VALUES (%s)", (fname,))
        conn.commit()
        print(f"  Done.")

    cursor.close()
    conn.close()
    print("All migrations applied.")
except Exception as e:
    print(f"Migration error: {e}")
