from pydantic import BaseModel
from typing import List, Optional

class LabReportResponse(BaseModel):
    key_medical_terms: List[str]
    summary: str
    critical_observations: List[str] = []
    precautions: str
    chat_id: str
    audio_id: Optional[str] = None
    audio_error: Optional[str] = None
