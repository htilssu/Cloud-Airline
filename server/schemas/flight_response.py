from .flight import FlightBase


class Flight(FlightBase):
    id: int
    plane_id: int
    departure_airport_id: str
    arrival_airport_id: str

    class Config:
        orm_mode = True
