from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import users
from app.routes import admin

app = FastAPI(
    title="CineData - Users Service",
    version="1.0",
)

# Habilitar CORS para el frontend (ajusta el origen si usas otro puerto/host)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(admin.router)
