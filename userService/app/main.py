from fastapi import FastAPI
from app.routes import users
from app.routes import admin

app = FastAPI(
    title="CineData - Users Service",
    version="1.0",
)

app.include_router(users.router)
app.include_router(admin.router)
