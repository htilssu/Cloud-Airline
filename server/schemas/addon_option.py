from pydantic import BaseModel
from typing import Optional, Dict, Any
import json


class AddonOptionBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    price: float
    is_active: bool = True


class AddonOption(AddonOptionBase):
    id: int
    metadata_json: Optional[str] = None

    class Config:
        from_attributes = True

    @property
    def metadata(self) -> Optional[Dict[str, Any]]:
        """Parse metadata JSON string to dict"""
        if self.metadata_json:
            try:
                return json.loads(self.metadata_json)
            except json.JSONDecodeError:
                return None
        return None


class AddonOptionResponse(AddonOption):
    """Response schema with parsed metadata"""

    metadata: Optional[Dict[str, Any]] = None

    def __init__(self, **data):
        super().__init__(**data)
        # Parse metadata from JSON string
        if self.metadata_json:
            try:
                self.metadata = json.loads(self.metadata_json)
            except json.JSONDecodeError:
                self.metadata = None


class AddonCategory(BaseModel):
    """Schema for grouping addons by category"""

    category: str
    category_name: str
    options: list[AddonOptionResponse]
