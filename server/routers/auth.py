from fastapi import APIRouter, Depends, status
from core.jwt_helper import create_access_token

from schemas.auth import UserRegister, UserResponse, UserLogin, TokenResponse
from services.auth_service import AuthService, get_auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register", 
    response_model=UserResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Đăng ký người dùng mới",
    description="""
    Đăng ký tài khoản người dùng mới với thông tin:
    
    - **email**: Email hợp lệ (sẽ được sử dụng để đăng nhập)
    - **password**: Mật khẩu tối thiểu 8 ký tự
    - **full_name**: Họ tên đầy đủ
    - **phone_number**: Số điện thoại 10-12 chữ số
    
    **Response**: Thông tin người dùng đã tạo (không bao gồm password)
    """,
    responses={
        201: {
            "description": "Đăng ký thành công",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "email": "user@example.com",
                        "full_name": "Nguyễn Văn A",
                        "phone_number": "+84123456789",
                        "is_active": True,
                        "is_verified": False,
                        "created_at": "01/01/2024"
                    }
                }
            }
        },
        400: {
            "description": "Dữ liệu không hợp lệ",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Email đã tồn tại trong hệ thống"
                    }
                }
            }
        }
    }
)
def register_user(
    user_data: UserRegister, auth_service: AuthService = Depends(get_auth_service)
):
    """
    Đăng ký người dùng mới.
    
    Tạo tài khoản mới với email và password. Email phải là duy nhất trong hệ thống.
    """
    user = auth_service.register_new_user(user_data)
    return user


@router.post(
    "/login", 
    response_model=TokenResponse,
    summary="Đăng nhập người dùng",
    description="""
    Đăng nhập vào hệ thống với email và password.
    
    - **email**: Email đã đăng ký
    - **password**: Mật khẩu tương ứng
    
    **Response**: JWT access token để sử dụng cho các API khác
    """,
    responses={
        200: {
            "description": "Đăng nhập thành công",
            "content": {
                "application/json": {
                    "example": {
                        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "token_type": "bearer"
                    }
                }
            }
        },
        401: {
            "description": "Thông tin đăng nhập không đúng",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Email hoặc mật khẩu không đúng"
                    }
                }
            }
        }
    }
)
def login_user(
    login_data: UserLogin, auth_service: AuthService = Depends(get_auth_service)
):
    """
    Đăng nhập người dùng.
    
    Xác thực email và password, trả về JWT token nếu thành công.
    """
    user = auth_service.authenticate_user(login_data)
    access_token = create_access_token(data={"sub": user.email})
    return TokenResponse(access_token=access_token, token_type="bearer")
