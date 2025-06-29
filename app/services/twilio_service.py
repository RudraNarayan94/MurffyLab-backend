from twilio.twiml.voice_response import VoiceResponse
from twilio.rest import Client
from app.config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN

# Initialize Twilio client
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def notify_recipient(
    recipient_number: str,
    twilio_number: str,
    text_body: str,
    audio_url: str | None = None
) -> str:
    if not text_body:
        raise ValueError("text_body is required for SMS")

    twiml = VoiceResponse()
    if audio_url:
        twiml.play(audio_url)
    else:
        twiml.say(text_body)

    call = client.calls.create(
        to=recipient_number,
        from_=twilio_number,
        twiml=twiml
    )

    # always send SMS with the text
    client.messages.create(
        body=text_body,
        from_=twilio_number,
        to=recipient_number
    )

    return call.sid

# def notify_recipient(recipient_number : str, twillo_number : str, body: str) -> str:
#     if not body:
#         raise ValueError("text body is required")

#     call = client.calls.create(
#         to=recipient_number,
#         from_=twillo_number,
#         twiml=f"<Response><Say>{body}</Say></Response>",
#     )

#     msg = client.messages.create(
#         body=f"{body}",
#         from_=twillo_number,
#         to=recipient_number
#     )

#     return call.sid
