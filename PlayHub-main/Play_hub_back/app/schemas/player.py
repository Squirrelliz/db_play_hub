from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from app.schemas.award import Award
from app.schemas.game import Game
from app.schemas.team import Team


class PlayerBase(BaseModel):
    name: str
    email: str
    password: str
    experience: int
    role: Optional[str] = "user"
    team_id: Optional[int]
    game_id: Optional[int]


class PlayerCreate(BaseModel):
    name: str
    email: str
    password: str


class PlayerUpdate(BaseModel):
    name: str
    email: str


class AwardWithDate(BaseModel):
    award: Award
    date_created: datetime


class PlayerID(PlayerBase):
    id: int
    awards: List[AwardWithDate] = []
    team: Optional[Team]
    game: Optional[Game]


class PlayerRoleSetting(BaseModel):
    password: str


class PlayerLogin(BaseModel):
    name: str
    password: str


class Player(PlayerBase):
    id: int

    class Config:
        orm_mode = True


class PlayerList(BaseModel):
    data: List[Player]
    total: int
