from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base


class Game(Base):
    __tablename__ = "game"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    difficulty = Column(String(100), nullable=False)
    start_time = Column(DateTime, nullable=False, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=False)
    stadium_id = Column(Integer, ForeignKey('stadium.id'), nullable=False)
    count_participant = Column(Integer, default=0)

    stadiums = relationship("Stadium", back_populates="game")
    players = relationship("Player", back_populates="game")
    team_game = relationship("TeamGame", back_populates="game")
    team = relationship("Team", secondary="team_game")
