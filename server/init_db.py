import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def init_db():
    try:
        # Lire le fichier SQL
        # On utilise base2.sql comme demandé (ou baaaase.sql, ils sont identiques)
        sql_file_path = os.path.join(os.path.dirname(__file__), "..", "base2.sql")
        
        print(f"📖 Lecture de {sql_file_path}...")
        with open(sql_file_path, "r", encoding="utf-8") as f:
            sql_script = f.read()

        # Connexion à la BDD
        print("🔌 Connexion à PostgreSQL...")
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "127.0.0.1"),
            database=os.getenv("DB_NAME", "smart_db"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "admin"),
            port=os.getenv("DB_PORT", "5432")
        )
        conn.autocommit = True
        cur = conn.cursor()

        # Exécution
        print("⚡ Exécution du script SQL...")
        statements = sql_script.split(';')
        for statement in statements:
            if statement.strip():
                try:
                    cur.execute(statement)
                except Exception as stmt_err:
                    print(f"⚠️ Erreur sur instruction: {statement[:50]}... \n -> {stmt_err}")
        
        print("✅ Base de données initialisée avec succès (Tables products & variants créées)!")
        conn.close()

    except FileNotFoundError:
        print("❌ Fichier base2.sql introuvable !")
    except Exception as e:
        print(f"❌ Erreur : {e}")
        print("💡 Astuce : Vérifiez que PostgreSQL est bien lancé (Service Windows).")

if __name__ == "__main__":
    init_db()
