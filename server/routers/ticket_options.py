from fastapi import APIRouter, Depends, HTTPException, Path
from typing import List

from schemas.ticket_type import TicketTypeWithPrice
from schemas.error import Error
from services.ticket_types_service import TicketTypesService, get_ticket_types_service

router = APIRouter()


@router.get(
    "/flights/{flight_id}/ticket-options",
    tags=["Vé máy bay"],
    name="Lấy các option vé cho chuyến bay",
    description="Lấy tất cả các loại vé có sẵn cho một chuyến bay cụ thể kèm theo giá đã tính",
    response_model=List[TicketTypeWithPrice],
    responses={
        200: {
            "description": "Danh sách các option vé với giá đã tính",
            "model": List[TicketTypeWithPrice],
        },
        404: {
            "description": "Chuyến bay không tồn tại",
            "model": Error,
        },
    },
)
def get_ticket_options_for_flight(
    flight_id: int = Path(..., description="ID của chuyến bay"),
    ticket_types_service: TicketTypesService = Depends(get_ticket_types_service),
):
    """
    Lấy tất cả các option vé cho một chuyến bay cụ thể.

    Bao gồm:
    - Các loại vé khác nhau (Economy, Business, VIP, v.v.)
    - Giá đã tính toán dựa trên giá cơ bản của chuyến bay
    - Thông tin hành lý được phép
    - Mô tả chi tiết các dịch vụ đi kèm
    """
    options = ticket_types_service.get_ticket_options_for_flight(flight_id)

    if not options:
        raise HTTPException(
            status_code=404,
            detail="Chuyến bay không tồn tại hoặc không có option vé nào",
        )

    return options


@router.get(
    "/ticket-options",
    tags=["Vé máy bay"],
    name="Lấy tất cả loại vé có sẵn",
    description="Lấy danh sách tất cả các loại vé trong hệ thống (không tính giá cụ thể)",
    response_model=List[TicketTypeWithPrice],
    responses={
        200: {
            "description": "Danh sách tất cả loại vé",
        },
    },
)
def get_all_ticket_types(
    ticket_types_service: TicketTypesService = Depends(get_ticket_types_service),
):
    """
    Lấy tất cả các loại vé có sẵn trong hệ thống.

    Endpoint này trả về thông tin chung về các loại vé
    mà không cần chỉ định chuyến bay cụ thể.
    """
    ticket_types = ticket_types_service.get_ticket_types()

    # Convert to response format (without calculated price)
    result = []
    for ticket_type in ticket_types:
        description = TicketTypesService._get_ticket_type_description(ticket_type)
        result.append(
            {
                "id": ticket_type.id,
                "name": ticket_type.name,
                "price_multiplier": ticket_type.price_multiplier,
                "base_baggage_allowance_kg": ticket_type.base_baggage_allowance_kg,
                "calculated_price": 0.0,  # Không có giá cụ thể
                "description": description,
            }
        )

    return result
