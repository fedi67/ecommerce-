import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def get_db_info():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432")
        )
        cur = conn.cursor()
        
        # Check column info
        cur.execute("""
            SELECT column_name, udt_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'products' AND column_name = 'embedding'
        """)
        col_info = cur.fetchone()
        print(f"Products 'embedding' column info: {col_info}")
        
        # Check vector dimension manually if possible
        cur.execute("""
            SELECT atttypmod 
            FROM pg_attribute 
            WHERE attrelid = 'products'::regclass AND attname = 'embedding'
        """)
        typmod = cur.fetchone()
        if typmod and typmod[0] != -1:
            print(f"Vector dimension (from atttypmod): {typmod[0]}")
        else:
            print("Vector dimension: dynamic or not found")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_db_info()
