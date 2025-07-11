from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum


class BookingStatus(str, Enum):
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    CANCELLED = "Cancelled"


class PassengerTicketCreate(BaseModel):
    passenger_name: str
    ticket_type_id: int
    addon_option_ids: Optional[List[int]] = []


class BookingCreate(BaseModel):
    flight_id: int
    passengers: List[PassengerTicketCreate]


class BookingResponse(BaseModel):
    id: int
    booking_time: datetime
    total_price: float
    status: BookingStatus
    user_id: int
    flight_id: int
    expires_at: datetime

    class Config:
        from_attributes = True


class BookingDetail(BookingResponse):
    tickets: List["TicketResponse"]
    flight: "FlightResponse"
    user: "UserResponse"


class TicketResponse(BaseModel):
    id: int
    passenger_name: str
    seat_number: Optional[str]
    extra_baggage_kg: int
    final_price: float
    ticket_type: "TicketTypeResponse"

    class Config:
        from_attributes = True


class TicketTypeResponse(BaseModel):
    id: int
    name: str
    price_multiplier: float
    base_baggage_allowance_kg: int

    class Config:
        from_attributes = True


class FlightResponse(BaseModel):
    id: int
    flight_number: str
    departure_time: datetime
    arrival_time: datetime
    departure_airport: "AirportResponse"
    arrival_airport: "AirportResponse"

    class Config:
        from_attributes = True


class AirportResponse(BaseModel):
    id: str
    name: str
    city: str

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int
    email: str
    name: str

    class Config:
        from_attributes = True
