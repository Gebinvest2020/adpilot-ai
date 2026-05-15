from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import rsa, moderation, ctr
import os

app = FastAPI(
    title="AdPilot AI API",
    description="Premium AI-powered Google Ads assistant backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://app.adpilot.ai",
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(rsa.router, prefix="/api/v1/rsa", tags=["RSA Generator"])
app.include_router(moderation.router, prefix="/api/v1/moderation", tags=["Moderation"])
app.include_router(ctr.router, prefix="/api/v1/ctr", tags=["CTR Analyzer"])


@app.get("/")
async def root():
    return {
        "service": "AdPilot AI API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "version": "1.0.0"}
