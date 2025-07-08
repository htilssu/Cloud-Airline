from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator


class UserRegister(BaseModel):
    """Schema for user registration request."""

    email: EmailStr = Field(
        ..., 
        description="Email hợp lệ để đăng ký tài khoản",
        example="user@example.com"
    )
    password: str = Field(
        ..., 
        min_length=8, 
        description="Mật khẩu tối thiểu 8 ký tự",
        example="password123"
    )
    full_name: str = Field(
        ..., 
        min_length=1, 
        description="Họ tên đầy đủ của người dùng",
        example="Nguyễn Văn A"
    )
    phone_number: str = Field(
        ...,
        pattern=r"^\+?[0-9]{10,12}$",
        description="Số điện thoại 10-12 chữ số (có thể có + ở đầu)",
        example="+84123456789"
    )


class UserLogin(BaseModel):
    """Schema for user login request."""

    email: EmailStr = Field(
        ..., 
        description="Email đã đăng ký trong hệ thống",
        example="user@example.com"
    )
    password: str = Field(
        ..., 
        description="Mật khẩu tương ứng với email",
        example="password123"
    )


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
