from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database_models
from database import SessionLocal, engine
from models import Product

database_models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS for React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# list of products with 4 products like phones, laptops, pens, tables
products = [
    Product(
        id=1,
        name="Apple iPhone 15 Pro Max",
        description="6.7-inch OLED display, A17 Pro chip, 256GB storage, triple-camera system",
        price=1299.99,
        quantity=25,
    ),
    Product(
        id=2,
        name="Samsung Galaxy S24 Ultra",
        description="6.8-inch AMOLED 120Hz display, Snapdragon 8 Gen 3, 12GB RAM, 512GB storage",
        price=1199.99,
        quantity=30,
    ),
    Product(
        id=3,
        name="Google Pixel 8 Pro",
        description="6.7-inch LTPO OLED display, Google Tensor G3, 128GB storage, advanced AI camera",
        price=999.99,
        quantity=20,
    ),
    Product(
        id=4,
        name="OnePlus 12",
        description="6.82-inch 120Hz AMOLED, Snapdragon 8 Gen 3, 16GB RAM, 512GB storage",
        price=899.99,
        quantity=35,
    ),
    Product(
        id=5,
        name="Xiaomi 14 Pro",
        description="6.73-inch QHD+ AMOLED, Snapdragon 8 Gen 3, Leica triple-camera setup",
        price=799.99,
        quantity=40,
    ),
]





def init_db():
    db = SessionLocal()

    existing_count = db.query(database_models.Product).count()

    if existing_count == 0:
        for product in products:
            db.add(database_models.Product(**product.model_dump()))
        db.commit()
        print("Database initialized with sample products.")
        
    db.close()

init_db()    

@app.get("/products/")
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(database_models.Product).all()
    return products


@app.get("/products/{product_id}")
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(database_models.Product).filter(database_models.Product.id == product_id).first()
    if product:
        return product
    return {"error": "Product not found"}

@app.post("/products/")
def create_product(product: Product, db: Session = Depends(get_db)):
    db.add(database_models.Product(**product.model_dump()))
    db.commit()
    return {"message": "Product created successfully", "product": product}

@app.put("/products/{product_id}")
def update_product(product_id: int, product: Product, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db_product.name = product.name
    db_product.description = product.description
    db_product.price = product.price
    db_product.quantity = product.quantity
    db.commit()
    db.refresh(db_product)
    return {"message": "Product updated successfully", "product": db_product}


@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}
