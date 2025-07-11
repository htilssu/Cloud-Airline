import asyncio
import logging
from datetime import datetime
from services.booking_service import BookingService
from database import get_db

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def cleanup_expired_bookings_task():
    """Background task to cleanup expired bookings every 5 minutes"""
    while True:
        try:
            # Get database session
            SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
            db: Session = SessionLocal()
            booking_service = BookingService(db)

            # Cleanup expired bookings
            count = booking_service.expire_old_bookings()

            if count > 0:
                logger.info(f"Expired {count} bookings at {datetime.now()}")

            db.close()

        except Exception as e:
            logger.error(f"Error in cleanup task: {e}")

        # Wait 5 minutes before next cleanup
        await asyncio.sleep(300)  # 300 seconds = 5 minutes


def start_background_tasks():
    """Start all background tasks"""
    asyncio.create_task(cleanup_expired_bookings_task())
