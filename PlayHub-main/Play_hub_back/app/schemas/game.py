from datetime import datetime
from typing import List

from pydantic import BaseModel

from app.schemas.team import TeamCreate


class GameBase(BaseModel):
    name: str
    difficulty: str
    start_time: datetime
    end_time: datetime
    stadium_id: int
    count_participant: int


class GameCreate(BaseModel):
    name: str
    difficulty: str
    start_time: datetime
    end_time: datetime
    stadium_id: int


class Game(GameBase):
    id: int
    teams: List[str] = []

    class Config:
        orm_mode = True