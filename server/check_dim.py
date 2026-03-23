import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

def check_dim():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("GEMINI_API_KEY not found")
        return
    client = genai.Client(api_key=api_key)
    res = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents="test"
    )
    print(f"Model: models/gemini-embedding-001")
    print(f"Dimension: {len(res.embeddings[0].values)}")

    # Check text-embedding-004 as well
    try:
        res4 = client.models.embed_content(
            model="models/text-embedding-004",
            contents="test"
        )
        print(f"Model: models/text-embedding-004")
        print(f"Dimension: {len(res4.embeddings[0].values)}")
    except:
        pass

if __name__ == "__main__":
    check_dim()
