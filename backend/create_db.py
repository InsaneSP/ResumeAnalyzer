# drop_and_create_db.py
from backend.database import engine, Base
from backend import models

print("Dropping all tables ...")
Base.metadata.drop_all(bind=engine)
print("Creating all tables ...")
Base.metadata.create_all(bind=engine)
print("✅ Database tables dropped and recreated.")
