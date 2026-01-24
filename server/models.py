from sqlalchemy import Column, Integer, String, Text, DECIMAL, TIMESTAMP, func, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    brand = Column(String(50))
    category = Column(String(50))
    description = Column(Text)
    image_url = Column(Text)
    attributes = Column(JSONB, default={})
    created_at = Column(TIMESTAMP, server_default=func.now())

    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"))
    
    size = Column(String(20))
    color = Column(String(50))
    color_hex = Column(String(7))
    
    price = Column(DECIMAL(10, 2), nullable=False)
    promo_price = Column(DECIMAL(10, 2), nullable=True)
    stock_quantity = Column(Integer, default=0)
    sku = Column(String(50), unique=True)

    product = relationship("Product", back_populates="variants")
