from pydantic import BaseModel
from datetime import datetime
from models.flight import FlightStatus


class FlightBase(BaseModel):
    flight_number: str
    departure_time: datetime
    arrival_time: datetime
    base_price: float
    status: FlightStatus
