from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base


class Award(Base):
    __tablename__ = "award"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500), nullable=False)
    experience_points = Column(Integer, nullable=False)

    player_award = relationship("PlayerAward", back_populates="award")
    players = relationship("Player", secondary="player_award")
