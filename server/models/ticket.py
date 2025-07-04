from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from .base import Base


class Ticket(Base):
    """Model for an individual flight ticket."""

    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, index=True)
    passenger_name = Column(String, nullable=False)
    seat_number = Column(String, nullable=True)  # e.g., "A23", "B12"
    extra_baggage_kg = Column(Integer, default=0)
    final_price = Column(Float, nullable=False)

    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    flight_id = Column(Integer, ForeignKey("flights.id"), nullable=False)
    ticket_type_id = Column(Integer, ForeignKey("ticket_types.id"), nullable=False)

    booking = relationship("Booking", back_populates="tickets")
    flight = relationship("Flight", back_populates="tickets")
    ticket_type = relationship("TicketType")
