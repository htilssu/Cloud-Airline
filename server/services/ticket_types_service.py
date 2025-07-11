from sqlalchemy.orm import Session
from models.ticket_type import TicketType
from models.flight import Flight
from typing import List, Optional
from fastapi import Depends
from database import get_db


class TicketTypesService:
    """Service class for handling ticket types operations"""

    def __init__(self, db: Session):
        self.db = db

    def get_ticket_types(self) -> List[TicketType]:
        """Lấy tất cả loại vé có sẵn"""
        return self.db.query(TicketType).all()

    def get_ticket_type_by_id(self, ticket_type_id: int) -> Optional[TicketType]:
        """Lấy loại vé theo ID"""
        return self.db.query(TicketType).filter(TicketType.id == ticket_type_id).first()

    @staticmethod
    def calculate_ticket_price(base_price: float, price_multiplier: float) -> float:
        """Tính giá vé dựa trên giá cơ bản và hệ số nhân"""
        return round(base_price * price_multiplier, 2)

    def get_ticket_options_for_flight(self, flight_id: int) -> List[dict]:
        """Lấy tất cả option vé cho một chuyến bay cụ thể với giá đã tính"""
        # Lấy thông tin chuyến bay
        flight = self.db.query(Flight).filter(Flight.id == flight_id).first()
        if not flight:
            return []

        # Lấy tất cả loại vé
        ticket_types = self.get_ticket_types()

        options = []
        for ticket_type in ticket_types:
            calculated_price = self.calculate_ticket_price(
                flight.base_price, ticket_type.price_multiplier
            )

            # Tạo mô tả cho từng loại vé
            description = self._get_ticket_type_description(ticket_type)

            # Create TicketTypeWithPrice object
            option = {
                "id": ticket_type.id,
                "name": ticket_type.name,
                "price_multiplier": ticket_type.price_multiplier,
                "base_baggage_allowance_kg": ticket_type.base_baggage_allowance_kg,
                "calculated_price": calculated_price,
                "description": description,
            }
            options.append(option)

        return options

    @staticmethod
    def _get_ticket_type_description(ticket_type: TicketType) -> str:
        """Tạo mô tả chi tiết cho loại vé"""
        descriptions = {
            "Economy": f"Vé hạng phổ thông - Hành lý ký gửi {ticket_type.base_baggage_allowance_kg}kg",
            "Business": f"Vé hạng thương gia - Hành lý ký gửi {ticket_type.base_baggage_allowance_kg}kg, ưu tiên check-in, suất ăn cao cấp",
            "VIP": f"Vé hạng nhất - Hành lý ký gửi {ticket_type.base_baggage_allowance_kg}kg, phòng chờ VIP, dịch vụ đưa đón",
            "Premium Economy": f"Vé hạng phổ thông cao cấp - Hành lý ký gửi {ticket_type.base_baggage_allowance_kg}kg, ghế rộng hơn",
        }

        return descriptions.get(
            ticket_type.name,
            f"Vé {ticket_type.name} - Hành lý ký gửi {ticket_type.base_baggage_allowance_kg}kg",
        )


def get_ticket_types_service(db: Session = Depends(get_db)):
    return TicketTypesService(db)
