from sqlalchemy.orm import Session
from models.booking import Booking, BookingStatus
from models.ticket import Ticket
from models.flight import Flight
from models.ticket_type import TicketType
from models.addon_option import AddonOption
from schemas.booking import BookingCreate
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import Depends, HTTPException
from database import get_db


class BookingService:
    """Service class for handling booking operations"""

    def __init__(self, db: Session):
        self.db = db

    def create_booking(self, booking_data: BookingCreate, user_id: int) -> Booking:
        """Create a new booking with tickets"""

        # Validate flight exists and has available seats
        flight = (
            self.db.query(Flight).filter(Flight.id == booking_data.flight_id).first()
        )
        if not flight:
            raise HTTPException(status_code=404, detail="Chuyến bay không tồn tại")

        if flight.available_seats < len(booking_data.passengers):
            raise HTTPException(
                status_code=400,
                detail=f"Chuyến bay chỉ còn {flight.available_seats} chỗ trống",
            )

        # Calculate total price
        total_price = 0
        ticket_details = []

        for passenger_data in booking_data.passengers:
            # Get ticket type
            ticket_type = (
                self.db.query(TicketType)
                .filter(TicketType.id == passenger_data.ticket_type_id)
                .first()
            )
            if not ticket_type:
                raise HTTPException(
                    status_code=400,
                    detail=f"Loại vé {passenger_data.ticket_type_id} không tồn tại",
                )

            # Calculate ticket price
            ticket_price = flight.base_price * ticket_type.price_multiplier

            # Calculate addons price
            addon_price = 0
            total_extra_baggage = 0

            if passenger_data.addon_option_ids:
                addons = (
                    self.db.query(AddonOption)
                    .filter(
                        AddonOption.id.in_(passenger_data.addon_option_ids),
                        AddonOption.is_active == True,
                    )
                    .all()
                )

                for addon in addons:
                    addon_price += addon.price
                    # Track extra baggage
                    if addon.category == "baggage":
                        # Parse baggage weight from metadata or name
                        baggage_kg = self._extract_baggage_weight(addon)
                        total_extra_baggage += baggage_kg

            final_price = ticket_price + addon_price
            total_price += final_price

            ticket_details.append(
                {
                    "passenger_data": passenger_data,
                    "ticket_type": ticket_type,
                    "final_price": final_price,
                    "extra_baggage_kg": total_extra_baggage,
                }
            )

        # Create booking
        booking = Booking(
            user_id=user_id,
            total_price=total_price,
            status=BookingStatus.PENDING,
            expires_at=datetime.now() + timedelta(minutes=30),
        )

        self.db.add(booking)
        self.db.flush()  # Get booking ID

        # Create tickets
        tickets = []
        for detail in ticket_details:
            ticket = Ticket(
                booking_id=booking.id,
                flight_id=booking_data.flight_id,
                ticket_type_id=detail["passenger_data"].ticket_type_id,
                passenger_name=detail["passenger_data"].passenger_name,
                extra_baggage_kg=detail["extra_baggage_kg"],
                final_price=detail["final_price"],
            )
            tickets.append(ticket)

        self.db.add_all(tickets)

        # Update flight available seats
        flight.available_seats -= len(booking_data.passengers)

        self.db.commit()
        self.db.refresh(booking)

        return booking

    def get_booking_by_id(
        self, booking_id: int, user_id: Optional[int] = None
    ) -> Optional[Booking]:
        """Get booking by ID, optionally filtered by user"""
        query = self.db.query(Booking).filter(Booking.id == booking_id)
        if user_id:
            query = query.filter(Booking.user_id == user_id)
        return query.first()

    def get_user_bookings(
        self, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Booking]:
        """Get all bookings for a user"""
        return (
            self.db.query(Booking)
            .filter(Booking.user_id == user_id)
            .order_by(Booking.booking_time.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def confirm_booking(self, booking_id: int, user_id: int) -> Booking:
        """Confirm a booking (simulate payment completion)"""
        booking = self.get_booking_by_id(booking_id, user_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking không tồn tại")

        if booking.status != BookingStatus.PENDING:
            raise HTTPException(
                status_code=400, detail="Booking này đã được xử lý hoặc đã bị hủy"
            )

        if booking.expires_at < datetime.now():
            raise HTTPException(status_code=400, detail="Booking đã hết hạn thanh toán")

        booking.status = BookingStatus.CONFIRMED
        self.db.commit()
        self.db.refresh(booking)

        return booking

    def cancel_booking(self, booking_id: int, user_id: int) -> Booking:
        """Cancel a booking"""
        booking = self.get_booking_by_id(booking_id, user_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking không tồn tại")

        if booking.status == BookingStatus.CONFIRMED:
            raise HTTPException(
                status_code=400, detail="Không thể hủy booking đã được xác nhận"
            )

        booking.status = BookingStatus.CANCELLED

        # Restore flight seats
        flight = (
            self.db.query(Flight)
            .filter(Flight.id == booking.tickets[0].flight_id)
            .first()
        )
        if flight:
            ticket_count = len(booking.tickets)
            flight.available_seats += ticket_count

        self.db.commit()
        self.db.refresh(booking)

        return booking

    def expire_old_bookings(self) -> int:
        """Expire bookings that are past their expiration time"""
        expired_bookings = (
            self.db.query(Booking)
            .filter(
                Booking.status == BookingStatus.PENDING,
                Booking.expires_at < datetime.now(),
            )
            .all()
        )

        count = 0
        for booking in expired_bookings:
            booking.status = BookingStatus.CANCELLED

            # Restore flight seats
            if booking.tickets:
                flight_id = booking.tickets[0].flight_id
                flight = self.db.query(Flight).filter(Flight.id == flight_id).first()
                if flight:
                    flight.available_seats += len(booking.tickets)

            count += 1

        if count > 0:
            self.db.commit()

        return count

    def _extract_baggage_weight(self, addon: AddonOption) -> int:
        """Extract baggage weight from addon metadata or name"""
        try:
            if addon.metadata_json:
                import json

                metadata = json.loads(addon.metadata_json)
                return metadata.get("weight_kg", 0)
        except:
            pass

        # Fallback: try to extract from name (e.g. "Extra 15kg baggage")
        import re

        match = re.search(r"(\d+)kg", addon.name.lower())
        if match:
            return int(match.group(1))

        return 0


def get_booking_service(db: Session = Depends(get_db)):
    return BookingService(db)
