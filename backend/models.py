from database import Base
from sqlalchemy import Column, DateTime, Integer, String, func


class Note(Base):
  __tablename__ = "notes"

  id = Column(Integer, primary_key=True, index=True, autoincrement=True)
  title = Column(String, index=True)
  content = Column(String)
  category = Column(String, default="Geral")  # Ex: BattleChips, Notas, Lembretes
  created_at = Column(DateTime(timezone=True), server_default=func.now())