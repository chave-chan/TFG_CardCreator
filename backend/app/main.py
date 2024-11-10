import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi import FastAPI
from app.api.v1.api_v1 import api_router
from app.core.config import settings
from app.database.session import engine, create_database
from app.database.base import Base

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

Base.metadata.create_all(bind=engine)
print("Tables created")

# Create the database tables
create_database()

# Include the API routes
app.include_router(api_router, prefix="/api/v1")

# Define the root route as an example
@app.get("/")
async def root():
    return {"message": "Hello, World!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
