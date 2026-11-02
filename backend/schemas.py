from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NoteCreate(BaseModel):
  title: str
  content: str
  category: Optional[str] = "Geral"


class NoteResponse(BaseModel):
  id: int
  title: str
  content: str
  category: str
  created_at: datetime

  class Config:
    from_attributes = True