from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal
import os

router = APIRouter()


class CTRAnalysisRequest(BaseModel):
    headlines: list[str]
    descriptions: list[str]
    keywords: Optional[list[str]] = []
    industry: Optional[str] = "General"
    include_competitor_analysis: Optional[bool] = False


class ScoreBreakdown(BaseModel):
    name: str
    score: int
    status: Literal["excellent", "good", "average", "needs-work"]
    explanation: str


class CTRAnalysisResponse(BaseModel):
    overall_score: int
    breakdown: list[ScoreBreakdown]
    recommendations: list[str]
    estimated_ctr_range: str
    model_used: str


class CTRImproveRequest(BaseModel):
    headlines: list[str]
    descriptions: list[str]
    analysis: Optional[dict] = None
    focus_areas: Optional[list[str]] = []


@router.post("/analyze", response_model=CTRAnalysisResponse)
async def analyze_ctr(request: CTRAnalysisRequest):
    """
    Analyze CTR potential of Google Ads copy.
    Scores: headline strength, CTA quality, keyword relevance,
    emotional appeal, uniqueness, and urgency.
    """
    openai_key = os.getenv("OPENAI_API_KEY")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")

    if not openai_key and not anthropic_key:
        raise HTTPException(
            status_code=503,
            detail="No AI API keys configured."
        )

    # Scaffold stub — implement with actual AI analysis
    all_headlines = " ".join(request.headlines)
    all_desc = " ".join(request.descriptions)

    # Basic scoring heuristics (scaffold)
    has_numbers = any(any(c.isdigit() for c in h) for h in request.headlines)
    has_cta = any(w in all_headlines.lower() for w in ["try", "get", "start", "free", "now", "today"])
    has_question = any("?" in h for h in request.headlines)
    keyword_match = len(request.keywords) > 0 and any(
        k.lower() in all_headlines.lower() or k.lower() in all_desc.lower()
        for k in request.keywords
    )

    headline_score = 65 + (15 if has_numbers else 0) + (10 if has_question else 0)
    cta_score = 50 + (35 if has_cta else 0)
    keyword_score = 70 + (20 if keyword_match else 0)
    emotional_score = 55
    uniqueness_score = 60
    overall = int((headline_score + cta_score + keyword_score + emotional_score + uniqueness_score) / 5)

    def get_status(score: int) -> Literal["excellent", "good", "average", "needs-work"]:
        if score >= 85: return "excellent"
        if score >= 70: return "good"
        if score >= 50: return "average"
        return "needs-work"

    return CTRAnalysisResponse(
        overall_score=min(100, overall),
        breakdown=[
            ScoreBreakdown(name="Headline Strength", score=min(100, headline_score), status=get_status(headline_score), explanation="Based on specificity, numbers, and power words."),
            ScoreBreakdown(name="Call to Action", score=min(100, cta_score), status=get_status(cta_score), explanation="Clarity and urgency of your CTA."),
            ScoreBreakdown(name="Keyword Relevance", score=min(100, keyword_score), status=get_status(keyword_score), explanation="How well headlines match target keywords."),
            ScoreBreakdown(name="Emotional Appeal", score=emotional_score, status=get_status(emotional_score), explanation="Emotional triggers and pain-point relevance."),
            ScoreBreakdown(name="Uniqueness", score=uniqueness_score, status=get_status(uniqueness_score), explanation="Differentiation from common ad patterns."),
        ],
        recommendations=[
            "Add a specific number or stat to at least 2 headlines for +36% CTR",
            "Replace generic CTA with action-oriented: 'Start Free Trial', 'Get Instant Access'",
            "Include target keyword in first headline for relevance score boost",
            "Add social proof: '10,000+ customers' or '4.9/5 rated'",
            "Test urgency trigger: 'Limited Time', 'Today Only', 'This Week Only'",
        ],
        estimated_ctr_range="3.2% - 5.8%",
        model_used="heuristic-scaffold",
    )


@router.post("/improve")
async def improve_ctr(request: CTRImproveRequest):
    """Generate improved version of ad copy based on CTR analysis."""
    return {
        "message": "CTR improvement endpoint — implement with OpenAI/Anthropic",
        "improved_headlines": [],
        "improved_descriptions": [],
        "projected_ctr_increase": None,
    }
