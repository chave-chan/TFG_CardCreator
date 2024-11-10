import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import requests
from google.oauth2 import id_token
from app.core.config import settings

async def verify_google_token(code: str):
    token_endpoint = "https://oauth2.googleapis.com/token"
    userinfo_endpoint = "https://www.googleapis.com/oauth2/v3/userinfo"

    # Change the authorization code for an access token
    token_data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": "http://localhost:8000/api/v1/auth/callback",
        "grant_type": "authorization_code",
    }
    token_response = requests.post(token_endpoint, data=token_data)
    token_json = token_response.json()

    if "access_token" not in token_json:
        return None

    access_token = token_json["access_token"]

    # Get the user info
    userinfo_response = requests.get(
        userinfo_endpoint, headers={"Authorization": f"Bearer {access_token}"}
    )
    userinfo = userinfo_response.json()
    return userinfo if userinfo_response.ok else None