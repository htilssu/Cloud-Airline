from pydantic import BaseModel


class TicketTypeBase(BaseModel):
    name: str
    price_multiplier: float
    base_baggage_allowance_kg: int


class TicketType(TicketTypeBase):
    id: int

    class Config:
        from_attributes = True


class TicketTypeWithPrice(TicketType):
    """Schema for ticket type with calculated price for a specific flight"""

    description: str | None = None
