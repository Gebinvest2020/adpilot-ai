# AdPilot AI — Backend API

FastAPI backend for the AdPilot AI platform.

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Fill in your API keys in .env
uvicorn app.main:app --reload --port 8000
```

## API Docs

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/rsa/generate | Generate RSA ad variations |
| POST | /api/v1/rsa/improve | Improve existing RSA ads |
| POST | /api/v1/moderation/check | Check for policy violations |
| POST | /api/v1/moderation/fix | Auto-fix flagged issues |
| POST | /api/v1/ctr/analyze | Analyze CTR potential |
| POST | /api/v1/ctr/improve | Improve ad for higher CTR |
