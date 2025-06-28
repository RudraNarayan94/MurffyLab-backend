import uuid, re, json, os
import pymupdf
import pytesseract
from PIL import Image
import openai
from app.config import GROQ_API_KEY, GROQ_MODEL, GROQ_API_BASE

openai.api_key = GROQ_API_KEY
openai.api_base = GROQ_API_BASE
def extract_text_from_pdf(pdf_path: str) -> str:
    doc = pymupdf.open(pdf_path)
    text = ""
    for i in range(len(doc)):
        pix = doc.load_page(i).get_pixmap(dpi=300)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        text += f"\n--- Page {i + 1} ---\n{pytesseract.image_to_string(img)}"
    doc.close()
    return text

def extract_patient_name(text: str) -> str:
    match = re.search(r"(?i)(?:Mr\.|Mrs\.|Ms\.|Patient Name[:\-]?)\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)", text)
    return match.group(1).strip() if match else "Patient"

def process_lab_report(text: str, patient_name: str):
    prompt = f"""
    You are a medical assistant. Analyze the following medical lab report.

    Return structured JSON with:
    - key_medical_terms: important terms (e.g., Hemoglobin, Glucose)
    - summary: speak directly to the patient, starting with \"Hello Mr. {patient_name}, ...\" (3-4 lines)
    - critical_observations: list of abnormal results or issues
    - precautions: friendly, clear advice for the patient

    Be conversational, simple, and helpful.

    Lab Report Text:
    {text}
    """
    response = openai.ChatCompletion.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    result_text = response.choices[0].message.content
    match = re.search(r"```json\n(.*?)\n```", result_text, re.DOTALL)

    if not match:
        return None, result_text

    try:
        parsed = json.loads(match.group(1).strip())
        return parsed, None
    except json.JSONDecodeError as e:
        return {"error": str(e), "raw_output": match.group(1)}, None
