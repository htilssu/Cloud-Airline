from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import date, datetime

from schemas import Flight
from database import get_db
from services import flights_service
from schemas.error import Error

router = APIRouter()


@router.get(
    "/",
    tags=["Chuyến bay"],
    name="Lấy danh sách chuyến bay, có điều kiện",
    description="Lấy danh sách chuyến bay",
    responses={
        200: {
            "description": "Danh sách chuyến bay",
            "model": List[Flight],
        },
        400: {
            "description": "Định dạng ngày không hợp lệ hoặc đang lấy chuyến bay của quá khứ",
            "model": Error,
        },
    },
)
def read_flights(
    skip: int = 0,
    limit: int = 100,
    flight_date: str | None = Query(
        default=None, description="Ngày bay theo định dạng dd/MM/yyyy"
    ),
    departure_airport_id: str | None = Query(
        default=None, description="Mã sân bay đi (VD: HAN)"
    ),
    arrival_airport_id: str | None = Query(
        default=None, description="Mã sân bay đến (VD: SGN)"
    ),
    db: Session = Depends(get_db),
):
    parsed_date: date | None = None
    if flight_date:
        try:
            parsed_date = datetime.strptime(flight_date, "%d/%m/%Y").date()
            if parsed_date < date.today():
                raise HTTPException(
                    status_code=400,
                    detail="Không thể truy vấn các chuyến bay trong quá khứ.",
                )
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng dd/MM/yyyy.",
            )
    flights = flights_service.get_flights(
        db,
        skip=skip,
        limit=limit,
        flight_date=parsed_date,
        departure_airport_id=departure_airport_id,
        arrival_airport_id=arrival_airport_id,
    )
    return flights


@router.get(
    "/{flight_id_or_number}",
    tags=["Chuyến bay"],
    name="Lấy thông tin chi tiết chuyến bay dựa vào số hiệu chuyến bay hoặc ID",
    description="Lấy thông tin chuyến bay",
    responses={
        200: {
            "description": "Thông tin chuyến bay",
            "model": Flight,
        },
        404: {
            "description": "Chuyến bay không tồn tại",
            "model": Error,
        },
    },
)
def read_flight(
    flight_id_or_number: str = Query(
        ..., description="Số hiệu chuyến bay hoặc ID chuyến bay"
    ),
    db: Session = Depends(get_db),
):
    db_flight = flights_service.get_flight_by_id_or_number(
        db, flight_id_or_number=flight_id_or_number
    )
    if db_flight is None:
        raise HTTPException(status_code=404, detail="Chuyến bay không tồn tại")
    return db_flight
