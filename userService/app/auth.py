
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.hash import pbkdf2_sha256
from passlib.context import CryptContext
from bson import ObjectId
from app.database import revoked_tokens_collection
from app.database import users_collection

# Use PBKDF2-SHA256 for password hashing: it doesn't have bcrypt's
# 72-byte input limit and is widely supported. If you prefer bcrypt
# semantics, re-hash existing passwords or migrate users accordingly.
SECRET_KEY = "super-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

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


# OAuth2 scheme for dependency
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Check whether the token has been revoked
    if await is_token_revoked(token):
        raise HTTPException(status_code=401, detail="Token has been revoked")

    user_id = payload.get("sub") or payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    try:
        obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid user id in token")

    # users_collection is async (motor) so callers must await this dependency
    from app.database import users_collection
    user = await users_collection.find_one({"_id": obj_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["id"] = str(user["_id"])
    user["favorites"] = user.get("favorites", [])
    # remove sensitive fields
    user.pop("password_hash", None)
    return user

async def is_token_revoked(token: str) -> bool:
    return await revoked_tokens_collection.find_one({"token": token}) is not None

def require_role(required_role: str):
    def make_checker(required_role_inner: str):
        async def role_checker(token: str = Depends(oauth2_scheme)):
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

                # Check token revocation using async helper
                if await is_token_revoked(token):
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Token revoked"
                    )

                # Accept sub (user id) or user_id or email as identity
                identity = payload.get("sub") or payload.get("user_id") or payload.get("email")
                if not identity:
                    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

                # Try to resolve identity as ObjectId first, otherwise treat as email
                query = None
                try:
                    obj_id = ObjectId(identity)
                    query = {"_id": obj_id}
                except Exception:
                    query = {"email": identity}

                user = await users_collection.find_one(query)
                if not user:
                    raise HTTPException(status_code=404, detail="User not found")

                if user.get("role") != required_role_inner:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Requires {required_role_inner} role"
                    )

                # sanitize and attach id
                user["id"] = str(user.get("_id"))
                user.pop("password_hash", None)
                return user

            except JWTError:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token"
                )

        return role_checker

    return make_checker(required_role)