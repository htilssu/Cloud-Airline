from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from core.jwt_helper import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    return payload["sub"] 