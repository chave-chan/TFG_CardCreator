import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi import APIRouter
from app.api.v1.endpoints import users, cards

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(cards.router, prefix="/cards", tags=["cards"])