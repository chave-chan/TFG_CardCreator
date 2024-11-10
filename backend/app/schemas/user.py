from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    name: str | None = None
    picture: str | None = None

class UserCreate(UserBase):
    pass

class UserInDB(UserBase):
    id: int

    class Config:
        orm_mode = True