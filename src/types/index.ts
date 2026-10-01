export type ClaimStatus =
  | 'SUPPORTED'
  | 'CONTRADICTED'
  | 'CONTEXT_MISSING'
  | 'OUTDATED'
  | 'INSUFFICIENT_EVIDENCE'
  | 'CONFLICTING_SOURCES'
  | 'UNDER_REVIEW';

export type ClaimType =
  | 'numeric_spec'
  | 'comparative'
  | 'superlative'
  | 'price'
  | 'warranty'
  | 'performance'
  | 'certification'
  | 'health_cosmetic'
  | 'disclosure';

export type SourceType =
  | 'OFFICIAL_BRAND'
  | 'RETAILER'
  | 'INDEPENDENT_LAB'
  | 'CONSUMER_OBSERVATION'
  | 'REGULATORY_POLICY'
  | 'PROVENANCE'
  | 'HISTORICAL_RECORD';

export interface FourQuestions {
  whatClaimed: string;
  whatEvidenceChecked: string;
  whatEvidenceSaid: string;
  whyStatusChosen: string;
}

export interface TravelOccurrence {
  platform: 'Instagram' | 'YouTube' | 'Amazon' | 'Flipkart' | 'TikTok' | 'Company Website' | 'Influencer Post' | 'Retail Banner' | 'Google Search Ad';
  adTitle: string;
  date: string;
  url: string;
  reachEstimate?: string;
  format: 'Image Ad' | 'Video Reel' | 'Product Listing' | 'Sponsored Post' | 'Search Ad';
}

export interface EvidenceSource {
  id: string;
  claimId: string;
  sourceType: SourceType;
  sourceName: string;
  publisher: string;
  observedValue: string;
  normalizedValue?: number | string;
  unit?: string;
  conditions: string;
  retrievedDate: string;
  citation: string;
  documentName?: string;
  relevantSection?: string;
  url?: string;
  hash?: string;
  reliability: 'Authoritative' | 'Independent Benchmark' | 'Market Observation' | 'Crowdsourced Signal' | 'Regulatory Standard' | 'Cryptographic Watermark';
  conflictFlag?: boolean;
}

export interface ConflictRecord {
  id?: string;
  sourceA: string;
  valueA: string;
  sourceB: string;
  valueB: string;
  nature: string;
  impactLevel: 'CRITICAL' | 'MODERATE' | 'INFORMATIONAL';
  missingCondition?: string;
  recommendedAction?: string;
}

export interface ClaimPassport {
  id: string; // e.g. CLM-82917
  productId: string;
  productName: string;
  brandName: string;
  attribute: string; // e.g. "battery_duration"
  advertisedWording: string;
  normalizedValue: number | string;
  unit: string;
  claimType: ClaimType;
  conditions: string[];
  status: ClaimStatus;
  statusExplanation: string;
  fourQuestions: FourQuestions;
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
  sources: EvidenceSource[];
  conflicts: ConflictRecord[];
  travelOccurrences: TravelOccurrence[];
  provenanceDetails?: {
    c2paDetected: boolean;
    synthIdDetected: boolean;
    aiModifiedVisual: boolean;
    tamperEvidentHash: string;
    details: string;
  };
  regulatoryNotes?: string[];
  brandDisputeResponse?: {
    author: string;
    date: string;
    responseContent: string;
    reviewedByPlatform: boolean;
  };
}

export interface Product {
  id: string;
  brandId: string;
  brandName: string;
  productName: string;
  modelNumber: string;
  gtin: string;
  category: string;
  verifiedByGS1: boolean;
  officialDocUrl: string;
  specSummary: string;
  claimsCount: number;
  activeConflicts: number;
  imageUrl: string;
}

export interface ConsumerObservation {
  id: string;
  claimId: string;
  productId: string;
  productName: string;
  userName: string;
  verifiedPurchase: boolean;
  observedValue: string;
  conditions: string;
  usageDuration: string;
  region: string;
  submissionDate: string;
  notes: string;
  proofAttached: boolean;
  moderationStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface BrandKnowledgeRule {
  id: string;
  brandId: string;
  title: string;
  type: 'APPROVED_CLAIM' | 'PROHIBITED_CLAIM' | 'MANDATORY_DISCLOSURE' | 'TONE_RULE';
  ruleText: string;
  affectedAttributes: string[];
  severity: 'BLOCKER' | 'WARNING' | 'RECOMMENDATION';
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'brand' | 'product' | 'ad' | 'claim' | 'official' | 'retailer' | 'lab' | 'consumer' | 'provenance' | 'policy';
  subLabel?: string;
  status?: ClaimStatus;
  val?: number;
  x?: number;
  y?: number;
  color?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  status?: 'normal' | 'conflict' | 'verified';
}

export interface VerificationJobStage {
  stageId: number;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'flagged';
  outputSnippet?: string;
}

export interface TimelineEvent {
  id: string;
  claimId: string;
  date: string;
  title: string;
  description: string;
  sourceType: SourceType | 'SYSTEM';
  eventType: 'CREATED' | 'OFFICIAL_ADDED' | 'RETAILER_CHANGE' | 'AD_PUBLISHED' | 'LAB_ADDED' | 'CONFLICT_DETECTED' | 'DISPUTE_ADDED' | 'CONSUMER_OBSERVATION';
  statusAfter?: ClaimStatus;
}

export interface SystemNotification {
  id: string;
  date: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  claimId?: string;
  read: boolean;
}

export interface VerificationProject {
  id: string;
  name: string;
  brandName: string;
  productCount: number;
  claimsCount: number;
  conflictsCount: number;
  status: 'ACTIVE' | 'AUDIT_COMPLETE' | 'NEEDS_REVIEW';
  lastActivity: string;
}
