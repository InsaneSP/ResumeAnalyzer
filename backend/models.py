from sqlalchemy import Column, Float, Integer, String, Text, DateTime, JSON
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from .database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    linkedin = Column(String)
    github = Column(String)
    summary = Column(Text)
    work_experience = Column(JSONB)
    education = Column(JSONB)
    certifications = Column(JSONB)
    projects = Column(JSONB)
    core_skills = Column(JSONB)
    soft_skills = Column(JSONB)
    languages = Column(JSONB)
    achievements = Column(JSONB)
    awards = Column(JSONB)
    interests = Column(JSONB)
    resume_improvement_suggestions = Column(JSONB)
    file_name = Column(String)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())

class ResumeRecord(Base):
    __tablename__ = "resume_records"
    id = Column(Integer, primary_key=True, index=True)
    resume_name = Column(String)
    candidate_name = Column(String)
    candidate_email = Column(String)
    candidate_phone = Column(String)
    ai_score = Column(Float)
    top_skills = Column(JSONB)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    full_analysis = Column(JSON, nullable=True)