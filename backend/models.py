from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class Feedback(BaseModel):
    id: Optional[str] = None
    category: str
    comment: str
    rating: int
    author: Optional[str] = None
    email: Optional[EmailStr] = None
    createdAt: Optional[datetime] = None
