import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

try:
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Bonjour, réponds en JSON: {'test': 'ok'}",
        config={"response_mime_type": "application/json"}
    )
    print("AI Response:")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
