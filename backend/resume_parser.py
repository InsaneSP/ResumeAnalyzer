import fitz  # PyMuPDF
import pytesseract
from pdf2image import convert_from_path
from PIL import Image, ImageFilter, ImageEnhance

from .llm_utils import generate_resume_json_and_suggestions


def extract_text_from_pdf(file_path):
    """Extracts text from a PDF, falls back to OCR if text is not extractable."""
    text = ""
    doc = fitz.open(file_path)

    # Try extracting text from pages directly
    for page in doc:
        page_text = page.get_text("text")
        if page_text.strip():
            text += page_text + "\n"

    # Fallback: OCR if no extractable text found
    if not text.strip():
        print("📸 No extractable text found, falling back to OCR...")
        images = convert_from_path(file_path)
        for img in images:
            preprocessed = preprocess_image(img)
            text += pytesseract.image_to_string(preprocessed) + "\n"

    print("🔍 Extracted Resume Text (first 1000 chars):")
    print(text[:1000])
    return text.strip()


def preprocess_image(img):
    """Preprocess the image to improve OCR accuracy."""
    img = img.convert("L")  # Grayscale
    img = img.filter(ImageFilter.MedianFilter())
    img = ImageEnhance.Contrast(img).enhance(2)
    img = img.point(lambda p: 255 if p > 180 else 0)
    return img


def parse_resume(file_path):
    """Main function to extract structured resume data from a PDF file."""
    text = extract_text_from_pdf(file_path)
    try:
        result_json = generate_resume_json_and_suggestions(text)
    except Exception as e:
        print("🔥 LLM Extraction Error:", e)
        result_json = {"error": "Failed to extract resume information"}
    return result_json
