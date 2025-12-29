from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import database_models
from database import SessionLocal, engine
from models import Product, ProductCreate

# Create DB tables
database_models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS (for React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://tracify-pro.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- INITIAL DATA (ONLY FOR FIRST RUN) ----------

initial_products = [
    ProductCreate(
        name="Apple iPhone 15 Pro Max",
        description="6.7-inch OLED display, A17 Pro chip, 256GB storage, triple-camera system",
        price=1299.99,
        quantity=25,
    ),
    ProductCreate(
        name="Samsung Galaxy S24 Ultra",
        description="6.8-inch AMOLED 120Hz display, Snapdragon 8 Gen 3, 12GB RAM, 512GB storage",
        price=1199.99,
        quantity=30,
    ),
    ProductCreate(
        name="Google Pixel 8 Pro",
        description="6.7-inch LTPO OLED display, Google Tensor G3, 128GB storage, AI camera",
        price=999.99,
        quantity=20,
    ),
    ProductCreate(
        name="OnePlus 12",
        description="6.82-inch 120Hz AMOLED, Snapdragon 8 Gen 3, 16GB RAM, 512GB storage",
        price=899.99,
        quantity=35,
    ),
    ProductCreate(
        name="Xiaomi 14 Pro",
        description="6.73-inch QHD+ AMOLED, Snapdragon 8 Gen 3, Leica cameras",
        price=799.99,
        quantity=40,
    ),
]



def init_db():
    db = SessionLocal()
    count = db.query(database_models.Product).count()

    if count == 0:
        for product in initial_products:
            db.add(database_models.Product(**product.model_dump()))
        db.commit()
        print("Database initialized with sample products")

    db.close()


init_db()

# ------------------- API ENDPOINTS -------------------

# Get all products
@app.get("/products/", response_model=list[Product])
def get_all_products(db: Session = Depends(get_db)):
    return db.query(database_models.Product).all()


# Get product by ID
@app.get("/products/{product_id}", response_model=Product)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(database_models.Product)\
                .filter(database_models.Product.id == product_id)\
                .first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.post("/products/", response_model=Product)

def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = database_models.Product(
        name=product.name,
        description=product.description,
        price=product.price,
        quantity=product.quantity
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


# Update product
@app.put("/products/{product_id}", response_model=Product)
def update_product(product_id: int, product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product)\
                   .filter(database_models.Product.id == product_id)\
                   .first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    db_product.name = product.name
    db_product.description = product.description
    db_product.price = product.price
    db_product.quantity = product.quantity

    db.commit()
    db.refresh(db_product)
    return db_product


# Delete product
@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product)\
                   .filter(database_models.Product.id == product_id)\
                   .first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}
