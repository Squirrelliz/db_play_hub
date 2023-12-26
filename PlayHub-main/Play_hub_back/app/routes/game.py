from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.TeamGame import TeamGame
from app.models.game import Game as GameModel
from app.schemas.game import GameCreate, Game

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/game", response_model=Game)
def create_game(game: GameCreate, db: Session = Depends(get_db)):
    start_time = game.start_time
    end_time = game.end_time
    stadium_id = game.stadium_id

    conflicting_game = db.query(GameModel).filter(
        and_(
            GameModel.stadium_id == stadium_id,
            or_(
                and_(GameModel.start_time < start_time, GameModel.end_time > start_time),
                and_(GameModel.start_time < end_time, GameModel.end_time > end_time),
            ),
        )
    ).first()

    if conflicting_game:
        raise HTTPException(status_code=400, detail="Game already exists for this stadium in the given time range")

    db_game = GameModel(**game.dict())
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game


@router.get("/game/{stadium_id}", response_model=List[Game])
def get_games_by_stadium(stadium_id: int, db: Session = Depends(get_db)):
    games = db.query(GameModel).filter(GameModel.stadium_id == stadium_id).all()

    for game in games:
        team_game_entries = db.query(TeamGame).filter(TeamGame.game_id == game.id).all()
        teams = [entry.team.name for entry in team_game_entries]
        game.teams = teams

    return games


@router.delete("/game/{game_id}", response_model=Game)
def delete_game(game_id: int, db: Session = Depends(get_db)):
    game = db.query(GameModel).filter(GameModel.id == game_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")

    db.delete(game)
    db.commit()
    return game
