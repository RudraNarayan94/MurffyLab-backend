import re
from app.config import MURF_API_KEY
from murf import Murf

def generate_audio(texts: list[dict], voice_id: str = "en-US-natalie") -> str:
    if not MURF_API_KEY:
        raise Exception("MURF_API_KEY is missing")

    # Normalize to a list of strings
    values = [
        t["value"] if isinstance(t, dict) else t
        for t in texts
    ]
    combined_text = "\n".join(values)

    client = Murf(api_key=MURF_API_KEY)
    response = client.text_to_speech.generate(text=combined_text, voice_id=voice_id)

    if not getattr(response, "audio_file", None):
        raise Exception("No audio_file returned from Murf")

    return response.audio_file

# def generate_audio(summary: str, observations: list, precautions: str, voice_id="en-US-natalie"):
#     if not MURF_API_KEY:
#         raise Exception("MURF_API_KEY is missing")

#     combined = f"{summary}\nCritical Observations:\n" + "\n".join(observations) + f"\n\nPrecautions:\n{precautions}"
#     client = Murf(api_key=MURF_API_KEY)
#     response = client.text_to_speech.generate(text=combined, voice_id=voice_id)
#     return response.audio_file




def translate_text(texts: list[dict], target_language: str) -> list[str]:
    """
    Sends plain strings to Murf and returns a list of translated strings.
    Accepts either:
      - texts: ["raw string", ...]
      - texts: [{"key": ..., "value": ...}, ...]
    """
    if not MURF_API_KEY:
        raise Exception("MURF_API_KEY is missing")

    # Extract raw strings
    raw_texts = [
        t["value"] if isinstance(t, dict) else t
        for t in texts
    ]

    client = Murf(api_key=MURF_API_KEY)
    response = client.text.translate(
        target_language=target_language,
        texts=raw_texts
    )

    translations = []
    for item in response.translations:
        # If it's already a plain string, accept it
        if isinstance(item, str):
            s = item
        else:
            # Fallback to str() for unknown object types
            s = str(item)

        # Now extract translated_text='…' via regex
        # It may be formatted: source_text='…' translated_text='…'
        m = re.search(r"translated_text=['\"](.+?)['\"]$", s)
        if m:
            translations.append(m.group(1))
        else:
            # If regex fails, append full string as a fallback
            translations.append(s)

    return translations
