from pydantic import BaseModel, EmailStr

class LoginModel(BaseModel):
    email: EmailStr
    password: str

class CreateAdminUser(BaseModel):
    username: str
    email: EmailStr
    password: str