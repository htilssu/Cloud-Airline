import enum
from datetime import datetime, timedelta
from sqlalchemy import (
    Column,
    Integer,
    Float,
    DateTime,
    ForeignKey,
    Enum,
)
from sqlalchemy.orm import relationship
from models.base import Base


class BookingStatus(enum.Enum):
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    CANCELLED = "Cancelled"


class Booking(Base):
    """Represents a single booking transaction which can contain multiple tickets."""

    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    booking_time = Column(DateTime, default=datetime.now)
    total_price = Column(Float, nullable=False)
    status = Column(Enum(BookingStatus), nullable=False, default=BookingStatus.PENDING)
    expires_at = Column(DateTime, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="bookings")
    tickets = relationship("Ticket", back_populates="booking")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.expires_at:
            self.expires_at = datetime.now() + timedelta(minutes=30)
