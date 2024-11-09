from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CardCreator"
    PROJECT_VERSION: str = "1.0.0"
    DATABASE_URL: str = "sqlite:///./test.db"

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str

    class Config:
        env_file = ".env"

settings = Settings()
