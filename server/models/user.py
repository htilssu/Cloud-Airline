from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base


class User(Base):
    """Model for users who book flights."""

    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    bookings = relationship("Booking", back_populates="user")
