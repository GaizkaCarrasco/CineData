from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.cinedata_users
users_collection = db.users
revoked_tokens_collection = db["revoked_tokens"]
