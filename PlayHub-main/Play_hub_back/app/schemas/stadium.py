from typing import Optional

from pydantic import BaseModel


class StadiumBase(BaseModel):
    name: str
    address: str
    coordinates: str
    sport_type_id: int
    approved: bool


class StadiumCreate(BaseModel):
    name: str
    address: str
    coordinates: str
    sport_type_id: int


class StadiumUpdate(BaseModel):
    name: Optional[str]
    address: Optional[str]
    coordinates: Optional[str]


class Stadium(StadiumBase):
    id: int

    class Config:
        orm_mode = True
