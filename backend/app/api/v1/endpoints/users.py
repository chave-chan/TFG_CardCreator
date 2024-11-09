from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.get("/")
async def get_users():
    return [{"username": "JohnDoe"}, {"username": "JaneDoe"}]

@router.post("/")
async def create_user(username: str):
    if username == "JohnDoe":
        raise HTTPException(status_code=400, detail="User already exists")
    return {"username": username, "message": "User has been created successfully"}
