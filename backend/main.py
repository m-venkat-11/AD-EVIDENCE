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

from ai_engine import run_full_verification_pipeline, extract_claims_from_ad, call_gemini_with_retry

load_dotenv()

app = FastAPI(
    title="AD-EVIDENCE API",
    description="The Evidence Layer for AI-Era Advertising",
    version="2.4.0"
)

# CORS — allow the Vite dev server and all local origins
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
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
    Analyze an ad/product from a URL.
    Strategy:
      1. Try to fetch and read the page content directly via httpx
      2. If that fails (Flipkart/Amazon block scraping), use Gemini with
         Google Search grounding to look up the product info
      3. Run the extracted text through the full verification pipeline
    """
    body = await request.json()
    url = body.get("url", "").strip()
    product_hint = body.get("productHint", "").strip()

    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    # Extract meaningful product name from URL slug if not provided (e.g. Flipkart, Amazon)
    if not product_hint and url:
        try:
            import urllib.parse
            parsed_url = urllib.parse.urlparse(url)
            segments = [s for s in parsed_url.path.split('/') if s and s not in ('p', 'dp', 'gp', 'product', 'item', 'buy')]
            if segments:
                candidate = segments[0].replace('-', ' ').replace('_', ' ').strip()
                if len(candidate) > 3 and not candidate.isdigit():
                    product_hint = candidate.title()
                    print(f"[URL] Extracted product hint from URL: {product_hint}")
        except Exception:
            pass

    try:
        import httpx
        from google.genai import types

        extracted_text = None

        # ----- STEP 1: Try direct page fetch with httpx -----
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
            }
            async with httpx.AsyncClient(timeout=httpx.Timeout(6.0, connect=3.0), follow_redirects=True, verify=False) as http_client:
                resp = await http_client.get(url, headers=headers)
                if resp.status_code == 200 and len(resp.text) > 200:
                    # Strip HTML to plain text (rough extraction)
                    import re
                    page_text = resp.text
                    # Remove script/style blocks
                    page_text = re.sub(r'<script[^>]*>.*?</script>', ' ', page_text, flags=re.DOTALL | re.IGNORECASE)
                    page_text = re.sub(r'<style[^>]*>.*?</style>', ' ', page_text, flags=re.DOTALL | re.IGNORECASE)
                    # Remove tags
                    page_text = re.sub(r'<[^>]+>', ' ', page_text)
                    # Collapse whitespace
                    page_text = re.sub(r'\s+', ' ', page_text).strip()

                    if len(page_text) > 100:
                        # Use Gemini to extract claims from the scraped page text
                        snippet = page_text[:8000]  # Cap to avoid token limits
                        extract_response = await call_gemini_with_retry(
                            prompt=f"""You are analyzing a product listing page. Extract the product name, brand, and ALL commercial claims (specifications, prices, performance numbers, warranties, certifications, superlatives).

URL: {url}
Product hint: {product_hint or 'Not specified'}

PAGE CONTENT:
{snippet}

List the product name and brand first, then every specific claim made on this page.""",
                            temperature=0.1,
                            max_tokens=4096
                        )
                        extracted_text = extract_response.text
                        print(f"[URL] Direct page fetch succeeded for {url[:60]}...")
                else:
                    print(f"[URL] Direct fetch returned HTTP {resp.status_code} for {url[:60]}, falling back to search grounding...")
        except Exception as fetch_err:
            print(f"[URL] Direct page fetch failed ({str(fetch_err)[:80]}), falling back to search grounding...")

        # ----- STEP 2: If direct fetch failed, use Gemini with Google Search -----
        if not extracted_text:
            try:
                search_response = await call_gemini_with_retry(
                    prompt=f"""Look up this product URL and extract ALL commercial claims from it: {url}

Product hint: {product_hint or 'Not specified'}

Search for this product online and provide:
1. The exact product name and brand
2. Every specific commercial claim: prices, specifications, performance numbers, battery capacity, camera megapixels, processor, RAM, storage, display size, weight, warranties, certifications, superlatives like "best" or "fastest"
3. Any conditions or fine print attached to claims

Be thorough — extract EVERY verifiable number and marketing assertion.""",
                    temperature=0.1,
                    max_tokens=4096,
                    tools=[types.Tool(google_search=types.GoogleSearch())]
                )
                extracted_text = search_response.text
                print(f"[URL] Search grounding succeeded for {url[:60]}...")
            except Exception as search_err:
                print(f"[URL] Search grounding also failed ({str(search_err)[:80]}), using LLM knowledge...")

        # ----- STEP 3: Final fallback — pure LLM knowledge synthesis -----
        if not extracted_text:
            knowledge_response = await call_gemini_with_retry(
                prompt=f"""Based on your training knowledge, analyze this product URL: {url}

Product hint: {product_hint or 'Not specified'}

Provide:
1. The product name and brand (identify from the URL pattern)
2. All known specifications, prices, and commercial claims for this product
3. Any known issues or controversies about the product's advertised claims

Note: I could not fetch the page directly. Use your knowledge to provide the most accurate information available.""",
                temperature=0.2,
                max_tokens=4096
            )
            extracted_text = knowledge_response.text
            print(f"[URL] LLM knowledge fallback used for {url[:60]}...")

        # ----- STEP 4: Run through full verification pipeline -----
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

    except HTTPException:
        raise
    except Exception as e:
        print(f"[URL ERROR] {str(e)[:200]}")
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
