from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    POSTGRES_USER: str = "myuser"
    POSTGRES_PASSWORD: str = "mypassword"
    DATABASE_ENDPOINT: str = "db"
    POSTGRES_DB: str = "mydatabase"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Ensure ALGORITHM is clean
        self.ALGORITHM = self.ALGORITHM.strip()

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.DATABASE_ENDPOINT}:5432/{self.POSTGRES_DB}"

    class Config:
        env_file = ".env"


settings = Settings()
