import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def check_existing_dim():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432")
        )
        cur = conn.cursor()
        # Use vector_dims(vector)
        cur.execute("SELECT id, name, vector_dims(embedding) FROM products WHERE embedding IS NOT NULL LIMIT 5")
        rows = cur.fetchall()
        for row in rows:
            print(f"ID: {row[0]}, Name: {row[1]}, Dim: {row[2]}")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_existing_dim()
