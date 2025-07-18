from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from uuid import uuid4

from . import database, models, resume_parser
from .llm_utils import generate_improvement_suggestions, generate_upskill_suggestions

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

get_db = database.get_db


@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Save uploaded file temporarily
    temp_filename = f"temp_{uuid4()}.pdf"
    temp_path = os.path.join("backend", "temp_uploads", temp_filename)
    os.makedirs(os.path.dirname(temp_path), exist_ok=True)

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Parse resume content
    text = resume_parser.extract_text_from_pdf(temp_path)
    name = resume_parser.extract_name(text)
    email = resume_parser.extract_email(text)
    phone = resume_parser.extract_phone(text)
    core_skills = resume_parser.extract_skills(text)
    soft_skills = resume_parser.extract_soft_skills(text)

    # LLM suggestions
    improvement_areas = generate_improvement_suggestions(text)
    upskill_suggestions = generate_upskill_suggestions(core_skills)

    # Save to DB
    resume_entry = models.Resume(
        name=name,
        email=email,
        phone=phone,
        file_name=file.filename,
        core_skills=core_skills,
        soft_skills=soft_skills,
        resume_rating=len(core_skills) + 7,  # Dummy rating logic for now
        improvement_areas=improvement_areas,
        upskill_suggestions=upskill_suggestions
    )
    db.add(resume_entry)
    db.commit()
    db.refresh(resume_entry)

    # Delete temp file
    os.remove(temp_path)

    return {
        "id": resume_entry.id,
        "name": name,
        "email": email,
        "phone": phone,
        "file_name": file.filename,
        "core_skills": core_skills,
        "soft_skills": soft_skills,
        "resume_rating": resume_entry.resume_rating,
        "improvement_areas": improvement_areas,
        "upskill_suggestions": upskill_suggestions
    }


@app.get("/resumes/")
def get_all_resumes(db: Session = Depends(get_db)):
    resumes = db.query(models.Resume).order_by(models.Resume.upload_date.desc()).all()
    return [
        {
            "id": resume.id,
            "name": resume.name,
            "email": resume.email,
            "phone": resume.phone,
            "file_name": resume.file_name,
            "upload_date": resume.upload_date
        }
        for resume in resumes
    ]


@app.get("/resumes/{resume_id}")
def get_resume_details(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    return {
        "id": resume.id,
        "name": resume.name,
        "email": resume.email,
        "phone": resume.phone,
        "file_name": resume.file_name,
        "core_skills": resume.core_skills,
        "soft_skills": resume.soft_skills,
        "resume_rating": resume.resume_rating,
        "improvement_areas": resume.improvement_areas,
        "upskill_suggestions": resume.upskill_suggestions,
        "upload_date": resume.upload_date
    }
