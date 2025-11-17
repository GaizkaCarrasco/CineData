from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import users_collection
from app.schemas import UserCreate, UserLogin, UserOut
from app.auth import hash_password, verify_password, create_access_token

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
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    if not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    token = create_access_token({"sub": str(db_user["_id"])})

    return {"access_token": token, "token_type": "bearer"}
