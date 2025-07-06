from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from core.jwt_helper import create_access_token

from database import get_db
from schemas.auth import UserRegister, UserResponse, UserLogin, TokenResponse
from services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user."""
    auth_service = AuthService(db)
    user = auth_service.register_new_user(user_data)
    return user


@router.post("/login", response_model=TokenResponse)
def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login a user."""
    auth_service = AuthService(db)
    user = auth_service.authenticate_user(login_data)
    access_token = create_access_token(data={"sub": user.email})
    return TokenResponse(access_token=access_token, token_type="bearer")
