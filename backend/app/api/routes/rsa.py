from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import openai
import anthropic

router = APIRouter()


class RSARequest(BaseModel):
    business_name: str
    landing_url: Optional[str] = None
    keywords: str
    unique_value_props: str
    target_audience: Optional[str] = "General"
    campaign_goal: Optional[str] = "Drive Conversions"
    tone: Optional[str] = "Professional"
    num_variations: Optional[int] = 3


class HeadlineDescriptionSet(BaseModel):
    headlines: list[str]
    descriptions: list[str]
    ctr_score: int


class RSAResponse(BaseModel):
    variations: list[HeadlineDescriptionSet]
    model_used: str
    generation_time_ms: int


@router.post("/generate", response_model=RSAResponse)
async def generate_rsa_ads(request: RSARequest):
    """
    Generate RSA ad variations using OpenAI GPT-4 and/or Anthropic Claude.
    Returns up to 3 variations with 15 headlines and 4 descriptions each.
    """
    openai_key = os.getenv("OPENAI_API_KEY")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")

    if not openai_key and not anthropic_key:
        raise HTTPException(
            status_code=503,
            detail="No AI API keys configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY."
        )

    prompt = f"""
You are an expert Google Ads copywriter. Generate {request.num_variations} RSA ad variations for:

Business: {request.business_name}
Landing URL: {request.landing_url or 'Not provided'}
Target Keywords: {request.keywords}
Unique Value Propositions: {request.unique_value_props}
Target Audience: {request.target_audience}
Campaign Goal: {request.campaign_goal}
Tone: {request.tone}

For each variation, provide:
- 6 headlines (max 30 characters each)
- 2 descriptions (max 90 characters each)
- A CTR score from 0-100

Format as JSON array with objects containing: headlines (array), descriptions (array), ctr_score (integer).
Focus on high-CTR patterns: specificity, urgency, social proof, clear CTAs, keyword inclusion.
"""

    # Stub response for scaffold (replace with actual API calls)
    mock_variations = [
        HeadlineDescriptionSet(
            headlines=[
                f"{request.business_name} — Try Free Today",
                "AI-Powered Results in 60 Seconds",
                "Join 10,000+ Happy Customers",
                "No Credit Card Required",
                f"Best {request.campaign_goal} Tool",
                "Start Your Free Trial Now",
            ],
            descriptions=[
                f"{request.business_name} helps you {request.unique_value_props[:60]}. Start free.",
                f"Trusted by professionals. {request.campaign_goal}. Sign up today.",
            ],
            ctr_score=88,
        )
    ] * request.num_variations

    return RSAResponse(
        variations=mock_variations,
        model_used="stub-scaffold",
        generation_time_ms=0,
    )


@router.post("/improve")
async def improve_rsa_ad(
    headlines: list[str],
    descriptions: list[str],
    improvement_focus: Optional[str] = "general",
):
    """Improve existing RSA ad copy with AI."""
    return {
        "message": "Improvement endpoint — implement with OpenAI/Anthropic",
        "original": {"headlines": headlines, "descriptions": descriptions},
        "improved": None,
    }
