from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from ..database import Base


class TeamGame(Base):
    __tablename__ = "team_game"

    team_id = Column(Integer, ForeignKey('team.id'), primary_key=True)
    game_id = Column(Integer, ForeignKey('game.id'), primary_key=True)

    team = relationship("Team", back_populates="team_game")
    game = relationship("Game", back_populates="team_game")
