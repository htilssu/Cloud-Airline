import requests
import json

def test_login():
    """Test login with specific user credentials"""
    url = "http://localhost:8000/auth/login"
    data = {
        "email": "testuser1@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            token_data = response.json()
            print(f"✅ Login successful!")
            print(f"Token: {token_data.get('access_token', 'N/A')[:50]}...")
            print(f"Token Type: {token_data.get('token_type', 'N/A')}")
        else:
            print(f"❌ Login failed!")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("Testing login with testuser1@example.com...")
    test_login() 