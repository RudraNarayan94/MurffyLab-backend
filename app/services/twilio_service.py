# from twilio.twiml.voice_response import VoiceResponse
from twilio.rest import Client
from app.config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN

# Initialize Twilio client
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def notify_recipient(recipient_number : str, twillo_number : str, body: str) -> str:
    if not body:
        raise ValueError("text body is required")

    call = client.calls.create(
        to=recipient_number,
        from_=twillo_number,
        twiml=f"<Response><Say>{body}</Say></Response>",
    )

    msg = client.messages.create(
        body=f"{body}",
        from_=twillo_number,
        to=recipient_number
    )

    return call.sid
