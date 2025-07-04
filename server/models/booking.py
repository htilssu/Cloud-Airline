import enum
import datetime
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
    booking_time = Column(DateTime, default=datetime.datetime.utcnow)
    total_price = Column(Float, nullable=False)
    status = Column(Enum(BookingStatus), nullable=False, default=BookingStatus.PENDING)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="bookings")
    tickets = relationship("Ticket", back_populates="booking")
