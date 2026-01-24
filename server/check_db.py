from database import SessionLocal
from models import Product

def check_db():
    db = SessionLocal()
    try:
        print("🔌 Tentative de connexion...")
        products = db.query(Product).all()
        print(f"✅ Connexion réussie !")
        print(f"📊 Nombre de produits trouvés : {len(products)}")
        for p in products:
            print(f"   - ID: {p.id} | Nom: {p.name} | Prix: (Voir Variants)")
    except Exception as e:
        print(f"❌ Erreur de connexion : {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_db()
