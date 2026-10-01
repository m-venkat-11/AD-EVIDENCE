/**
 * AD-EVIDENCE API Service
 * Connects the React frontend to the Python FastAPI backend.
 * All AI processing happens on the backend — the frontend just sends data and displays results.
 */

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface AnalysisResult {
  success: boolean;
  pipelineId: string;
  timestamp: string;
  product: {
    name: string;
    brand: string;
    category: string;
    modelNumber: string | null;
    identifiedConfidence: string;
  };
  claims: Array<{
    id: string;
    productId: string;
    productName: string;
    brandName: string;
    attribute: string;
    advertisedWording: string;
    normalizedValue: number | string;
    unit: string;
    claimType: string;
    conditions: string[];
    status: string;
    statusExplanation: string;
    fourQuestions: {
      whatClaimed: string;
      whatEvidenceChecked: string;
      whatEvidenceSaid: string;
      whyStatusChosen: string;
    };
    firstSeenDate: string;
    lastVerifiedDate: string;
    freshnessPolicy: string;
    evidenceCoverage: {
      productIdentity: boolean;
      officialSpec: boolean;
      currentPrice: boolean;
      independentLab: boolean;
      consumerReports: boolean;
      c2paProvenance: boolean;
    };
    sources: Array<{
      id: string;
      claimId: string;
      sourceType: string;
      sourceName: string;
      publisher: string;
      observedValue: string;
      conditions: string;
      retrievedDate: string;
      citation: string;
      url: string;
      reliability: string;
      conflictFlag: boolean;
    }>;
    conflicts: Array<{
      sourceA: string;
      valueA: string;
      sourceB: string;
      valueB: string;
      nature: string;
      impactLevel: string;
      missingCondition: string;
      recommendedAction: string;
    }>;
    travelOccurrences: any[];
    provenanceDetails: {
      c2paDetected: boolean;
      synthIdDetected: boolean;
      aiModifiedVisual: boolean;
      tamperEvidentHash: string;
      details: string;
    };
    regulatoryNotes: string[];
    riskLevel: string;
    missingContext: string;
    verificationApproach: string;
  }>;
  contentAnalysis: {
    appearsAiGenerated: boolean;
    aiGenerationSignals: string[];
    disclosurePresent: boolean;
    disclosureText: string | null;
    overallRiskAssessment: string;
  };
  stages: Array<{
    stage: number;
    name: string;
    status: string;
    detail: string;
  }>;
  overallRisk: string;
  contentFingerprint: string;
  error?: string;
}

/**
 * Check if the backend server is running and healthy
 */
export async function checkBackendHealth(): Promise<{
  status: string;
  aiProvider: string;
  version: string;
} | null> {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Analyze ad text through the full 10-step verification pipeline
 */
export async function analyzeAdText(
  adText: string,
  productHint: string = ''
): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE}/analyze/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adText, productHint }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network error' }));
    throw new Error(error.detail || `Server error: ${response.status}`);
  }

  return response.json();
}

/**
 * Analyze an uploaded ad image (screenshot, poster, etc.)
 */
export async function analyzeAdImage(
  file: File,
  productHint: string = ''
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('productHint', productHint);

  const response = await fetch(`${API_BASE}/analyze/image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network error' }));
    throw new Error(error.detail || `Server error: ${response.status}`);
  }

  return response.json();
}

/**
 * Analyze an ad from a URL
 */
export async function analyzeAdUrl(
  url: string,
  productHint: string = ''
): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE}/analyze/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, productHint }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network error' }));
    throw new Error(error.detail || `Server error: ${response.status}`);
  }

  return response.json();
}

/**
 * Quick claim extraction without full evidence research (faster, less API usage)
 */
export async function extractClaimsOnly(
  adText: string,
  productHint: string = ''
): Promise<any> {
  const response = await fetch(`${API_BASE}/claims/extract-only`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adText, productHint }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network error' }));
    throw new Error(error.detail || `Server error: ${response.status}`);
  }

  return response.json();
}
