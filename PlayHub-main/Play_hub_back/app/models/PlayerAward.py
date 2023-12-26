from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from ..database import Base


class PlayerAward(Base):
    __tablename__ = "player_award"

    player_id = Column(Integer, ForeignKey('player.id'), primary_key=True)
    award_id = Column(Integer, ForeignKey('award.id'), primary_key=True)
    date_created = Column(TIMESTAMP, server_default=func.now())

    player = relationship("Player", back_populates="player_award")
    award = relationship("Award", back_populates="player_award")
