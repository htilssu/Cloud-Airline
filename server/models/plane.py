from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base


class Plane(Base):
    """Model for aircraft."""

    __tablename__ = "planes"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)  # e.g., "VN-A350"
    total_seats = Column(Integer, nullable=False)
    flights = relationship("Flight", back_populates="plane")
