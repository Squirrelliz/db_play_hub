import bcrypt
from fastapi import APIRouter, Depends
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.player import Player as PlayerModel
from app.schemas.player import PlayerCreate, Player, PlayerRoleSetting, PlayerLogin

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register/", response_model=Player)
def create_player(player: PlayerCreate, db: Session = Depends(get_db)):
    try:
        db_player = PlayerModel(name=player.name, email=player.email)
        db_player.set_password(player.password)
        db_player.role = "user"
        db_player.experience = 0
        db_player.team_id = None
        db.add(db_player)
        db.commit()
        db.refresh(db_player)
        return db_player
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="User with this name or email already exists")


@router.post("/login/", response_model=Player)
def login_player(playerLogin: PlayerLogin, db: Session = Depends(get_db)):
    player = db.query(PlayerModel).filter(PlayerModel.name == playerLogin.name).first()
    if player is None:
        raise HTTPException(status_code=404, detail="User not found")

    if not bcrypt.checkpw(playerLogin.password.encode('utf-8'), player.password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid password")

    return player


@router.put("/set_role/{player_id}", response_model=Player)
def update_player(player_id: int, player_update: PlayerRoleSetting, db: Session = Depends(get_db)):
    player = db.query(PlayerModel).filter(PlayerModel.id == player_id).first()
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")

    if player_update.password != "qwerty1234":
        raise HTTPException(status_code=400, detail="Incorrect password")

    setattr(player, 'role', 'moderator')
    db.commit()
    db.refresh(player)
    return player
