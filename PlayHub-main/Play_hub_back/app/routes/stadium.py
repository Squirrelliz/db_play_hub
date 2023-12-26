from typing import List, Tuple

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.stadium import Stadium as StadiumModel
from app.models.game import Game as GameModel
from app.schemas.stadium import (
    StadiumCreate,
    StadiumUpdate,
    Stadium
)

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/stadium", response_model=Tuple[List[Stadium], int])
def get_all_stadiums(limit: int, offset: int, db: Session = Depends(get_db)):
    stadiums = db.query(StadiumModel).all()
    total = len(stadiums)
    return stadiums[offset:][:limit], total


@router.get("/stadium/{stadium_id}", response_model=Stadium)
def get_stadium(stadium_id: int, db: Session = Depends(get_db)):
    stadium = db.query(StadiumModel).filter(StadiumModel.id == stadium_id).first()
    if stadium is None:
        raise HTTPException(status_code=404, detail="Stadium not found")
    return stadium


@router.post("/stadium", response_model=Stadium)
def create_stadium(stadium: StadiumCreate, db: Session = Depends(get_db)):
    db_stadium = StadiumModel(**stadium.dict())
    db_stadium.approved = False
    db.add(db_stadium)
    db.commit()
    db.refresh(db_stadium)
    return db_stadium


@router.put("/stadium/{stadium_id}", response_model=Stadium)
def update_stadium(stadium_id: int, stadium_update: StadiumUpdate, db: Session = Depends(get_db)):
    db_stadium = db.query(StadiumModel).filter(StadiumModel.id == stadium_id).first()
    if db_stadium is None:
        raise HTTPException(status_code=404, detail="Stadium not found")

    for field, value in stadium_update.dict(exclude_unset=True).items():
        setattr(db_stadium, field, value)

    db.commit()
    db.refresh(db_stadium)
    return db_stadium


@router.put("/stadium/{stadium_id}/approved", response_model=Stadium)
def update_stadium_approval(stadium_id: int, db: Session = Depends(get_db)):
    db_stadium = db.query(StadiumModel).filter(StadiumModel.id == stadium_id).first()
    if db_stadium is None:
        raise HTTPException(status_code=404, detail="Stadium not found")

    db_stadium.approved = True

    db.commit()
    db.refresh(db_stadium)
    return db_stadium


@router.get("/stadium_from_sport/{sport_id}", response_model=List[Stadium])
def get_stadiums_by_sport_id(sport_id: int, db: Session = Depends(get_db)):
    stadiums = db.query(StadiumModel).filter(StadiumModel.sport_type_id == sport_id).all()
    return stadiums if stadiums else []


@router.delete("/stadium/{stadium_id}", response_model=Stadium)
def delete_stadium(stadium_id: int, db: Session = Depends(get_db)):
    stadium = db.query(StadiumModel).filter(StadiumModel.id == stadium_id).first()
    if stadium is None:
        raise HTTPException(status_code=404, detail="Stadium not found")

    db.query(GameModel).filter(GameModel.stadium_id == stadium_id).delete()

    db.delete(stadium)
    db.commit()
    return stadium
