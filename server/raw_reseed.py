import os
import psycopg2
import json
import traceback
from google import genai
from dotenv import load_dotenv

# Find .env properly
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if not os.path.exists(dotenv_path):
    # Try server/.env from root
    dotenv_path = os.path.join('server', '.env')

print(f"Loading env from: {os.path.abspath(dotenv_path)}")
load_dotenv(dotenv_path)

def raw_reseed():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ CRITICAL: GEMINI_API_KEY not found in env!")
        return

    client = genai.Client(api_key=api_key)
    
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432")
    )
    cur = conn.cursor()
    
    try:
        # Reset descriptions for all products to force regeneration
        cur.execute("UPDATE products SET description = NULL")
        
        cur.execute("SELECT id, name, brand, category, gender, attributes FROM products")
        products = cur.fetchall()
        print(f"Processing {len(products)} products with IA generation (2.0 Flash)...")
        
        for pid, name, brand, cat, gender, attrs in products:
            attr_str = json.dumps(attrs, ensure_ascii=False) if attrs else "N/A"
            prompt = (
                f"Génère une description courte (2-3 phrases) et vendeuse pour un site e-commerce.\n"
                f"Produit: {name}\nMarque: {brand}\nCatégorie: {cat}\nCible: {gender}\nCaractéristiques: {attr_str}\n"
                f"Répond uniquement avec le texte de la description en français."
            )
            
            final_desc = ""
            try:
                # USE FULL MODEL NAME: models/gemini-2.0-flash
                response = client.models.generate_content(
                    model="models/gemini-2.0-flash", 
                    contents=prompt
                )
                final_desc = response.text.strip()
            except Exception as ex:
                print(f"⚠️ Erreur génération 2.0 pour {name}: {ex}")
                # Try 1.5 with full prefix
                try:
                    response = client.models.generate_content(
                        model="models/gemini-1.5-flash", 
                        contents=prompt
                    )
                    final_desc = response.text.strip()
                except Exception as ex2:
                    print(f"⚠️ Erreur génération 1.5 pour {name}: {ex2}")
                    final_desc = f"Découvrez notre {name} de la marque {brand}. Un choix élégant dans la catégorie {cat} pour {gender}."

            cur.execute("UPDATE products SET description = %s WHERE id = %s", (final_desc, pid))
            print(f"✨ Description: {name}")

            # Embedding (Always use models/ prefix)
            rich_text = f"{name} {brand or ''} {cat or ''} {gender or ''} {final_desc}"
            try:
                res = client.models.embed_content(
                    model="models/gemini-embedding-001",
                    contents=rich_text
                )
                vec = res.embeddings[0].values
                cur.execute("UPDATE products SET embedding = %s WHERE id = %s", (vec, pid))
                print(f"✓ Vecteur: {name}")
            except Exception as e:
                print(f"✗ Erreur embedding pour {name}: {e}")
        
        conn.commit()
        print("Opération terminée avec succès.")
    except Exception as e:
        print(f"Fatal error during reseed: {e}")
        traceback.print_exc()
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    raw_reseed()
