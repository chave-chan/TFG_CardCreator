import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.database.session import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate

# Initialize the database session
db = SessionLocal()

# User data
user_data = UserCreate(
    email="new_user@example.com",
    name="Test User",
    picture=None
)

# Verify if the user already exists
existing_user = db.query(User).filter(User.email == user_data.email).first()
if existing_user:
    print("User already exists")
else:
    # Create a new user
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        picture=user_data.picture
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    print("User created", new_user)

# Close the database session
db.close()