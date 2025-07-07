from sqlalchemy.orm import Session
from models.addon_option import AddonOption
from typing import List, Dict, Any
from fastapi import Depends
from database import get_db
import json


class AddonOptionsService:
    """Service class for handling addon options operations"""

    def __init__(self, db: Session):
        self.db = db

    def get_all_addon_options(self) -> List[AddonOption]:
        """Lấy tất cả addon options đang active"""
        return self.db.query(AddonOption).filter(AddonOption.is_active == True).all()

    def get_addon_options_by_category(self, category: str) -> List[AddonOption]:
        """Lấy addon options theo category"""
        return (
            self.db.query(AddonOption)
            .filter(AddonOption.category == category, AddonOption.is_active == True)
            .all()
        )

    def get_addon_options_grouped_by_category(self) -> Dict[str, Dict[str, Any]]:
        """Lấy addon options được nhóm theo category"""
        all_options = self.get_all_addon_options()

        # Định nghĩa tên hiển thị cho các category
        category_names = {
            "baggage": "Hành lý ký gửi",
            "meal": "Đồ ăn & Thức uống",
            "seat": "Chọn chỗ ngồi",
            "service": "Dịch vụ khác",
        }

        grouped = {}
        for option in all_options:
            category = option.category
            if category not in grouped:
                grouped[category] = {
                    "category": category,
                    "category_name": category_names.get(category, category.title()),
                    "options": [],
                }

            # Parse metadata JSON
            metadata = None
            if option.metadata_json:
                try:
                    metadata = json.loads(option.metadata_json)
                except json.JSONDecodeError:
                    metadata = None

            grouped[category]["options"].append(
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

        return grouped

    def get_addon_option_by_id(self, addon_id: int) -> AddonOption:
        """Lấy addon option theo ID"""
        return self.db.query(AddonOption).filter(AddonOption.id == addon_id).first()


def get_addon_options_service(db: Session = Depends(get_db)):
    return AddonOptionsService(db)
