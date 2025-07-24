# 📄 AI Resume Analyzer

An AI-powered web application that parses resumes (PDF), analyzes them using Natural Language Processing (NLP), and offers intelligent feedback to help candidates improve their resumes. Built with **FastAPI**, **React.js**, **Tailwind CSS**, **PostgreSQL**, and integrates **Together AI API** for AI suggestions.

---

## 🔍 Features

- 🧠 **AI-Powered Analysis**: Uses Google's Gemini API to provide personalized resume suggestions and upskilling tips.
- 📄 **Resume Parsing**: Extracts structured information like name, contact, skills, education, work experience, and projects.
- 📊 **Scoring System**: Provides an AI-based rating out of 10 for resume quality.
- 📈 **Dashboard View**: Detailed analysis view with improvement areas, skills breakdown, and resume summary.
- 🗂️ **History Tracking**: Keeps all analyzed resumes accessible with an "eye icon" to revisit them and delete if needed.
- 🔐 **Secure Uploads**: Sanitizes input, prevents duplication, and handles missing/invalid data gracefully.
- ☁️ **Cloud Deployed**: Uses Vercel (frontend) and Railway (backend & DB) for seamless deployment.

---

## 🛠️ Tech Stack
---------------------------------------------------------------
| Layer        | Tech Used                                    |
|--------------|----------------------------------------------|
| Frontend     | React.js, Tailwind CSS, Axios                |
| Backend      | FastAPI, Pydantic, SQLAlchemy, Uvicorn       |
| AI/NLP       | Together AI API                              |
| Database     | PostgreSQL (via Railway)                     |
| PDF Parsing  | PyMuPDF, OCR, Regex                          |
---------------|-----------------------------------------------
---

## 📁 Project Structure

resume-analyzer/
├── backend/
│   ├── __pycache__/
│   ├── temp_uploads/
│   ├── create_db.py            # DB table creator
│   ├── database.py             # PostgreSQL DB session setup
│   ├── llm_utils.py            # Together AI integration
│   ├── main.py                 # FastAPI entry point
│   ├── models.py               # SQLAlchemy DB models
│   ├── resume_parser.py        # Resume parsing & NLP logic
│   ├── requirements.txt
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   │   ├── samples/   
│   ├── src/
│   │   ├── assets/
│   │   │   ├── LogoResumeAnalyzer.png
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── AnalysisResult.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ResumeCards.jsx
│   │   │   ├── SampleResume.jsx
│   │   │   ├── ScoreCard.jsx
│   │   │   ├── UploadSection.jsx
│   │   │   └── WhatYouGetSection.jsx
│   │   ├── pages/
│   │   │   ├── History.jsx
│   │   │   ├── Home.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   ├── eslint.config.js

---

## 📬 API Endpoints

----------------------------------------------------------------------------------------------
| Method | Endpoint                            | Description                                 |
|--------|-------------------------------------|---------------------------------------------|
| POST   | `/upload-resume/`                   | Upload and analyze a resume                 |
| GET    | `/history/`                         | Fetch summarized history of all resumes     |
| GET    | `/resumes/`                         | Get minimal info of all uploaded resumes    |
| GET    | `/resume-by-filename/{filename}`    | Get analysis of specific resume             |
| DELETE | `/history/{filename}`               | Delete a resume record by file name         |
----------------------------------------------------------------------------------------------


### Backend

1. Create a virtual environment and activate:
    python -m venv venv
    /venv/Scripts/Activate.ps1

2. Install dependencies:
    pip install -r requirements.txt

3. Run the FastAPI server:
    uvicorn backend.main:app --reload

### Frontend
1. Navigate to the frontend folder:
    cd frontend

2. Install dependencies:
    npm install

3. Start the React development server:
    npm run dev
    The app should now be available at http://localhost:5173

### 🧠 AI Integration
The AI suggestions and analysis are powered via the Together AI API (llm_utils.py).
You may need to configure your API key as an environment variable or store it securely.

### 🧪 Sample Resume for Testing
Use SampleResume.jsx or drop in a few .pdf files with educational and work info to test the full flow.

### 🔧 Loader and Progress Tracking
The app provides a progress bar and dynamic messages while uploading files (20%, 40%, 60%, 80%, 95%).

### 🔄 Drag & Drop Support
The application supports both drag-and-drop functionality and the traditional file upload button for resume uploads.

### 🤝 Credits
This project was developed by Smit Potkar.