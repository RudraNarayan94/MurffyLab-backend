from pydantic import BaseModel, HttpUrl
from typing import List, Optional

class LabReportResponse(BaseModel):
    key_medical_terms: List[str]
    summary: str
    critical_observations: List[str] = []
    precautions: str
    chat_id: str
    audio_id: Optional[str] = None
    audio_error: Optional[str] = None

class TextItem(BaseModel):
    key: str
    value: str

class TextsRequest(BaseModel):
    texts: List[TextItem]
    voice_id: str = "en-US-natalie"  # for TTS
    target_language: str = "en"      # for Translate

class CallRequest(BaseModel):
    # recipient_number: Optional[str]   
    # twilio_number: Optional[str]        
    text_body: List[TextItem]             
    audio_url: Optional[str]    
