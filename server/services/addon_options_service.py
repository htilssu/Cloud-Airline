from sqlalchemy.orm import Session
from models.addon_option import AddonOption
from typing import List
from fastapi import Depends
from database import get_db
import json
from schemas.addon_option import AddonOptionsGroupedByCategory


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
            .order_by(AddonOption.category, AddonOption.name, AddonOption.price)
            .all()
        )

    def get_all_addon_options_grouped_by_category(self) -> List[AddonOption]:
        """Lấy tất cả addon options được nhóm theo category"""
        return (
            self.db.query(AddonOption)
            .filter(AddonOption.is_active == True)
            .order_by(AddonOption.category, AddonOption.name, AddonOption.price)
            .all()
        )

    def get_addon_options_grouped_by_category(
        self,
    ) -> List[AddonOptionsGroupedByCategory]:
        """Lấy addon options được nhóm theo category"""
        all_options = self.get_all_addon_options_grouped_by_category()

        # Định nghĩa tên hiển thị cho các category
        category_names = {
            "baggage": "Hành lý ký gửi",
            "meal": "Đồ ăn & Thức uống",
            "seat": "Chọn chỗ ngồi",
            "service": "Dịch vụ khác",
        }

        grouped: List[AddonOptionsGroupedByCategory] = []
        for k, v in category_names.items():
            options = [x for x in all_options if x.category == k]
            for option in options:
                option.metadata = json.loads(option.metadata_json)
            grouped.append(
                AddonOptionsGroupedByCategory(
                    category=k, category_name=v, options=options
                )
            )

        return grouped

    def get_addon_option_by_id(self, addon_id: int) -> AddonOption:
        """Lấy addon option theo ID"""
        return self.db.query(AddonOption).filter(AddonOption.id == addon_id).first()


def get_addon_options_service(db: Session = Depends(get_db)):
    return AddonOptionsService(db)
