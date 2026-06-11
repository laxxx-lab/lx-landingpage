import os
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader, OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import get_db
import models

import bcrypt

# Security Settings
SECRET_KEY = os.getenv("SECRET_KEY", "lx_secret_key_change_me_in_production_1234567890")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)
api_key_header = APIKeyHeader(name="X-API-KEY", auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def generate_api_key() -> tuple[str, str]:
    """
    Generates a raw API key and its hash.
    Returns: (raw_key, key_hash)
    """
    raw_key = f"lx_{secrets.token_hex(24)}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    return raw_key, key_hash

def get_current_admin(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.AdminUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(models.AdminUser).filter(models.AdminUser.username == username).first()
    if user is None:
        raise credentials_exception
    return user

def verify_api_key(
    api_key: Optional[str] = Depends(api_key_header),
    db: Session = Depends(get_db)
) -> models.ApiKey:
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API Key missing",
        )
    key_hash = hashlib.sha256(api_key.encode()).hexdigest()
    db_key = db.query(models.ApiKey).filter(models.ApiKey.key_hash == key_hash, models.ApiKey.is_active == True).first()
    if not db_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or inactive API Key",
        )
    return db_key

def get_admin_or_api_key(
    token: Optional[str] = Depends(oauth2_scheme),
    api_key: Optional[str] = Depends(api_key_header),
    db: Session = Depends(get_db)
) -> bool:
    """
    Authentication guard that accepts EITHER a valid Admin JWT OR a valid active API Key.
    """
    # 1. Verify Admin JWT
    if token:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username:
                user = db.query(models.AdminUser).filter(models.AdminUser.username == username).first()
                if user:
                    return True
        except JWTError:
            pass

    # 2. Verify API Key
    if api_key:
        key_hash = hashlib.sha256(api_key.encode()).hexdigest()
        db_key = db.query(models.ApiKey).filter(models.ApiKey.key_hash == key_hash, models.ApiKey.is_active == True).first()
        if db_key:
            return True

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required. Provide a valid Bearer Token or X-API-KEY header.",
    )
