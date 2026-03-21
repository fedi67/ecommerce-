import json
import requests
import base64

# Simple test script for AI analysis
URL = "http://127.0.0.1:8000/api/admin/products/analyze"
TOKEN = "your_token_here" # Note: This needs a real token if running against the live server

def test_analysis():
    payload = {
        "description": "Une magnifique robe de soirée en soie rouge, dos nu, élégante et raffinée. Prix 250€",
        "image_base64": None
    }
    
    # In a real scenario, we'd get a token via login
    # This is just to show the structure
    print(f"Testing analysis for: {payload['description']}")
    # response = requests.post(URL, json=payload, headers={"Authorization": f"Bearer {TOKEN}"})
    # print(response.json())

if __name__ == "__main__":
    test_analysis()
