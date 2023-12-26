import os

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from .database import Base, engine, SessionLocal
from .scheduler import scheduler

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

routes_directory = os.path.join(os.path.dirname(__file__), "routes")

route_files = [f for f in os.listdir(routes_directory) if f.endswith(".py") and f != "__init__.py"]

for route_file in route_files:
    module_name = f"app.routes.{route_file.replace('.py', '')}"
    module = __import__(module_name, fromlist=["router"])
    app.include_router(module.router, tags=[route_file.replace('.py', '')])

scheduler.start()
