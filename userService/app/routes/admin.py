from fastapi import APIRouter, Depends, HTTPException
from app.auth import require_role, hash_password
from app.database import users_collection
from app.schemas import UserCreate

router = APIRouter(prefix="/admin", tags=["Admin"])


# Ruta protegida solo para administradores
@router.get("/dashboard")
def admin_dashboard(current_admin: dict = Depends(require_role("admin"))):
    return {
        "message": "Bienvenido al panel de administración",
        "admin": current_admin["email"]
    }


# Otra ruta solo para administradores
@router.get("/stats")
def admin_stats(current_admin: dict = Depends(require_role("admin"))):
    return {
        "message": "Estadísticas del sistema (solo admin)",
        "role": current_admin["role"]
    }


# Ruta abierta para crear un usuario administrador (por ejemplo, instalación inicial)
@router.post("/open-create-admin")
async def open_create_admin_account(data: UserCreate):
    # Comprobar si existe email o username
    existing = await users_collection.find_one({
        "$or": [
            {"email": data.email},
            {"username": data.username}
        ]
    })

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pass = hash_password(data.password)

    new_admin = {
        "username": data.username,
        "email": data.email,
        "password_hash": hashed_pass,
        "role": "admin"
    }

    result = await users_collection.insert_one(new_admin)
    new_admin["_id"] = result.inserted_id

    return {
        "message": "Admin user created successfully",
        "username": data.username,
        "email": data.email,
        "role": "admin"
    }


# Lista de usuarios (solo accesible para administradores)
@router.get("/users")
async def list_users(current_admin: dict = Depends(require_role("admin"))):
    """Return only non-admin users.

    The frontend AdminUsers view should list regular users; admins
    are excluded from this listing.
    """
    users = []
    # Query only users whose role is not 'admin'
    cursor = users_collection.find({"role": {"$ne": "admin"}})
    async for u in cursor:
        users.append({
            "_id": str(u.get("_id")),
            "username": u.get("username"),
            "email": u.get("email"),
            "role": u.get("role"),
        })

    return users

@router.get("/users")
async def list_non_admin_users(current_admin=Depends(require_role("admin"))):
    users = await users_collection.find({"role": {"$ne": "admin"}}).to_list(None)

    for u in users:
        u["_id"] = str(u["_id"])

    return users

