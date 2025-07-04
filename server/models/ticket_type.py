from sqlalchemy import Column, Integer, String, Float
from models.base import Base


class TicketType(Base):
    """Model for ticket types like Economy, VIP."""

    __tablename__ = "ticket_types"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # "Economy", "VIP", "Business"
    price_multiplier = Column(Float, nullable=False, default=1.0)
    base_baggage_allowance_kg = Column(Integer, nullable=False, default=20)
