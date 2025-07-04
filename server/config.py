from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    POSTGRES_USER: str = "myuser"
    POSTGRES_PASSWORD: str = "mypassword"
    DATABASE_ENDPOINT: str = "db"
    POSTGRES_DB: str = "mydatabase"

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.DATABASE_ENDPOINT}:5432/{self.POSTGRES_DB}"


settings = Settings()
