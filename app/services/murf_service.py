from app.config import MURF_API_KEY
from murf import Murf

def generate_audio(summary: str, observations: list, precautions: str, voice_id="en-US-natalie"):
    if not MURF_API_KEY:
        raise Exception("MURF_API_KEY is missing")

    combined = f"{summary}\nCritical Observations:\n" + "\n".join(observations) + f"\n\nPrecautions:\n{precautions}"
    client = Murf(api_key=MURF_API_KEY)
    response = client.text_to_speech.generate(text=combined, voice_id=voice_id)
    return response.audio_file


def translate_text(texts: list[str], target_language: str):
    if not MURF_API_KEY:
        raise Exception("MURF_API_KEY is missing")

    client = Murf(api_key=MURF_API_KEY)
    response = client.text.translate(
        target_language=target_language,
        texts=texts
    )
    return response.translations
