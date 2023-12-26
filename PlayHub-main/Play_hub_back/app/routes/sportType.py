from typing import List, Tuple

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.sportType import SportType as SportTypeModel
from app.routes.player import get_db
from app.schemas.sportType import SportType, SportTypeCreate
from app.models.stadium import Stadium as StadiumModel
from app.models.game import Game as GameModel

router = APIRouter()


@router.get("/sports/", response_model=List[SportType])
def get_all_sports(db: Session = Depends(get_db)):
    sports = db.query(SportTypeModel).all()
    return sports


@router.get("/sportsWithLimit/", response_model=Tuple[List[SportType], int])
def get_all_sports(limit: int, offset: int, db: Session = Depends(get_db)):
    sports = db.query(SportTypeModel).all()
    total = len(sports)
    return sports[offset:][:limit], total


@router.post("/sports/", response_model=SportType)
def create_sport(sport: SportTypeCreate, db: Session = Depends(get_db)):
    try:
        db_sport = SportTypeModel(**sport.dict())
        db.add(db_sport)
        db.commit()
        db.refresh(db_sport)
        return db_sport
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Sport with this name already exists")


@router.delete("/sports/{sport_id}", response_model=SportType)
def delete_sport(sport_id: int, db: Session = Depends(get_db)):
    sport = db.query(SportTypeModel).filter(SportTypeModel.id == sport_id).first()
    if sport is None:
        raise HTTPException(status_code=404, detail="Sport not found")

    stadiums = db.query(StadiumModel).filter(StadiumModel.sport_type_id == sport_id).all()
    for stadium in stadiums:
        db.query(GameModel).filter(GameModel.stadium_id == stadium.id).delete()
        db.delete(stadium)

    db.delete(sport)
    db.commit()
    return sport
