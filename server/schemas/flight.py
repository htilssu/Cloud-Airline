from pydantic import BaseModel
from datetime import datetime
from models.flight import FlightStatus


class FlightBase(BaseModel):
    flight_number: str
    departure_time: datetime
    arrival_time: datetime
    base_price: float
    status: FlightStatus


class FlightCreate(FlightBase):
    pass


class Flight(FlightBase):
    id: int
    plane_id: int
    departure_airport_id: str
    arrival_airport_id: str

    class Config:
        orm_mode = True
