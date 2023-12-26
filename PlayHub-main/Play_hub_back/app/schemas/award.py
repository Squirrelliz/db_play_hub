from pydantic import BaseModel


class AwardBase(BaseModel):
    name: str
    description: str
    experience_points: int


class AwardCreate(AwardBase):
    pass


class Award(AwardBase):
    id: int

    class Config:
        orm_mode = True
