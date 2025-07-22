from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import os
import shutil
from uuid import uuid4
import json
from datetime import datetime

from backend import database, models
from backend.resume_parser import parse_resume
from backend.models import Resume, ResumeRecord

app = FastAPI()

# ------------------- CORS -------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

get_db = database.get_db

# ------------------- Upload & Analyze -------------------
@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        temp_filename = f"temp_{uuid4()}.pdf"
        temp_path = os.path.join("backend", "temp_uploads", temp_filename)
        os.makedirs(os.path.dirname(temp_path), exist_ok=True)

        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Parse resume
        result = parse_resume(temp_path)

        # Save full resume to main table
        resume_entry = models.Resume(
            name=result.get("name", ""),
            email=result.get("email", ""),
            phone=result.get("phone", ""),
            linkedin=result.get("linkedin", ""),
            github=result.get("github", ""),
            summary=result.get("summary", ""),
            work_experience=json.dumps(result.get("work_experience", [])),
            education=json.dumps(result.get("education", [])),
            certifications=json.dumps(result.get("certifications", [])),
            projects=json.dumps(result.get("projects", [])),
            core_skills=json.dumps(result.get("core_skills", [])),
            soft_skills=json.dumps(result.get("soft_skills", [])),
            languages=json.dumps(result.get("languages", [])),
            achievements=json.dumps(result.get("achievements", [])),
            awards=json.dumps(result.get("awards", [])),
            interests=json.dumps(result.get("interests", [])),
            resume_improvement_suggestions=json.dumps(result.get("resume_improvement_suggestions", [])),
            file_name=file.filename
        )
        db.add(resume_entry)
        db.commit()
        db.refresh(resume_entry)

        # Save short record to history table
        score = result.get("resume_rating", 0)
        history_entry = models.ResumeRecord(
            resume_name=file.filename,
            candidate_name=result.get("name", ""),
            candidate_email=result.get("email", ""),
            candidate_phone=result.get("phone", ""),
            ai_score=score if isinstance(score, (int, float)) else 0,
            top_skills=result.get("core_skills", []),         # ✅ Use raw list
            full_analysis=result  # 🔥 ADD THIS LINE
        )
        db.add(history_entry)
        db.commit()

        os.remove(temp_path)

        return {
            "id": resume_entry.id,
            **result,
            "file_name": file.filename,
            "upload_date": str(resume_entry.upload_date)
        }

    except Exception as e:
        print("🔥 Upload Resume Error:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ------------------- Resume History Summary -------------------
@app.get("/history/")
def get_resume_history(db: Session = Depends(get_db)):
    histories = db.query(models.ResumeRecord).order_by(models.ResumeRecord.upload_date.desc()).all()

    resumes = []
    try:
        for r in histories:
            matching_resume = db.query(models.Resume).filter(models.Resume.file_name == r.resume_name).first()

            try:
                top_skills = r.top_skills or []
            except json.JSONDecodeError:
                top_skills = []

            # fallback to safe defaults if resume data not found
            analysis_data = {}
            if matching_resume:
                try:
                    analysis_data = {
                        "name": matching_resume.name,
                        "email": matching_resume.email,
                        "phone": matching_resume.phone,
                        "linkedin": matching_resume.linkedin,
                        "github": matching_resume.github,
                        "summary": matching_resume.summary,
                        "work_experience": json.loads(matching_resume.work_experience or "[]"),
                        "education": json.loads(matching_resume.education or "[]"),
                        "certifications": json.loads(matching_resume.certifications or "[]"),
                        "projects": json.loads(matching_resume.projects or "[]"),
                        "core_skills": json.loads(matching_resume.core_skills or "[]"),
                        "soft_skills": json.loads(matching_resume.soft_skills or "[]"),
                        "languages": json.loads(matching_resume.languages or "[]"),
                        "achievements": json.loads(matching_resume.achievements or "[]"),
                        "awards": json.loads(matching_resume.awards or "[]"),
                        "interests": json.loads(matching_resume.interests or "[]"),
                        "resume_improvement_suggestions": json.loads(matching_resume.resume_improvement_suggestions or "[]"),
                        "upskill_suggestions": json.loads(matching_resume.upskill_suggestions or "[]"),
                        "file_name": matching_resume.file_name,
                        "upload_date": str(matching_resume.upload_date),
                        "score": r.ai_score,
                    }
                except Exception as e:
                    print(f"❌ Error parsing JSON from Resume model for {r.resume_name}: {e}")

            resumes.append({
                "resumeName": r.resume_name,
                "candidateName": r.candidate_name,
                "candidateEmail": r.candidate_email,
                "candidatePhone": r.candidate_phone,
                "uploadDate": r.upload_date.strftime("%Y-%m-%d"),
                "aiScore": r.ai_score,
                "topSkills": top_skills,
                **analysis_data
            })

        return {
            "totalResumes": len(histories),
            "averageRating": round(sum([r.ai_score for r in histories]) / len(histories), 2) if histories else 0,
            "thisMonth": sum(1 for r in histories if r.upload_date.month == datetime.now().month),
            "topScore": max((r.ai_score for r in histories), default=0),
            "resumes": resumes
        }

    except Exception as e:
        print("🔥 Error in /history/:", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

# ------------------- Get All Resumes -------------------
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
            "upload_date": str(resume.upload_date)
        }
        for resume in resumes
    ]

# ------------------- Resume Details -------------------
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
        "linkedin": resume.linkedin,
        "github": resume.github,
        "summary": resume.summary,
        "work_experience": json.loads(resume.work_experience),
        "education": json.loads(resume.education),
        "certifications": json.loads(resume.certifications),
        "projects": json.loads(resume.projects),
        "core_skills": json.loads(resume.core_skills),
        "soft_skills": json.loads(resume.soft_skills),
        "languages": json.loads(resume.languages),
        "achievements": json.loads(resume.achievements),
        "awards": json.loads(resume.awards),
        "interests": json.loads(resume.interests),
        "resume_improvement_suggestions": json.loads(resume.resume_improvement_suggestions),
        "file_name": resume.file_name,
        "upload_date": str(resume.upload_date)
    }

# ------------------- Resume Delete -------------------
@app.delete("/history/{filename}")
def delete_resume(filename: str, db: Session = Depends(get_db)):
    resume = db.query(ResumeRecord).filter(ResumeRecord.resume_name == filename).first()
    if resume:
        db.delete(resume)
        db.commit()
        return JSONResponse(content={"message": "Deleted successfully"})
    return JSONResponse(status_code=404, content={"error": "Resume not found"})

# ------------------- Resume by Filename -------------------
@app.get("/resume-by-filename/{filename}")
def get_resume_by_filename(filename: str, db: Session = Depends(get_db)):
    record = db.query(models.ResumeRecord).filter(models.ResumeRecord.resume_name == filename).first()
    if not record or not record.full_analysis:
        raise HTTPException(status_code=404, detail="Resume not found")

    try:
        if isinstance(record.full_analysis, str):
            analysis = json.loads(record.full_analysis)
        else:
            analysis = record.full_analysis
    except Exception as e:
        print(f"❌ Failed to parse full_analysis JSON for {filename}: {e}")
        raise HTTPException(status_code=500, detail="Invalid analysis data")

    return {
        "id": record.id,
        "filename": record.resume_name,
        "name": record.candidate_name,
        "email": record.candidate_email,
        "phone": record.candidate_phone,
        "score": record.ai_score,
        **analysis  # include all detailed analysis fields like summary, skills, etc.
    }

