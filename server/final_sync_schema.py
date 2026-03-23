import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

try:
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "127.0.0.1"),
        database=os.getenv("DB_NAME", "smart_db"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "admin"),
        port=os.getenv("DB_PORT", "5432")
    )
    cur = conn.cursor()
    
    print("Adding 'gender' and 'embedding' columns to 'products' table...")
    cur.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS gender VARCHAR(20);")
    cur.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS embedding vector(3072);")
    
    print("Applying updates from update_db.py as well...")
    cur.execute("ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;")
    cur.execute("UPDATE customers SET is_admin = TRUE WHERE email ILIKE '%@shop.com';")
    
    conn.commit()
    print("✅ Database sync successful!")
    conn.close()
except Exception as e:
    print(f"❌ Error during sync: {e}")
