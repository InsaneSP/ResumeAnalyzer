import fitz  # PyMuPDF
import re

def extract_text_from_pdf(file_path):
    text = ""
    doc = fitz.open(file_path)
    for page in doc:
        text += page.get_text()
    return text

def extract_name(text):
    lines = text.strip().split('\n')
    return lines[0] if lines else "Unknown"

def extract_email(text):
    match = re.search(r'[\w\.-]+@[\w\.-]+', text)
    return match.group(0) if match else "Not found"

def extract_phone(text):
    match = re.search(r'(\+?\d{1,4}[\s\-]?)?(\(?\d{3,4}\)?[\s\-]?)?\d{3,4}[\s\-]?\d{3,4}', text)
    return match.group(0) if match else "Not found"

def extract_skills(text):
    # Very basic; we’ll improve later with NLP or a skill list match
    skill_keywords = ['java', 'react', 'python', 'sql', 'figma', 'spring boot', 'machine learning',
                      'tensorflow', 'node.js', 'product management', 'agile']
    
    found_skills = []
    text_lower = text.lower()

    for skill in skill_keywords:
        if skill.lower() in text_lower:
            found_skills.append(skill.title())

    return list(set(found_skills[:10]))  # max 10 for simplicity

def extract_soft_skills(text):
    # Dummy soft skills matcher (improvable later)
    soft_keywords = ['team player', 'communication', 'leadership', 'adaptability', 'problem solving', 'hardworking']
    found = [s.title() for s in soft_keywords if s in text.lower()]
    return list(set(found[:5]))
