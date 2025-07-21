# import os
# from dotenv import load_dotenv
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain_core.prompts import PromptTemplate

# load_dotenv()

# GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# llm = ChatGoogleGenerativeAI(
#     model="gemini-1.5-pro",
#     google_api_key=GOOGLE_API_KEY,
#     temperature=0.7
# )

# # Prompts
# improvement_prompt = PromptTemplate.from_template(""" 
# You are a professional resume reviewer. Read the following resume content and suggest 3-5 detailed improvements to enhance the resume quality.

# Resume:
# {text}

# Your output should be concise and helpful.
# """)

# upskill_prompt = PromptTemplate.from_template(""" 
# You are a career coach. Based on the following skills, suggest 3 specific and relevant technical or soft skills to upskill and improve the candidate’s profile.

# Skills: {skills}

# Output only the list.
# """)

# def generate_improvement_suggestions(text: str) -> str:
#     chain = improvement_prompt | llm
#     return chain.invoke({"text": text})

# def generate_upskill_suggestions(skills: list) -> str:
#     chain = upskill_prompt | llm
#     skills_str = ", ".join(skills)
#     return chain.invoke({"skills": skills_str})


# import os
# from dotenv import load_dotenv
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain_core.prompts import PromptTemplate
# import json

# load_dotenv()
# GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# llm = ChatGoogleGenerativeAI(
#     model="gemini-1.5-pro",
#     google_api_key=GOOGLE_API_KEY,
#     temperature=0.5
# )

# schema_prompt = PromptTemplate.from_template("""You are an expert resume analyzer. 
# Given the following resume text, extract every possible field into a detailed JSON object (see below), 
# and also provide 3-5 concrete suggestions to improve the resume.

# Resume:
# {text}

# Return as a JSON object with keys: 
# {{
#   "name": "",
#   "email": "",
#   "phone": "",
#   "linkedin": "",
#   "github": "",
#   "summary": "",
#   "work_experience": [
#     {{"job_title": "", "company": "", "start_date": "", "end_date": "", "description": ""}}
#   ],
#   "education": [
#     {{"degree": "", "institution": "", "start_date": "", "end_date": "", "gpa": ""}}
#   ],
#   "certifications": [
#     {{"name": "", "issuer": "", "year": ""}}
#   ],
#   "projects": [
#     {{"title": "", "description": "", "tech": "", "link": ""}}
#   ],
#   "core_skills": [],
#   "soft_skills": [],
#   "languages": [{{"name": "", "proficiency": ""}}],
#   "achievements": [],
#   "awards": [],
#   "interests": [],
#   "resume_improvement_suggestions": []
# }}
# If a field isn't present, leave it blank string or an empty list. STRICTLY output only the JSON and nothing else.
# """)

# def generate_resume_json_and_suggestions(text: str):
#     chain = schema_prompt | llm
#     resp = chain.invoke({"text": text})
#     # Ensure it's JSON, not string with markdown fences etc.
#     output = resp
#     if isinstance(output, str):
#         # Strip markdown code blocks if present
#         output = output.strip()
#         if output.startswith("```"):
#             output = output.lstrip("`json").strip("`").strip()
#         elif output.startswith("```"):
#             output = output.lstrip("`").strip("`").strip()
#         try:
#             output = json.loads(output)
#         except Exception as e:
#             print("Failed to parse JSON from Gemini output", e)
#             output = {"error": "Invalid JSON from LLM"}
#     return output












# import os
# import json
# from dotenv import load_dotenv
# from langchain.prompts import PromptTemplate
# from langchain.chat_models import ChatOpenAI

# # Load .env
# load_dotenv()
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# if not OPENAI_API_KEY:
#     raise ValueError("❌ OPENAI_API_KEY is not set in the environment variables.")

# # Initialize OpenAI model
# try:
#     llm = ChatOpenAI(
#         model="gpt-3.5-turbo",  # Change to gpt-4 if you have access
#         temperature=0.5,
#         openai_api_key=OPENAI_API_KEY
#     )
# except Exception as e:
#     raise RuntimeError(f"❌ Failed to initialize ChatOpenAI: {e}")

# # ------------------ PROMPTS ------------------

# schema_prompt = PromptTemplate.from_template("""
# You are an expert resume analyzer. 
# Given the following resume text, extract every possible field into a detailed JSON object (see below), 
# and also provide 3-5 concrete suggestions to improve the resume.

# Resume:
# {text}

# Return as a JSON object with keys: 
# {{
#   "name": "",
#   "email": "",
#   "phone": "",
#   "linkedin": "",
#   "github": "",
#   "summary": "",
#   "work_experience": [
#     {{"job_title": "", "company": "", "start_date": "", "end_date": "", "description": ""}}
#   ],
#   "education": [
#     {{"degree": "", "institution": "", "start_date": "", "end_date": "", "gpa": ""}}
#   ],
#   "certifications": [
#     {{"name": "", "issuer": "", "year": ""}}
#   ],
#   "projects": [
#     {{"title": "", "description": "", "tech": "", "link": ""}}
#   ],
#   "core_skills": [],
#   "soft_skills": [],
#   "languages": [{{"name": "", "proficiency": ""}}],
#   "achievements": [],
#   "awards": [],
#   "interests": [],
#   "resume_improvement_suggestions": []
# }}
# If a field isn't present, leave it blank string or an empty list. STRICTLY output only the JSON and nothing else.
# """)

# improvement_prompt = PromptTemplate.from_template("""
# You are a professional resume reviewer. Read the following resume content and suggest 3-5 detailed improvements to enhance the resume quality.

# Resume:
# {text}

# Your output should be concise and helpful.
# """)

# upskill_prompt = PromptTemplate.from_template("""
# You are a career coach. Based on the following skills, suggest 3 specific and relevant technical or soft skills to upskill and improve the candidate’s profile.

# Skills: {skills}

# Output only the list.
# """)

# # ------------------ FUNCTIONS ------------------

# def generate_resume_json_and_suggestions(text: str):
#     try:
#         print("🧠 Calling LLM for resume JSON + suggestions...")
#         chain = schema_prompt | llm
#         raw_response = chain.invoke({"text": text})

#         print("📥 Raw LLM Output:")
#         print(raw_response)

#         if isinstance(raw_response, str):
#             response = raw_response.strip()
#             if response.startswith("```"):
#                 # Remove markdown code fences if present
#                 response = response.lstrip("`json").strip("`").strip()
#             try:
#                 return json.loads(response)
#             except json.JSONDecodeError as e:
#                 print("❌ JSON parsing error:", e)
#                 return {"error": "Invalid JSON format from LLM", "raw_response": raw_response}
#         else:
#             return raw_response

#     except Exception as e:
#         print("❌ Exception during LLM call for resume JSON:", e)
#         return {"error": str(e)}

# def generate_improvement_suggestions(text: str) -> str:
#     try:
#         print("🧠 Calling LLM for improvement suggestions...")
#         chain = improvement_prompt | llm
#         return chain.invoke({"text": text})
#     except Exception as e:
#         print("❌ Exception during improvement generation:", e)
#         return f"Error: {e}"

# def generate_upskill_suggestions(skills: list) -> str:
#     try:
#         print("🧠 Calling LLM for upskilling suggestions...")
#         chain = upskill_prompt | llm
#         skills_str = ", ".join(skills)
#         return chain.invoke({"skills": skills_str})
#     except Exception as e:
#         print("❌ Exception during upskill suggestion:", e)
#         return f"Error: {e}"







import os
import json
from dotenv import load_dotenv
import openai

# Load Together API key
load_dotenv()
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")

if not TOGETHER_API_KEY:
    raise ValueError("❌ TOGETHER_API_KEY is not set in the environment variables.")

# Configure OpenAI to use Together.ai
openai.api_key = TOGETHER_API_KEY
openai.api_base = "https://api.together.xyz/v1"

# ------------------ PROMPTS ------------------

schema_prompt = """
You are an expert resume analyzer. 
Given the following resume text, extract every possible field into a detailed JSON object (see below), 
and also provide 3-5 concrete suggestions to improve the resume.
Additionally, provide a resume_rating (1 to 10) that reflects how strong this resume is based on relevance, completeness, clarity, and professionalism.

Resume:
{text}

Return as a JSON object with keys: 
{{
  "name": "",
  "email": "",
  "phone": "",
  "linkedin": "",
  "github": "",
  "summary": "",
  "work_experience": [
    {{"job_title": "", "company": "", "start_date": "", "end_date": "", "description": ""}}
  ],
  "education": [
    {{"degree": "", "institution": "", "start_date": "", "end_date": "", "gpa": ""}}
  ],
  "certifications": [
    {{"name": "", "issuer": "", "year": ""}}
  ],
  "projects": [
    {{"title": "", "description": "", "tech": "", "link": ""}}
  ],
  "core_skills": [],
  "soft_skills": [],
  "languages": [{{"name": "", "proficiency": ""}}],
  "achievements": [],
  "awards": [],
  "interests": [],
  "resume_improvement_suggestions": [],
  "resume_rating": 0.0
}}
If a field isn't present, leave it blank string or an empty list. STRICTLY output only the JSON and nothing else.
"""

improvement_prompt = """
You are a professional resume reviewer. Read the following resume content and suggest 3-5 detailed improvements to enhance the resume quality.

Resume:
{text}

Your output should be concise and helpful.
"""

upskill_prompt = """
You are a career coach. Based on the following skills, suggest 3 specific and relevant technical or soft skills to upskill and improve the candidate’s profile.

Skills: {skills}

Output only the list.
"""

# ------------------ UTILITY CALL ------------------

def call_together(prompt: str, temperature: float = 0.5) -> str:
    try:
        response = openai.ChatCompletion.create(
            model="mistralai/Mistral-7B-Instruct-v0.2",
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature
        )
        return response.choices[0].message["content"].strip()
    except Exception as e:
        print("❌ Error:", e)
        return f"Error: {str(e)}"

# ------------------ FUNCTIONS ------------------

def generate_resume_json_and_suggestions(text: str):
    try:
        print("🧠 Calling Together AI for resume JSON + suggestions...")
        prompt = schema_prompt.replace("{text}", text)
        raw_response = call_together(prompt)

        print("📥 Raw LLM Output:")
        print(raw_response)

        # Clean and parse JSON response
        response = raw_response.strip()
        if response.startswith("```"):
            response = response.lstrip("`json").strip("`").strip()

        try:
            resume_data = json.loads(response)

            # Validate or patch resume_rating
            if "resume_rating" not in resume_data or not isinstance(resume_data["resume_rating"], (int, float)):
                resume_data["resume_rating"] = 0.0

            return resume_data
        except json.JSONDecodeError as e:
            print("❌ JSON parsing error:", e)
            return {"error": "Invalid JSON format from LLM", "raw_response": raw_response}

    except Exception as e:
        print("❌ Exception during Together call:", e)
        return {"error": str(e)}

def generate_improvement_suggestions(text: str) -> str:
    try:
        print("🧠 Calling Together AI for improvement suggestions...")
        prompt = improvement_prompt.replace("{text}", text)
        return call_together(prompt)
    except Exception as e:
        print("❌ Exception during improvement generation:", e)
        return f"Error: {e}"

def generate_upskill_suggestions(skills: list) -> str:
    try:
        print("🧠 Calling Together AI for upskilling suggestions...")
        skills_str = ", ".join(skills)
        prompt = upskill_prompt.replace("{skills}", skills_str)
        return call_together(prompt)
    except Exception as e:
        print("❌ Exception during upskill suggestion:", e)
        return f"Error: {e}"
