from typing import List, Tuple

from fastapi import APIRouter, Depends
from fastapi import HTTPException
from fastapi.openapi.models import Response
from sqlalchemy.orm import Session
# from openpyxl import Workbook
# from io import BytesIO

from app.database import SessionLocal
from app.models.PlayerAward import PlayerAward
from app.models.award import Award as AwardModel
from app.models.player import Player as PlayerModel
from ..models.TeamGame import TeamGame
from ..models.game import Game as GameModel
from ..models.team import Team as TeamModel
from app.schemas.award import Award
from app.schemas.player import Player, PlayerUpdate, AwardWithDate, PlayerID, PlayerList
from ..schemas.game import Game
from ..schemas.team import Team

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/players/{player_id}", response_model=PlayerID)
def get_player(player_id: int, db: Session = Depends(get_db)):
    player = db.query(PlayerModel).filter(PlayerModel.id == player_id).first()
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")

    player_awards = db.query(AwardModel, PlayerAward.date_created).join(PlayerAward).filter(
        PlayerAward.player_id == player_id).all()

    awards_with_dates = [AwardWithDate(
        award=Award(id=award_dict.id, name=award_dict.name, description=award_dict.description,
                    experience_points=award_dict.experience_points), date_created=date_created)
        for award_dict, date_created in player_awards]

    team = None
    if player.team_id is not None:
        team_data = db.query(TeamModel).filter(TeamModel.id == player.team_id).first()
        if team_data:
            team = Team(
                id=team_data.id,
                name=team_data.name,
                count_participant=team_data.count_participant
            )

    team_info = Team(**team.__dict__) if team else None

    game = None
    if player.game_id is not None:
        game_data = db.query(GameModel).filter(GameModel.id == player.game_id).first()
        if game_data:
            game = Game(
                id=game_data.id,
                name=game_data.name,
                difficulty=game_data.difficulty,
                start_time=game_data.start_time,
                end_time=game_data.end_time,
                stadium_id=game_data.stadium_id,
                count_participant=game_data.count_participant
            )

    game_info = Game(**game.__dict__) if game else None

    player_data = player.__dict__
    player_data['awards'] = awards_with_dates
    player_data['team'] = team_info
    player_data['game'] = game_info

    return PlayerID(**player_data)


@router.get("/players/", response_model=PlayerList)
def get_all_players(limit: int, offset: int, db: Session = Depends(get_db)):
    players = db.query(PlayerModel).all()
    total = len(players)
    player_data = [Player(**player.__dict__) for player in players][offset:][:limit]
    return PlayerList(data=player_data, total=total)


@router.delete("/players/{player_id}", response_model=Player)
def delete_player(player_id: int, db: Session = Depends(get_db)):
    player = db.query(PlayerModel).filter(PlayerModel.id == player_id).first()
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")

    db.query(PlayerAward).filter(PlayerAward.player_id == player_id).delete(synchronize_session=False)

    db.delete(player)
    db.commit()
    return player


@router.put("/players/{player_id}", response_model=Player)
def update_player(player_id: int, player_update: PlayerUpdate, db: Session = Depends(get_db)):
    player = db.query(PlayerModel).filter(PlayerModel.id == player_id).first()
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")

    allowed_fields = ['name', 'email']
    for field, value in player_update.dict(exclude_unset=True).items():
        if field in allowed_fields:
            setattr(player, field, value)

    db.commit()
    db.refresh(player)
    return player


@router.post("/players/{player_id}/set_team/{team_id}", response_model=Player)
def set_player_team(player_id: int, team_id: int, db: Session = Depends(get_db)):
    player = db.query(PlayerModel).filter(PlayerModel.id == player_id).first()

    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if not team and team_id != 0:
        raise HTTPException(status_code=404, detail="Team not found")

    if player:
        if player.team_id is None and team_id is None:
            return player

        old_team_id = player.team_id

        player.team_id = team_id if team_id != 0 else None
        db.commit()

        if old_team_id is not None:
            old_team_count = db.query(PlayerModel).filter(PlayerModel.team_id == old_team_id).count()
            db.query(TeamModel).filter(TeamModel.id == old_team_id).update({"count_participant": old_team_count})
            db.commit()

        if team_id is not None:
            new_team_count = db.query(PlayerModel).filter(PlayerModel.team_id == team_id).count()
            db.query(TeamModel).filter(TeamModel.id == team_id).update({"count_participant": new_team_count})
            db.commit()

    return player


@router.post("/players/{player_id}/set_game/{game_id}", response_model=Player)
def set_player_game(player_id: int, game_id: int, db: Session = Depends(get_db)):
    player = db.query(PlayerModel).filter(PlayerModel.id == player_id).first()

    game = db.query(GameModel).filter(GameModel.id == game_id).first()
    if not game and game_id != 0:
        raise HTTPException(status_code=404, detail="Team not found")

    if player:
        if player.game_id is None and game_id is None:
            return player

        old_game_id = player.game_id

        player.game_id = game_id if game_id != 0 else None

        if player.team_id and game_id:  # Если у игрока есть команда и он присоединяется к игре
            # Проверяем, существует ли уже запись в таблице TeamGame
            existing_entry = db.query(TeamGame).filter_by(team_id=player.team_id, game_id=game_id).first()

            if not existing_entry:  # Если записи нет, добавляем её
                team_game_entry = TeamGame(team_id=player.team_id, game_id=game_id)
                db.add(team_game_entry)

        db.commit()

        if old_game_id is not None:
            old_game_count = db.query(PlayerModel).filter(PlayerModel.game_id == old_game_id).count()
            db.query(GameModel).filter(GameModel.id == old_game_id).update({"count_participant": old_game_count})
            db.commit()

        if game_id is not None:
            new_game_count = db.query(PlayerModel).filter(PlayerModel.game_id == game_id).count()
            db.query(GameModel).filter(GameModel.id == game_id).update({"count_participant": new_game_count})
            db.commit()

    return player
