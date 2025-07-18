import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    google_api_key=GOOGLE_API_KEY,
    temperature=0.7
)

# Improvement Prompt
improvement_prompt = PromptTemplate.from_template("""
You are a professional resume reviewer. Read the following resume content and suggest 3-5 detailed improvements to enhance the resume quality.

Resume:
{text}

Your output should be concise and helpful.
""")

# Upskill Prompt
upskill_prompt = PromptTemplate.from_template("""
You are a career coach. Based on the following skills, suggest 3 specific and relevant technical or soft skills to upskill and improve the candidate’s profile.

Skills: {skills}

Output only the list.
""")

def generate_improvement_suggestions(text: str) -> str:
    chain = improvement_prompt | llm
    return chain.invoke({"text": text})

def generate_upskill_suggestions(skills: list) -> str:
    chain = upskill_prompt | llm
    skills_str = ", ".join(skills)
    return chain.invoke({"skills": skills_str})
