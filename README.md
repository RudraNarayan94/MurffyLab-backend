# 🔬 MurffyLab

> Your lab reports. Finally explained.

No more confusion, no more Googling medical terms. MurffyLab reads your report, explains it simply, and speaks it in your language. Upload once. Get clarity forever.

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12+-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

## 📋 Contents

- [Overview](#-overview)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

MurffyLab is a FastAPI-based backend service for the Kinkare medical AI application. It simplifies complex medical reports by providing AI-powered analysis, text-to-speech conversion, and multilingual support.

## ✨ Features

- 📝 **OCR Processing**: Extract text from uploaded medical reports
- 🧠 **AI Analysis**: Interpret medical terminology in plain language
- 🔊 **Text-to-Speech**: Convert explanations to spoken audio
- 💬 **Multilingual Support**: Understand reports in any language
- 📱 **Communication Services**: SMS and call notifications via Twilio

## 🚀 Getting Started

### Prerequisites

- Python 3.12+
- Git for version control

### Installation

1. **Clone the Repository**

```bash
git clone https://github.com/RudraNarayan94/Kinkare-backend.git
cd Kinkare-backend
```

2. **Set Up Virtual Environment**

```bash
# Create virtual environment
python -m venv .venv

# Activate on Windows
.\.venv\Scripts\activate

# Activate on macOS/Linux
source .venv/bin/activate
```

3. **Install Dependencies**

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

4. **Configure Environment Variables**

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

5. **Start the Application**

```bash
uvicorn app.main:app --reload
```

Access the API at: http://localhost:8000

## 📂 Project Structure

```
Kinkare-backend/
├── app/                    # Main application package
│   ├── main.py             # FastAPI app initialization
│   ├── config.py           # Configuration settings
│   ├── api/                # API endpoints
│   │   ├── routes/         # Route definitions
│   │   └── dependencies.py # Endpoint dependencies
│   ├── services/           # Business logic
│   │   ├── ocr.py          # OCR processing
│   │   ├── analysis.py     # AI analysis
│   │   ├── tts.py          # Text-to-speech
│   │   └── communication.py # Twilio integration
│   ├── models/             # Data models
│   │   ├── request.py      # Request schemas
│   │   └── response.py     # Response schemas
│   ├── core/               # Core functionality
│   │   ├── security.py     # Authentication
│   │   └── exceptions.py   # Custom exceptions
│   └── utils/              # Utility functions
├── tests/                  # Test suite
│   ├── conftest.py         # Test configuration
│   ├── test_api/           # API tests
│   └── test_services/      # Service tests
├── scripts/                # Utility scripts
├── docs/                   # Documentation
├── .env                    # Environment variables (git-ignored)
├── .env.example            # Template for environment variables
├── requirements.txt        # Dependencies
├── requirements-dev.txt    # Development dependencies
├── Dockerfile              # Container definition
├── docker-compose.yml      # Container orchestration
└── README.md               # This file
```

## 📚 API Documentation

Once the application is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

| Endpoint             | Method | Description                             |
| -------------------- | ------ | --------------------------------------- |
| `/api/translate`     | POST   | Process and extract text from documents |
| `/api/analysis`      | POST   | Analyze medical text with AI            |
| `/api/tts`           | POST   | Convert text to speech audio            |
| `/api/communication` | POST   | Send notifications via SMS/calls        |
| `/health`            | GET    | Service health check                    |

## 🛠️ Development

### Running Tests

```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Run tests
pytest

# Run tests with coverage
pytest --cov=app
```

### Code Quality

```bash
# Run linting
flake8 app tests

# Run type checking
mypy app
```

### Adding Dependencies

When adding new dependencies, update the requirements file:

```bash
pip freeze > requirements.txt
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by the MurffyLab Team
