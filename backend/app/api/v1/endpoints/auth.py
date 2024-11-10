import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi import APIRouter, Depends, Request, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.utils.auth import verify_google_token
from app.database.session import SessionLocal
from app.models.user import User
from app.schemas.user import UserInDB, UserCreate

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/auth/login", response_model=UserInDB)
def login(token: str, db: Session = Depends(get_db)):
    # Handles Google login by validating the token and saving user data if new.
    idinfo = verify_google_token(token)
    if not idinfo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )

    # Check if the user exists in the database
    user = db.query(User).filter(User.email == idinfo["email"]).first()
    if not user:
        # Create a new user if it doesn't exist
        user_data = UserCreate(
            email=idinfo["email"], 
            name=idinfo.get("name"), 
            picture=idinfo.get("picture")
        )
        user = User(**user_data.dict())
        db.add(user)
        db.commit()
        db.refresh(user)

    return user

@router.get("/google/login")
async def google_login():
    # Redirects to Google's OAuth 2.0 authorization page.
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}&"
        "response_type=code&"
        "redirect_uri=http://localhost:8000/api/v1/auth/callback&"
        "scope=openid%20email%20profile"
    )
    return RedirectResponse(url=google_auth_url)

@router.get("/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    # Handles the callback after Google authentication and retrieves user info.
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="No authorization code found")

    user_info = await verify_google_token(code)
    if not user_info:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Check if the user exists in the database
    user = db.query(User).filter(User.email == user_info["email"]).first()
    if not user:
        # Create a new user if it doesn't exist
        user_data = UserCreate(
            email=user_info["email"],
            name=user_info.get("name"),
            picture=user_info.get("picture")
        )
        user = User(**user_data.dict())
        db.add(user)
        db.commit()
        db.refresh(user)

    return {"message": "User authenticated", "user_info": user_info}