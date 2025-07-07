from fastapi import APIRouter, Depends, status
from core.jwt_helper import create_access_token

from schemas.auth import UserRegister, UserResponse, UserLogin, TokenResponse
from services.auth_service import AuthService, get_auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def register_user(
    user_data: UserRegister, auth_service: AuthService = Depends(get_auth_service)
):
    """Register a new user."""
    user = auth_service.register_new_user(user_data)
    return user


@router.post("/login", response_model=TokenResponse)
def login_user(
    login_data: UserLogin, auth_service: AuthService = Depends(get_auth_service)
):
    """Login a user."""
    user = auth_service.authenticate_user(login_data)
    access_token = create_access_token(data={"sub": user.email})
    return TokenResponse(access_token=access_token, token_type="bearer")
