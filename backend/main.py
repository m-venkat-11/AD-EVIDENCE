"""
AD-EVIDENCE Backend API Server
FastAPI server that bridges the React frontend with the Gemini AI engine.
Using plain dicts instead of Pydantic models for Python 3.14 compatibility.
"""

import os
import base64
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from ai_engine import run_full_verification_pipeline, extract_claims_from_ad

load_dotenv()

app = FastAPI(
    title="AD-EVIDENCE API",
    description="The Evidence Layer for AI-Era Advertising",
    version="2.4.0"
)

# CORS — allow the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# API Endpoints
# ============================================================

@app.get("/api/health")
async def health_check():
    """Check if the backend and AI are working"""
    return {
        "status": "operational",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "aiProvider": "Gemini 2.0 Flash",
        "version": "2.4.0"
    }


@app.post("/api/analyze/text")
async def analyze_text(request: Request):
    """
    Analyze ad text through the full 10-step verification pipeline.
    This is the main endpoint — takes ad text, returns verified claims.
    """
    body = await request.json()
    ad_text = body.get("adText", "")
    product_hint = body.get("productHint", "")

    if not ad_text or len(ad_text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Ad text must be at least 10 characters")

    try:
        result = await run_full_verification_pipeline(
            ad_text=ad_text,
            product_hint=product_hint
        )

        return {
            "success": True,
            "pipelineId": result.get("pipelineId", ""),
            "timestamp": result.get("timestamp", ""),
            "product": result.get("product", {}),
            "claims": result.get("claims", []),
            "contentAnalysis": result.get("contentAnalysis", {}),
            "stages": result.get("stages", []),
            "overallRisk": result.get("overallRisk", "UNKNOWN"),
            "contentFingerprint": result.get("contentFingerprint", ""),
            "error": result.get("error")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/api/analyze/image")
async def analyze_image(
    file: UploadFile = File(...),
    productHint: str = Form("")
):
    """
    Analyze an uploaded ad image through the verification pipeline.
    Reads the image and sends it to Gemini for multimodal analysis.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (JPEG, PNG, WebP)")

    try:
        contents = await file.read()

        # For image analysis, we first use Gemini to extract text from the image
        from google.genai import types
        from ai_engine import call_gemini_with_retry

        # Step 1: Extract text and claims from image using Gemini Vision with retry/fallback
        response = await call_gemini_with_retry(
            prompt="",
            contents=[
                types.Part.from_bytes(data=contents, mime_type=file.content_type),
                "Extract ALL text visible in this advertisement image. Then identify the product being advertised and list every commercial claim made (prices, specifications, performance numbers, warranties, certifications, superlatives). Return the complete extracted text first, then list each claim separately."
            ],
            temperature=0.1,
            max_tokens=4096
        )

        extracted_text = response.text

        # Step 2: Run the full pipeline on the extracted text
        result = await run_full_verification_pipeline(
            ad_text=extracted_text,
            product_hint=productHint
        )

        return {
            "success": True,
            "pipelineId": result.get("pipelineId", ""),
            "timestamp": result.get("timestamp", ""),
            "product": result.get("product", {}),
            "claims": result.get("claims", []),
            "contentAnalysis": result.get("contentAnalysis", {}),
            "stages": result.get("stages", []),
            "overallRisk": result.get("overallRisk", "UNKNOWN"),
            "contentFingerprint": result.get("contentFingerprint", ""),
            "extractedText": extracted_text,
            "inputType": "image",
            "originalFilename": file.filename,
            "error": result.get("error")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")


@app.post("/api/analyze/url")
async def analyze_url(request: Request):
    """
    Analyze an ad from a URL — uses Gemini search grounding to read the page.
    """
    body = await request.json()
    url = body.get("url", "")
    product_hint = body.get("productHint", "")

    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=f"Analyze this advertisement URL and extract all commercial claims: {url}. List the product name, brand, and every specific claim (numbers, prices, specs, warranties, performance figures).",
            config=types.GenerateContentConfig(
                temperature=0.1,
                max_output_tokens=4096,
                tools=[types.Tool(google_search=types.GoogleSearch())],
            )
        )

        extracted_text = response.text

        result = await run_full_verification_pipeline(
            ad_text=extracted_text,
            product_hint=product_hint
        )

        return {
            "success": True,
            "pipelineId": result.get("pipelineId", ""),
            "timestamp": result.get("timestamp", ""),
            "product": result.get("product", {}),
            "claims": result.get("claims", []),
            "contentAnalysis": result.get("contentAnalysis", {}),
            "stages": result.get("stages", []),
            "overallRisk": result.get("overallRisk", "UNKNOWN"),
            "contentFingerprint": result.get("contentFingerprint", ""),
            "sourceUrl": url,
            "error": result.get("error")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL analysis failed: {str(e)}")


@app.post("/api/claims/extract-only")
async def extract_claims_only(request: Request):
    """
    Quick extraction — just extract claims without full evidence research.
    Faster, uses less API quota.
    """
    body = await request.json()
    ad_text = body.get("adText", "")
    product_hint = body.get("productHint", "")

    try:
        result = await extract_claims_from_ad(ad_text, product_hint)
        return {"success": True, "extraction": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# Run with: python main.py
# ============================================================
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"\n[AD-EVIDENCE] Backend starting on http://localhost:{port}")
    print(f"[API DOCS] http://localhost:{port}/docs")
    print(f"[AI] Provider: Gemini 2.0 Flash\n")
    uvicorn.run(app, host="0.0.0.0", port=port)
