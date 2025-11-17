from bson import ObjectId

# Esto permite que los ObjectId se conviertan a string automáticamente
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)
    
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


# Convierte un documento de Mongo en un formato JSON serializable
def serialize_mongo_document(document):
    """
    Convierte un documento MongoDB (que contiene ObjectId) 
    a un diccionario con tipos Python serializables.
    """
    if not document:
        return None

    document["_id"] = str(document["_id"])  # Convertir ObjectId a string
    return document
