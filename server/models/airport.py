from sqlalchemy import Column, Integer, String
from models.base import Base


class Airport(Base):
    """Model for airports."""

    __tablename__ = "airports"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)  # e.g., "SGN"
    name = Column(String, nullable=False)  # e.g., "Tan Son Nhat International Airport"
    city = Column(String, nullable=False)
