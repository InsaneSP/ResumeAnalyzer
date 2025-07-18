from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.sql import func
from .database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    file_name = Column(String)
    core_skills = Column(JSON)
    soft_skills = Column(JSON)
    resume_rating = Column(Integer)
    improvement_areas = Column(Text)
    upskill_suggestions = Column(Text)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
