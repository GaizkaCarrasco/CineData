from fastapi import FastAPI
from app.routes import users

app = FastAPI(
    title="CineData - Users Service",
    version="1.0",
)

app.include_router(users.router)
