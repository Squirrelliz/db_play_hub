from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class Stadium(Base):
    __tablename__ = "stadium"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    address = Column(String(100), nullable=False)
    coordinates = Column(String(100), nullable=False)
    approved = Column(Boolean, default=False)
    sport_type_id = Column(Integer, ForeignKey('sport_type.id'), nullable=False)

    sport_type = relationship("SportType", back_populates="stadiums")
    game = relationship("Game", back_populates="stadiums")
