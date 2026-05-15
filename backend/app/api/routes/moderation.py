from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal
import os

router = APIRouter()


class ModerationRequest(BaseModel):
    headlines: list[str]
    descriptions: list[str]
    industry: Optional[str] = "General"
    target_country: Optional[str] = "US"


class FlaggedItem(BaseModel):
    type: str
    severity: Literal["high", "medium", "low"]
    item: str
    explanation: str
    suggestion: str


class ModerationResponse(BaseModel):
    overall_risk_score: int
    risk_level: Literal["LOW", "MEDIUM", "HIGH"]
    flagged_items: list[FlaggedItem]
    safe_items: list[str]
    auto_fix_available: bool
    model_used: str


@router.post("/check", response_model=ModerationResponse)
async def check_moderation(request: ModerationRequest):
    """
    Analyze ad copy for Google Ads policy violations.
    Uses AI to detect: superlatives, trademarks, excessive punctuation,
    prohibited content, misleading claims, and editorial issues.
    """
    openai_key = os.getenv("OPENAI_API_KEY")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")

    if not openai_key and not anthropic_key:
        raise HTTPException(
            status_code=503,
            detail="No AI API keys configured."
        )

    # Scaffold stub — implement with actual AI moderation logic
    all_text = request.headlines + request.descriptions
    flagged = []
    safe = []

    # Basic rule-based checks (scaffold)
    superlatives = ["best", "top", "#1", "world's best", "greatest", "most"]
    excessive_punct = ["!!!", "???", "!!!"]

    for item in all_text:
        item_lower = item.lower()
        is_flagged = False

        for sup in superlatives:
            if sup in item_lower:
                flagged.append(FlaggedItem(
                    type="Superlative Language",
                    severity="medium",
                    item=item,
                    explanation=f"Absolute claim '{sup}' requires substantiation per Google policy.",
                    suggestion=f"Replace with qualified claim: 'Rated Top 10' or 'Award-Winning'",
                ))
                is_flagged = True
                break

        for punct in excessive_punct:
            if punct in item:
                flagged.append(FlaggedItem(
                    type="Excessive Punctuation",
                    severity="low",
                    item=item,
                    explanation="Multiple repeated punctuation marks violate editorial guidelines.",
                    suggestion="Use single punctuation marks or remove them.",
                ))
                is_flagged = True
                break

        if not is_flagged:
            safe.append(item)

    risk_score = min(100, len(flagged) * 25)
    risk_level = "HIGH" if risk_score >= 70 else "MEDIUM" if risk_score >= 35 else "LOW"

    return ModerationResponse(
        overall_risk_score=risk_score,
        risk_level=risk_level,
        flagged_items=flagged,
        safe_items=safe,
        auto_fix_available=len(flagged) > 0,
        model_used="rule-based-scaffold",
    )


@router.post("/fix")
async def auto_fix_violations(
    flagged_items: list[dict],
    context: Optional[str] = None,
):
    """Auto-fix policy violations using AI."""
    return {
        "message": "Auto-fix endpoint — implement with OpenAI/Anthropic",
        "fixed_items": [],
    }
