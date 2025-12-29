from pydantic import BaseModel

# Input model (NO id)
class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    quantity: int

# Output model (WITH id)
class Product(ProductCreate):
    id: int

    class Config:
        from_attributes = True   # ✅ REQUIRED (Pydantic v2)
