from sqlalchemy import Column, Integer, String, Float, Boolean, Text
from models.base import Base


class AddonOption(Base):
    """Model for addon options like extra baggage, meals, etc."""

    __tablename__ = "addon_options"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(
        String, nullable=False
    )  # "Extra Baggage 10kg", "Vegetarian Meal", etc.
    category = Column(String, nullable=False)  # "baggage", "meal", "seat", "service"
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)  # Giá cố định cho addon
    is_active = Column(Boolean, nullable=False, default=True)

    # Metadata cho từng loại addon
    metadata_json = Column(Text, nullable=True)  # JSON string cho thông tin bổ sung
