from sqlalchemy import Column, Integer, String,Boolean,DateTime
from sqlalchemy.orm import relationship
from datetime import datetime 
from models.base import Base


class User(Base):
    """Model for users who book flights."""

    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    bookings = relationship("Booking", back_populates="user")
    phone_number = Column(String, unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow,nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_login_at = Column(DateTime)

    def __repr__(self):
        """String representation of User."""
        return f"<User {self.email}>"
    
