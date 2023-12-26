from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from ..database import Base


class Team(Base):
    __tablename__ = "team"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    count_participant = Column(Integer, default=0)

    players = relationship("Player", back_populates="team")
    team_game = relationship("TeamGame", back_populates="team")
    game = relationship("Game", secondary="team_game")
