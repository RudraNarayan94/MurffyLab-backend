import os, uuid
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from app.services.pdf_processor import extract_text_from_pdf, extract_patient_name, process_lab_report
from app.services.murf_service import generate_audio
from app.services.twilio_service import notify_recipient
from app.models.schemas import LabReportResponse

app = FastAPI()

@app.post("/upload-pdf/")
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

        try:
            audio_id = generate_audio(
                summary=parsed_json["summary"],
                observations=parsed_json["critical_observations"],
                precautions=parsed_json["precautions"]
            )
            parsed_json["audio_id"] = audio_id
        except Exception as err:
            parsed_json["audio_error"] = str(err)

        try:
            call_id = notify_recipient(
                recipient_number="+917749825043",
                twillo_number="+19787057379",
                body=parsed_json["summary"]
            )
            # parsed_json["call_id"] = call_id
        except Exception as err:
            # parsed_json["call_error"] = str(err) 
            print(err)      

        return JSONResponse(content=LabReportResponse(**parsed_json).model_dump())

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

    finally:
        if os.path.exists(pdf_path):
            os.remove(pdf_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
