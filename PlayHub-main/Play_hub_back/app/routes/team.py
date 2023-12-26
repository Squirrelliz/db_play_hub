from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import SessionLocal
from ..models.player import Player as PlayerModel
from ..schemas.player import Player
from ..models.team import Team as TeamModel
from ..schemas.team import Team, TeamCreate, TeamUpdate

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/team", response_model=Team)
def create_team(team: TeamCreate, db: Session = Depends(get_db)):
    db_team = TeamModel(**team.dict())
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team


@router.put("/team/{team_id}", response_model=Team)
def update_team(team_id: int, team_update: TeamUpdate, db: Session = Depends(get_db)):
    db_team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if db_team is None:
        raise HTTPException(status_code=404, detail="Team not found")

    for field, value in team_update.dict(exclude_unset=True).items():
        setattr(db_team, field, value)

    db.commit()
    db.refresh(db_team)
    return db_team


@router.get("/team", response_model=List[Team])
def get_all_teams(db: Session = Depends(get_db)):
    teams = db.query(TeamModel).all()
    return teams


@router.delete("/team/{team_id}", response_model=Team)
def delete_team(team_id: int, db: Session = Depends(get_db)):
    db_team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if db_team is None:
        raise HTTPException(status_code=404, detail="Team not found")

    db.query(PlayerModel).filter(PlayerModel.team_id == team_id).update({PlayerModel.team_id: None})

    db.delete(db_team)
    db.commit()
    return db_team

@router.get("/team/{team_id}", response_model=List[Player])
def update_team(team_id: int, db: Session = Depends(get_db)):
    db_player = db.query(PlayerModel).filter(PlayerModel.team_id == team_id).all()
    return db_player
