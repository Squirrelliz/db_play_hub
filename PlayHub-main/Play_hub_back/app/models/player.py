import bcrypt
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base


class Player(Base):
    __tablename__ = "player"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    experience = Column(Integer, nullable=False)
    team_id = Column(Integer, ForeignKey('team.id'), nullable=True)
    game_id = Column(Integer, ForeignKey('game.id'), nullable=True)
    role = Column(String)

    player_award = relationship("PlayerAward", back_populates="player")
    awards = relationship("Award", secondary="player_award")
    team = relationship("Team", back_populates="players")
    game = relationship("Game", back_populates="players")

    def set_password(self, password):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        self.password = hashed_password
