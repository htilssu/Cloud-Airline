# flake8: noqa
from .auth import UserRegister, UserLogin, UserResponse, TokenResponse
from .error import Error
from .flight import Flight, FlightBase, FlightCreate
from .ticket_type import TicketType, TicketTypeBase, TicketTypeWithPrice
from .addon_option import AddonOption, AddonOptionBase
from .booking import (
    BookingCreate,
    BookingResponse,
    BookingDetail,
    PassengerTicketCreate,
    TicketResponse,
    BookingStatus,
)
