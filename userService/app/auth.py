
from datetime import datetime, timedelta
from jose import jwt
from passlib.hash import pbkdf2_sha256

# Use PBKDF2-SHA256 for password hashing: it doesn't have bcrypt's
# 72-byte input limit and is widely supported. If you prefer bcrypt
# semantics, re-hash existing passwords or migrate users accordingly.
SECRET_KEY = "super-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def hash_password(password: str) -> str:
    return pbkdf2_sha256.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pbkdf2_sha256.verify(password, hashed)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
