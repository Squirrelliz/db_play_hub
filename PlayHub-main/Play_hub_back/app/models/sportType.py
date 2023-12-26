from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from ..database import Base


class SportType(Base):
    __tablename__ = "sport_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(500), nullable=False)

    stadiums = relationship("Stadium", back_populates="sport_type")
