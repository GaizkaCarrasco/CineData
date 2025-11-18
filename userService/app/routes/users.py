from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from app.database import users_collection
from app.schemas import UserCreate, UserLogin, UserOut
from app.auth import hash_password, verify_password, create_access_token
from app.auth import get_current_user, oauth2_scheme
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
    # OAuth2 form uses the field "username" — accept email or username here
    login_value = form_data.username
    password = form_data.password

    user = await users_collection.find_one({
        "$or": [
            {"email": login_value},
            {"username": login_value}
        ]
    })

    if not user or not verify_password(password, user.get("password_hash")):
        raise HTTPException(status_code=401, detail="Invalid email/username or password")

    token = create_access_token({"sub": str(user["_id"]), "role": user["role"]})

    return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user.get("id") or str(current_user.get("_id")),
        "username": current_user["username"],
        "email": current_user["email"],
        "role": current_user["role"]
    }

@router.post("/logout")
async def logout(current_user: UserOut = Depends(get_current_user), token: str = Depends(oauth2_scheme)):
    from app.database import revoked_tokens_collection

    await revoked_tokens_collection.insert_one({"token": token})

    return {"message": "Logout successful"}
