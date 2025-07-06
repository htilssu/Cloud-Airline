from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator


class UserRegister(BaseModel):
    """Schema for user registration request."""

    email: EmailStr
    password: str = Field(
        ..., min_length=8, description="Password must be at least 8 characters"
    )
    full_name: str = Field(..., min_length=1, description="Full name cannot be empty")
    phone_number: str = Field(
        ...,
        pattern=r"^\+?[0-9]{10,12}$",
        description="Phone number must be 10-12 digits",
    )


class UserLogin(BaseModel):
    """Schema for user login request."""

    email: EmailStr
    password: str = Field(..., description="User password")


class UserResponse(BaseModel):
    """Schema for user response (after registration/login)."""

    id: int
    email: str
    full_name: str
    phone_number: str
    is_active: bool
    is_verified: bool
    created_at: str

    # Format created_at to dd/MM/yyyy
    @field_validator("created_at", mode="before")
    @classmethod
    def format_created_at(cls, v):
        if isinstance(v, datetime):
            return v.strftime("%d/%m/%Y")
        return v

    class Config:
        from_attributes = True  # For SQLAlchemy model conversion


class TokenResponse(BaseModel):
    """Schema for token response after login."""
    
    access_token: str
    token_type: str = "bearer"
