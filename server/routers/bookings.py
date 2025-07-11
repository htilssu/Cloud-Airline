from fastapi import APIRouter, Depends, HTTPException
from typing import List

from schemas.booking import BookingCreate, BookingResponse, BookingDetail
from services.booking_service import BookingService, get_booking_service
from dependencies.auth import get_current_user
from models.user import User
from schemas.error import Error

router = APIRouter()


@router.post(
    "",
    tags=["Đặt vé"],
    name="Tạo booking mới",
    description="Tạo một booking mới với thông tin hành khách và vé",
    response_model=BookingResponse,
    responses={
        201: {
            "description": "Booking được tạo thành công",
            "model": BookingResponse,
        },
        400: {
            "description": "Dữ liệu không hợp lệ hoặc chuyến bay đã hết chỗ",
            "model": Error,
        },
        401: {
            "description": "Chưa đăng nhập",
            "model": Error,
        },
        404: {
            "description": "Chuyến bay không tồn tại",
            "model": Error,
        },
    },
)
def create_booking(
    booking_data: BookingCreate,
    booking_service: BookingService = Depends(get_booking_service),
    current_user: User = Depends(get_current_user),
):
    """
    Tạo booking mới cho chuyến bay.

    Booking sẽ có trạng thái PENDING và tự động hết hạn sau 30 phút nếu không thanh toán.
    """
    return booking_service.create_booking(booking_data, current_user.id)


@router.get(
    "",
    tags=["Đặt vé"],
    name="Lấy danh sách booking của user",
    description="Lấy tất cả booking của user hiện tại",
    response_model=List[BookingResponse],
    responses={
        200: {
            "description": "Danh sách booking",
        },
        401: {
            "description": "Chưa đăng nhập",
            "model": Error,
        },
    },
)
def get_user_bookings(
    skip: int = 0,
    limit: int = 100,
    booking_service: BookingService = Depends(get_booking_service),
    current_user: User = Depends(get_current_user),
):
    """
    Lấy tất cả booking của user hiện tại, sắp xếp theo thời gian booking giảm dần.
    """
    return booking_service.get_user_bookings(current_user.id, skip, limit)


@router.get(
    "/{booking_id}",
    tags=["Đặt vé"],
    name="Lấy chi tiết booking",
    description="Lấy thông tin chi tiết của một booking",
    response_model=BookingDetail,
    responses={
        200: {
            "description": "Chi tiết booking",
            "model": BookingDetail,
        },
        401: {
            "description": "Chưa đăng nhập",
            "model": Error,
        },
        404: {
            "description": "Booking không tồn tại",
            "model": Error,
        },
    },
)
def get_booking_detail(
    booking_id: int,
    booking_service: BookingService = Depends(get_booking_service),
    current_user: User = Depends(get_current_user),
):
    """
    Lấy thông tin chi tiết booking bao gồm vé, chuyến bay, và thông tin user.
    """
    booking = booking_service.get_booking_by_id(booking_id, current_user.id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking không tồn tại")
    return booking


@router.post(
    "/{booking_id}/confirm",
    tags=["Đặt vé"],
    name="Xác nhận thanh toán booking",
    description="Xác nhận thanh toán và chuyển booking sang trạng thái CONFIRMED",
    response_model=BookingResponse,
    responses={
        200: {
            "description": "Booking đã được xác nhận",
            "model": BookingResponse,
        },
        400: {
            "description": "Booking đã hết hạn hoặc không thể xác nhận",
            "model": Error,
        },
        401: {
            "description": "Chưa đăng nhập",
            "model": Error,
        },
        404: {
            "description": "Booking không tồn tại",
            "model": Error,
        },
    },
)
def confirm_booking(
    booking_id: int,
    booking_service: BookingService = Depends(get_booking_service),
    current_user: User = Depends(get_current_user),
):
    """
    Xác nhận thanh toán booking (mô phỏng việc thanh toán thành công).
    Booking phải còn trong thời hạn 30 phút và có trạng thái PENDING.
    """
    return booking_service.confirm_booking(booking_id, current_user.id)


@router.post(
    "/{booking_id}/cancel",
    tags=["Đặt vé"],
    name="Hủy booking",
    description="Hủy booking và hoàn trả chỗ ngồi",
    response_model=BookingResponse,
    responses={
        200: {
            "description": "Booking đã được hủy",
            "model": BookingResponse,
        },
        400: {
            "description": "Không thể hủy booking đã xác nhận",
            "model": Error,
        },
        401: {
            "description": "Chưa đăng nhập",
            "model": Error,
        },
        404: {
            "description": "Booking không tồn tại",
            "model": Error,
        },
    },
)
def cancel_booking(
    booking_id: int,
    booking_service: BookingService = Depends(get_booking_service),
    current_user: User = Depends(get_current_user),
):
    """
    Hủy booking và hoàn trả chỗ ngồi cho chuyến bay.
    Không thể hủy booking đã được xác nhận.
    """
    return booking_service.cancel_booking(booking_id, current_user.id)


@router.post(
    "/cleanup/expired",
    tags=["Đặt vé"],
    name="Dọn dẹp booking hết hạn",
    description="Tự động hủy các booking đã hết hạn (sử dụng cho background task)",
    responses={
        200: {
            "description": "Số lượng booking đã được dọn dẹp",
        },
    },
)
def cleanup_expired_bookings(
    booking_service: BookingService = Depends(get_booking_service),
):
    """
    Endpoint này được sử dụng bởi background task để tự động hủy
    các booking đã hết hạn 30 phút và hoàn trả chỗ ngồi.
    """
    count = booking_service.expire_old_bookings()
    return {"message": f"Đã dọn dẹp {count} booking hết hạn"}
