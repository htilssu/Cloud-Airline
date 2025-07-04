import enum
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
    Enum,
)
from sqlalchemy.orm import relationship
from .base import Base


class FlightStatus(enum.Enum):
    SCHEDULED = "Scheduled"
    ON_TIME = "On Time"
    DELAYED = "Delayed"
    CANCELLED = "Cancelled"
    COMPLETED = "Completed"


class Flight(Base):
    """Model for flights."""

    __tablename__ = "flights"
    id = Column(Integer, primary_key=True, index=True)
    flight_number = Column(String, unique=True, index=True, nullable=False)
    departure_time = Column(DateTime, nullable=False)
    arrival_time = Column(DateTime, nullable=False)
    base_price = Column(Float, nullable=False)
    status = Column(Enum(FlightStatus), nullable=False, default=FlightStatus.SCHEDULED)

    plane_id = Column(Integer, ForeignKey("planes.id"), nullable=False)
    departure_airport_id = Column(Integer, ForeignKey("airports.id"), nullable=False)
    arrival_airport_id = Column(Integer, ForeignKey("airports.id"), nullable=False)

    plane = relationship("Plane", back_populates="flights")
    departure_airport = relationship("Airport", foreign_keys=[departure_airport_id])
    arrival_airport = relationship("Airport", foreign_keys=[arrival_airport_id])
    tickets = relationship("Ticket", back_populates="flight")
