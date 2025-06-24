# Kinkare Backend

A FastAPI-based backend service for the Kinkare medical AI application.

## Overview

This backend provides API endpoints for OCR processing, AI analysis, text-to-speech conversion, and communication services using FastAPI.

## Prerequisites

- Python 3.12+
- Git for version control

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/RudraNarayan94/Kinkare-backend.git
cd Kinkare-backend
```

### 2. Set Up Virtual Environment

```bash
# Create virtual environment
python -m venv .venv

# Activate on Windows
.\.venv\Scripts\activate

# Activate on macOS/Linux
source .venv/bin/activate

source .venv/Scripts/activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file with your service credentials:

```
OCR_PROVIDER=tesseract
AI_MODEL_ENDPOINT=http://localhost:11434
MURF_API_KEY=your_murf_api_key
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
```

## Project Structure

```
Kinkare-backend/
├── app/                    # Main application package
│   ├── main.py             # FastAPI app initialization
│   ├── config.py           # Configuration settings
│   ├── routers/            # API endpoints
│   ├── services/           # Business logic
│   ├── models/             # Data models
│   └── utils/              # Helper functions
├── tests/                  # Test suite
├── .env                    # Environment variables (git-ignored)
├── .env.example            # Template for environment variables
├── requirements.txt        # Dependencies
└── README.md               # This file
```

## Running the Application

Start the development server:

```bash
uvicorn app.main:app --reload
```

Access the interactive API documentation:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

The API provides the following main endpoints:

- `/api/ocr` - Document OCR processing
- `/api/analysis` - AI-based medical text analysis
- `/api/tts` - Text-to-speech conversion
- `/api/communication` - Twilio integration for calls/messaging

## Development

<!-- ### Running Tests

```bash
pytest
``` -->

### Adding Dependencies

When adding new dependencies, update the requirements file:

```bash
pip freeze > requirements.txt
```

## License

[Your License]
