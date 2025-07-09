from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from database import get_db
from models.airport import Airport

router = APIRouter()


@router.get(
    "",
    tags=["Sân bay"],
    name="Lấy danh sách sân bay",
    description="Lấy danh sách tất cả sân bay",
    response_model=List[dict],
)
def get_airports(db: Session = Depends(get_db)):
    """Lấy danh sách tất cả sân bay"""
    airports = db.query(Airport).all()
    return [
        {
            "id": airport.id,
            "name": airport.name,
            "city": airport.city,
            "display": f"{airport.city} ({airport.id}) - {airport.name}"
        }
        for airport in airports
    ]


@router.get(
    "/search",
    tags=["Sân bay"],
    name="Tìm kiếm sân bay",
    description="Tìm kiếm sân bay theo tên thành phố hoặc tên sân bay",
    response_model=List[dict],
)
def search_airports(q: str, db: Session = Depends(get_db)):
    """Tìm kiếm sân bay theo query string"""
    airports = db.query(Airport).filter(
        Airport.name.ilike(f"%{q}%") | 
        Airport.city.ilike(f"%{q}%") |
        Airport.id.ilike(f"%{q}%")
    ).all()
    
    return [
        {
            "id": airport.id,
            "name": airport.name,
            "city": airport.city,
            "display": f"{airport.city} ({airport.id}) - {airport.name}"
        }
        for airport in airports
    ]
