from pydantic import BaseModel


class SportTypeBase(BaseModel):
    name: str
    description: str


class SportTypeCreate(SportTypeBase):
    pass


class SportType(SportTypeBase):
    id: int

    class Config:
        orm_mode = True
