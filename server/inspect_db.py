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
    cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products';")
    columns = cur.fetchall()
    print("Columns in 'products' table:")
    for col in columns:
        print(f" - {col[0]}: {col[1]}")
    
    cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'product_variants';")
    columns = cur.fetchall()
    print("\nColumns in 'product_variants' table:")
    for col in columns:
        print(f" - {col[0]}: {col[1]}")
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")
