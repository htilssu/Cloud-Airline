from fastapi import APIRouter, Depends, HTTPException, Path
from typing import List

from schemas.ticket_type import TicketTypeWithPrice
from schemas.error import Error
from services.ticket_types_service import TicketTypesService, get_ticket_types_service
from services.addon_options_service import (
    AddonOptionsService,
    get_addon_options_service,
)
from schemas.addon_option import AddonOptionsGroupedByCategory, AddonOptionResponse

router = APIRouter()


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

    return ticket_types


@router.get(
    "/addon-options",
    name="Lấy tất cả addon options",
    description="Lấy danh sách tất cả các addon options được nhóm theo category (hành lý, đồ ăn, dịch vụ, v.v.)",
    response_model=List[AddonOptionsGroupedByCategory],
    responses={
        200: {
            "description": "Danh sách addon options được nhóm theo category",
        },
    },
)
def get_addon_options(
    addon_service: AddonOptionsService = Depends(get_addon_options_service),
):
    """
    Lấy tất cả các addon options có sẵn, được nhóm theo category.

    Categories bao gồm:
    - baggage: Hành lý ký gửi thêm
    - meal: Đồ ăn & thức uống
    - seat: Chọn chỗ ngồi
    - service: Dịch vụ khác
    """
    return addon_service.get_addon_options_grouped_by_category()


@router.get(
    "/addon-options/{category}",
    name="Lấy addon options theo category",
    description="Lấy danh sách addon options cho một category cụ thể",
    responses={
        200: {
            "description": "Danh sách addon options cho category được chỉ định",
            "model": List[AddonOptionResponse],
        },
        404: {
            "description": "Category không tồn tại hoặc không có options nào",
            "model": Error,
        },
    },
)
def get_addon_options_by_category(
    category: str = Path(
        ..., description="Category của addon (baggage, meal, seat, service)"
    ),
    addon_service: AddonOptionsService = Depends(get_addon_options_service),
):
    """
    Lấy tất cả addon options cho một category cụ thể.

    Available categories:
    - baggage: Hành lý ký gửi thêm
    - meal: Đồ ăn & thức uống
    - seat: Chọn chỗ ngồi
    - service: Dịch vụ khác
    """
    options = addon_service.get_addon_options_by_category(category)

    if not options:
        raise HTTPException(
            status_code=404,
            detail=f"Không tìm thấy addon options cho category '{category}'",
        )

    # Convert to response format with parsed metadata
    result = []
    for option in options:
        metadata = None
        if option.metadata_json:
            try:
                import json

                metadata = json.loads(option.metadata_json)
            except json.JSONDecodeError:
                metadata = None

        result.append(
            {
                "id": option.id,
                "name": option.name,
                "category": option.category,
                "description": option.description,
                "price": option.price,
                "is_active": option.is_active,
                "metadata": metadata,
            }
        )

    return result


@router.get(
    "/{flight_id}",
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
