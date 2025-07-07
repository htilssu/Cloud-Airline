import random
import traceback
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal
from models.airport import Airport
from models.plane import Plane
from models.flight import Flight, FlightStatus
from models.ticket_type import TicketType
from models.addon_option import AddonOption
import json


def seed_data():
    """Seeds the database with initial data."""
    db: Session = SessionLocal()
    try:
        # Seed Addon Options
        try:
            if not db.query(AddonOption).first():
                addon_options = [
                    # Hành lý ký gửi thêm
                    AddonOption(
                        name="Hành lý ký gửi thêm 10kg",
                        category="baggage",
                        description="Thêm 10kg hành lý ký gửi vào chuyến bay",
                        price=200000.0,
                        metadata_json=json.dumps({"weight": 10, "unit": "kg"}),
                    ),
                    AddonOption(
                        name="Hành lý ký gửi thêm 20kg",
                        category="baggage",
                        description="Thêm 20kg hành lý ký gửi vào chuyến bay",
                        price=350000.0,
                        metadata_json=json.dumps({"weight": 20, "unit": "kg"}),
                    ),
                    AddonOption(
                        name="Hành lý ký gửi thêm 30kg",
                        category="baggage",
                        description="Thêm 30kg hành lý ký gửi vào chuyến bay",
                        price=500000.0,
                        metadata_json=json.dumps({"weight": 30, "unit": "kg"}),
                    ),
                    # Đồ ăn và thức uống
                    AddonOption(
                        name="Suất ăn chay",
                        category="meal",
                        description="Suất ăn chay đặc biệt cho chuyến bay",
                        price=150000.0,
                        metadata_json=json.dumps(
                            {"type": "vegetarian", "dietary_restriction": True}
                        ),
                    ),
                    AddonOption(
                        name="Suất ăn Halal",
                        category="meal",
                        description="Suất ăn Halal đặc biệt cho chuyến bay",
                        price=150000.0,
                        metadata_json=json.dumps(
                            {"type": "halal", "dietary_restriction": True}
                        ),
                    ),
                    AddonOption(
                        name="Suất ăn cao cấp",
                        category="meal",
                        description="Suất ăn cao cấp với các món đặc sản",
                        price=300000.0,
                        metadata_json=json.dumps(
                            {"type": "premium", "course_count": 3}
                        ),
                    ),
                    AddonOption(
                        name="Combo đồ uống",
                        category="meal",
                        description="Combo đồ uống bao gồm nước ngọt, trà và cà phê",
                        price=100000.0,
                        metadata_json=json.dumps(
                            {"includes": ["soft_drinks", "tea", "coffee"]}
                        ),
                    ),
                    # Chọn chỗ ngồi
                    AddonOption(
                        name="Chỗ ngồi gần cửa sổ",
                        category="seat",
                        description="Đặt trước chỗ ngồi gần cửa sổ",
                        price=100000.0,
                        metadata_json=json.dumps(
                            {"position": "window", "premium": False}
                        ),
                    ),
                    AddonOption(
                        name="Chỗ ngồi lối đi",
                        category="seat",
                        description="Đặt trước chỗ ngồi ở lối đi để dễ di chuyển",
                        price=80000.0,
                        metadata_json=json.dumps(
                            {"position": "aisle", "premium": False}
                        ),
                    ),
                    AddonOption(
                        name="Chỗ ngồi hàng đầu",
                        category="seat",
                        description="Chỗ ngồi hàng đầu với không gian chân rộng",
                        price=250000.0,
                        metadata_json=json.dumps(
                            {
                                "position": "front",
                                "premium": True,
                                "extra_legroom": True,
                            }
                        ),
                    ),
                    AddonOption(
                        name="Chỗ ngồi cửa thoát hiểm",
                        category="seat",
                        description="Chỗ ngồi gần cửa thoát hiểm với không gian rộng rãi",
                        price=200000.0,
                        metadata_json=json.dumps(
                            {
                                "position": "emergency_exit",
                                "premium": True,
                                "extra_legroom": True,
                            }
                        ),
                    ),
                    # Dịch vụ khác
                    AddonOption(
                        name="Bảo hiểm hủy chuyến",
                        category="service",
                        description="Bảo hiểm hoàn tiền khi hủy chuyến bay",
                        price=150000.0,
                        metadata_json=json.dumps(
                            {"coverage": "cancellation", "refund_percentage": 80}
                        ),
                    ),
                    AddonOption(
                        name="Ưu tiên check-in",
                        category="service",
                        description="Được ưu tiên check-in và lên máy bay trước",
                        price=120000.0,
                        metadata_json=json.dumps(
                            {"priority": "high", "boarding_group": 1}
                        ),
                    ),
                    AddonOption(
                        name="Dịch vụ đưa đón sân bay",
                        category="service",
                        description="Dịch vụ đưa đón từ khách sạn đến sân bay",
                        price=400000.0,
                        metadata_json=json.dumps(
                            {"pickup": True, "dropoff": True, "vehicle_type": "sedan"}
                        ),
                    ),
                    AddonOption(
                        name="Phòng chờ VIP",
                        category="service",
                        description="Quyền truy cập phòng chờ VIP tại sân bay",
                        price=350000.0,
                        metadata_json=json.dumps(
                            {
                                "access_duration": "3_hours",
                                "amenities": ["wifi", "food", "drinks"],
                            }
                        ),
                    ),
                ]

                db.add_all(addon_options)
                db.commit()
                print("Addon options seeded.")
            else:
                print("Addon options already exist.")
        except Exception as e:
            print(f"Error seeding addon options: {e}")
            traceback.print_exc()
            db.rollback()

        # Seed Ticket Types
        try:
            if not db.query(TicketType).first():
                ticket_types = [
                    TicketType(
                        name="Economy",
                        price_multiplier=1.0,
                        base_baggage_allowance_kg=20,
                    ),
                    TicketType(
                        name="Premium Economy",
                        price_multiplier=1.5,
                        base_baggage_allowance_kg=25,
                    ),
                    TicketType(
                        name="Business",
                        price_multiplier=2.5,
                        base_baggage_allowance_kg=35,
                    ),
                    TicketType(
                        name="VIP", price_multiplier=4.0, base_baggage_allowance_kg=50
                    ),
                ]
                db.add_all(ticket_types)
                db.commit()
                print("Ticket types seeded.")
            else:
                print("Ticket types already exist.")
        except Exception as e:
            print(f"Error seeding ticket types: {e}")
            traceback.print_exc()
            db.rollback()

        # Seed Airports
        try:
            if not db.query(Airport).first():
                airports = [
                    Airport(
                        id="SGN",
                        name="Tan Son Nhat International Airport",
                        city="Ho Chi Minh City",
                    ),
                    Airport(
                        id="HAN",
                        name="Noi Bai International Airport",
                        city="Hanoi",
                    ),
                    Airport(
                        id="DAD",
                        name="Da Nang International Airport",
                        city="Da Nang",
                    ),
                    Airport(
                        id="CXR",
                        name="Cam Ranh International Airport",
                        city="Nha Trang",
                    ),
                    Airport(
                        id="PQC",
                        name="Phu Quoc International Airport",
                        city="Phu Quoc",
                    ),
                ]
                db.add_all(airports)
                db.commit()
                print("Airports seeded.")
            else:
                print("Airports already exist.")
        except Exception as e:
            print(f"Error seeding airports: {e}")
            traceback.print_exc()
            db.rollback()

        # Seed Planes
        try:
            if not db.query(Plane).first():
                planes = [
                    Plane(code="VN-A321", total_seats=200),
                    Plane(code="VN-A350", total_seats=300),
                    Plane(code="VN-B787", total_seats=250),
                ]
                db.add_all(planes)
                db.commit()
                print("Planes seeded.")
            else:
                print("Planes already exist.")
        except Exception as e:
            print(f"Error seeding planes: {e}")
            traceback.print_exc()
            db.rollback()

        # Seed Flights
        try:
            if not db.query(Flight).first():
                all_airports = db.query(Airport).all()
                all_planes = db.query(Plane).all()

                if not all_airports or not all_planes:
                    print("Cannot seed flights without airports and planes.")
                    return

                flights = []
                flight_numbers = set()
                for _ in range(50):  # Create 50 random flights
                    departure_airport = random.choice(all_airports)
                    arrival_airport = random.choice(all_airports)
                    while arrival_airport == departure_airport:
                        arrival_airport = random.choice(all_airports)

                    plane = random.choice(all_planes)

                    departure_time = datetime.now() + timedelta(
                        days=random.randint(0, 30), hours=random.randint(1, 23)
                    )
                    arrival_time = departure_time + timedelta(
                        hours=random.randint(1, 5)
                    )

                    flight_number = f"VN{random.randint(100, 999)}"
                    while flight_number in flight_numbers:
                        flight_number = f"VN{random.randint(100, 999)}"
                    flight_numbers.add(flight_number)

                    flight = Flight(
                        flight_number=flight_number,
                        departure_time=departure_time,
                        arrival_time=arrival_time,
                        base_price=random.uniform(50.0, 500.0),
                        status=random.choice(list(FlightStatus)),
                        plane_id=plane.id,
                        departure_airport_id=departure_airport.id,
                        arrival_airport_id=arrival_airport.id,
                    )
                    flights.append(flight)

                db.add_all(flights)
                db.commit()
                print("Flights seeded.")
            else:
                print("Flights already exist.")
        except Exception as e:
            print(f"Error seeding flights: {e}")
            traceback.print_exc()
            db.rollback()

    finally:
        db.close()


if __name__ == "__main__":
    print("Seeding database...")
    seed_data()
    print("Seeding complete.")
