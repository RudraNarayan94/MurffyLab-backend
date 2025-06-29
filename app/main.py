from fastapi import FastAPI, File, UploadFile, Query, Body, HTTPException
from fastapi.responses import JSONResponse
import os, uuid
from app.services.pdf_processor import extract_text_from_pdf, extract_patient_name, process_lab_report
from app.services.murf_service import generate_audio
from app.services.twilio_service import notify_recipient
from app.services.murf_service import translate_text
from app.models.schemas import LabReportResponse, TextsRequest, CallRequest
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (replace with specific domains in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    pdf_path = f"temp_{uuid.uuid4().hex}.pdf"
    with open(pdf_path, "wb") as f:
        f.write(await file.read())

    try:
        chat_id = str(uuid.uuid4())[:8].upper()
        text = extract_text_from_pdf(pdf_path)
        name = extract_patient_name(text)
        parsed_json, raw_output = process_lab_report(text, name)

        if raw_output:
            return JSONResponse(content={"chat_id": chat_id, "raw_output": raw_output})

        parsed_json["chat_id"] = chat_id
        return JSONResponse(content=LabReportResponse(**parsed_json).model_dump())

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

    finally:
        if os.path.exists(pdf_path):
            os.remove(pdf_path)


# -----------------------------------------------------
# @app.post("/tts")
# def text_to_speech(summary: str = Query(...), observations: list[str] = Query(...), precautions: str = Query(...), voice_id: str = "en-US-natalie"):
#     try:
#         audio_id = generate_audio(summary, observations, precautions, voice_id)
#         return JSONResponse(content={"audio_id": audio_id})
#     except Exception as e:
#         return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/tts")
def text_to_speech(request: TextsRequest = Body(...)):
    try:
        audio_url = generate_audio(request.texts, request.voice_id)
        return {"audio_url": audio_url}
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "error": str(e)
        })





# -----------------------------------------------------
# @app.post("/translate")
# def translate_endpoint(texts: list[str] = Query(...), target_language: str = Query(default="en")):
#     try:
#         translations = translate_text(texts, target_language)
#         return JSONResponse(content={"translations": translations})
#     except Exception as e:
#         return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/translate")
def translate_endpoint(request: TextsRequest = Body(...)):
    try:
        values = [item.value for item in request.texts]
        translations = translate_text(values, request.target_language)

        # Rebuild original keys
        response = [
            {"key": item.key, "translation": trans}
            for item, trans in zip(request.texts, translations)
        ]
        return JSONResponse(content={"translations": response})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
# -----------------------------------------------------
# @app.post("/call")
# def call_patient(summary: str = Query(...)):
#     try:
#         call_id = notify_recipient(
#             recipient_number="+917749825043",
#             twillo_number="+19787057379",
#             body=summary
#         )
#         return JSONResponse(content={"call_id": call_id})
#     except Exception as e:
#         return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post(
    "/call",
    summary="Place a call & SMS using Twilio"
)
def call_patient(request: CallRequest = Body(...)):
    """
    Expects JSON:
    {
      "text_body": "Your lab report summary...",
      "audio_url": "https://cdn.murf.ai/... .mp3"   # optional
    }
    """
    combined_text = "\n".join(item.value for item in request.text_body)
    try:
        call_sid = notify_recipient(
            recipient_number="+917749825043",      
            twilio_number="+19787057379",          
            text_body=combined_text,           
            audio_url=request.audio_url            
        )
        return call_sid
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
