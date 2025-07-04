from sqlalchemy.orm import Session
from models.flight import Flight
from datetime import date, timedelta


def get_flights(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    flight_date: date | None = None,
    departure_airport_id: str | None = None,
    arrival_airport_id: str | None = None,
):
    query = db.query(Flight)
    if flight_date:
        query = query.filter(
            Flight.departure_time >= flight_date,
            Flight.departure_time < flight_date + timedelta(days=1),
        )
    else:
        query = query.filter(Flight.departure_time >= date.today())

    if departure_airport_id:
        query = query.filter(Flight.departure_airport_id == departure_airport_id)

    if arrival_airport_id:
        query = query.filter(Flight.arrival_airport_id == arrival_airport_id)
    return query.offset(skip).limit(limit).all()


def get_flight_by_number(db: Session, flight_number: str):
    return db.query(Flight).filter(Flight.flight_number == flight_number).first()
