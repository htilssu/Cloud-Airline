from sqlalchemy import Column, String
from models.base import Base


class Airport(Base):
    """Model for airports."""

    __tablename__ = "airports"
    id = Column(String(3), primary_key=True, index=True)  # e.g., "SGN", "HAN"
    name = Column(String, nullable=False)  # e.g., "Tan Son Nhat International Airport"
    city = Column(String, nullable=False)
