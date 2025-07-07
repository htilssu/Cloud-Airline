from datetime import datetime
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status

from models.user import User
from schemas.auth import UserRegister, UserLogin
from database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def get_password_hash(self, password: str) -> str:
        """Hash a pasasword for storing."""
        return pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return pwd_context.verify(plain_password, hashed_password)

    def register_new_user(self, user_data: UserRegister) -> User:
        """Register a new user."""
        # Check email exists
        if self.db.query(User).filter(User.email == user_data.email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        # Check phone number exists
        if (
            self.db.query(User)
            .filter(User.phone_number == user_data.phone_number)
            .first()
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already registered",
            )

        # Create user
        user = User(
            email=user_data.email,
            hashed_password=self.get_password_hash(user_data.password),
            full_name=user_data.full_name,
            phone_number=user_data.phone_number,
            created_at=datetime.utcnow(),
            is_active=True,
            is_verified=False,
        )

        try:
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            return user
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could no register user",
            ) from e

    def authenticate_user(self, login_data: UserLogin) -> User:
        """Authenticate a user for login."""
        # Find user by email
        user = self.db.query(User).filter(User.email == login_data.email).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated",
            )

        # Verify password
        if not self.verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        # Update last login time
        try:
            user.last_login_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(user)
        except Exception:
            self.db.rollback()
            # Don't fail login if we can't update last_login_at
            pass

        return user


def get_auth_service(db: Session = Depends(get_db)):
    return AuthService(db)
