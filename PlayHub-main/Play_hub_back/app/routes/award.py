from typing import List, Tuple
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.PlayerAward import PlayerAward
from app.models.award import Award as AwardModel
from app.routes.player import get_db
from app.schemas.award import Award, AwardCreate

router = APIRouter()


@router.get("/awards/", response_model=Tuple[List[Award], int])
def get_all_awards(limit: int, offset: int, db: Session = Depends(get_db)):
    awards = db.query(AwardModel).all()
    total = len(awards)
    return awards[offset:][:limit], total


@router.post("/awards/", response_model=Award)
def create_award(award: AwardCreate, db: Session = Depends(get_db)):
    db_award = AwardModel(**award.dict())
    db.add(db_award)
    db.commit()
    db.refresh(db_award)
    return db_award


@router.delete("/awards/{award_id}", response_model=Award)
def delete_award(award_id: int, db: Session = Depends(get_db)):
    award = db.query(AwardModel).filter(AwardModel.id == award_id).first()
    if award is None:
        raise HTTPException(status_code=404, detail="Award not found")

    db.query(PlayerAward).filter(PlayerAward.award_id == award_id).delete(synchronize_session=False)

    db.delete(award)
    db.commit()
    return award
