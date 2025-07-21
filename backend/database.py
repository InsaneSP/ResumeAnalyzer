from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()  # Automatically looks for a .env file in the root directory

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"DATABASE_URL: {DATABASE_URL}")

# Ensure DATABASE_URL is loaded correctly
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL not found in environment variables.")

# Create the database engine
engine = create_engine(DATABASE_URL)

# Set up the session local class
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Base class for models
Base = declarative_base()

# Function to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
