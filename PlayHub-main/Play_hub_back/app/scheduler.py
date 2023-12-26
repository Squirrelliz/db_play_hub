from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler

from app import SessionLocal
from app.models.player import Player as PlayerModel


def check_users():
    print("check game out user")
    with SessionLocal() as db:
        users = db.query(PlayerModel).filter(PlayerModel.game_id != None).all()
        current_time = datetime.now()
        for user in users:
            if user.game.end_time and user.game.end_time < current_time:
                print("find user")
                user.game_id = None
                user.experience += 10

        db.commit()


scheduler = BackgroundScheduler()
scheduler.add_job(check_users, 'interval', minutes=1)
print("------scheduler start------")
