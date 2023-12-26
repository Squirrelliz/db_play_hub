from pydantic import BaseModel


class TeamBase(BaseModel):
    name: str
    count_participant: int


class TeamCreate(BaseModel):
    name: str


class TeamUpdate(BaseModel):
    name: str


class Team(TeamBase):
    id: int

    class Config:
        orm_mode = True
