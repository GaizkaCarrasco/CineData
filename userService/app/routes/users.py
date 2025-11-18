from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from app.database import users_collection
from app.schemas import UserCreate, UserLogin, UserOut
from app.auth import hash_password, verify_password, create_access_token
from app.auth import get_current_user
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/users", tags=["Users"])


# Función para convertir Mongo Document a Pydantic
def user_to_response(user) -> UserOut:
    return UserOut(
        id=str(user["_id"]),
        username=user["username"],
        email=user["email"],
        role=user["role"]
    )


@router.post("/register", response_model=UserOut)
async def register_user(user: UserCreate):
    exists = await users_collection.find_one({"email": user.email})
    if exists:
        raise HTTPException(status_code=400, detail="Email ya registrado")

    hashed_pass = hash_password(user.password)

    new_user = {
        "username": user.username,
        "email": user.email,
        "password_hash": hashed_pass,
        "role": "user"
    }

    result = await users_collection.insert_one(new_user)
    new_user["_id"] = result.inserted_id

    return user_to_response(new_user)


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Swagger ALWAYS sends "username", so we treat it as the email
    email = form_data.username
    password = form_data.password

    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user["_id"]), "role": user["role"]})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "username": current_user["username"],
        "email": current_user["email"],
        "role": current_user["role"]
    }