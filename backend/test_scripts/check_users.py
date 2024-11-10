import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from dotenv import load_dotenv
load_dotenv(dotenv_path="backend/.env")
from app.database.session import SessionLocal
from app.models.user import User

# Create a database session
db = SessionLocal()

# Consult all users
users = db.query(User).all()

# Print the users
if not users:
    print("No users found")
for user in users:
    print(f"ID: {user.id}, Email: {user.email}, Name: {user.name}")

# Close the database session
db.close()
