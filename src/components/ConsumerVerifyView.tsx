import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  CheckCircle2, 
  FileSearch, 
  UploadCloud, 
  Eye, 
  MessageSquarePlus, 
  Sparkles, 
  Calendar, 
  HelpCircle, 
  Tag, 
  FileText,
  BadgeAlert,
  Building,
  Scale
} from 'lucide-react';
import type { ClaimPassport, Product } from '../types';
import { ConflictInspector } from './ConflictInspector';
import { ProvenancePanel } from './ProvenancePanel';

interface ConsumerVerifyViewProps {
  currentClaim: ClaimPassport;
  product: Product;
  onOpenReportModal: () => void;
  onSelectClaim: (claimId: string) => void;
}

export const ConsumerVerifyView: React.FC<ConsumerVerifyViewProps> = ({
  currentClaim,
  product,
  onOpenReportModal,
  onSelectClaim,
}) => {
  const [selectedAdSpan, setSelectedAdSpan] = useState<string | null>(currentClaim.attribute);

  return (
    <div className="consumer-verify-container">
      {/* Hero Header with Product and Status Badge */}
      <div className="ad-verified-hero glass-panel">
        <div className="hero-top-row">
          <div className="hero-product-info">
            <span className="product-category-tag">{product.category}</span>
            <h1 className="hero-product-title">{product.productName}</h1>
            <div className="hero-identity-badges">
              <span className="badge-meta">Brand: <strong>{product.brandName}</strong></span>
              <span className="badge-meta">Model: <strong>{product.modelNumber}</strong></span>
              <span className="badge-meta mono">GTIN: <strong>{product.gtin}</strong></span>
              {product.verifiedByGS1 && (
                <span className="badge-gs1">
                  <CheckCircle2 size={13} color="#3D5AFE" /> Verified by GS1
                </span>
              )}
            </div>
          </div>

          <div className="hero-status-box">
            <div className="status-label-caption">Overall Claim Verification Status:</div>
            <div className={`status-badge-lg ${currentClaim.status}`}>
              {currentClaim.status.replace('_', ' ')}
            </div>
            <div className="status-confidence">
              Freshness: <span className="text-cyan">Current (Updated Today)</span>
            </div>
          </div>
        </div>

        {/* Claim Wording Banner */}
        <div className="claim-wording-strip">
          <div className="strip-left">
            <span className="wording-tag">AUDITED AD CLAIM:</span>
            <span className="wording-quote">“{currentClaim.advertisedWording}”</span>
          </div>
          <div className="strip-right">
            <span className="mono-id">ID: {currentClaim.id}</span>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={onOpenReportModal}
            >
              <MessageSquarePlus size={14} />
              <span>Contribute Observation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="verify-main-grid">
        {/* Left Column: Ad Creative Preview & OCR Spans */}
        <div className="verify-col-left">
          {/* Ad Ingestion & Visual OCR Inspector */}
          <div className="ad-visual-card glass-panel">
            <div className="card-header-clean">
              <div className="header-icon-label">
                <Eye size={18} color="#3D5AFE" />
                <span className="title-bold">Ad Creative & OCR Span Normalization</span>
              </div>
              <span className="badge-meta">Asset: Video/Still Frame</span>
            </div>

            <div className="ad-image-mockup-wrapper">
              <img 
                src={product.imageUrl} 
                alt={product.productName} 
                className="ad-preview-image" 
              />
              
              {/* Highlighted OCR Bounding Boxes */}
              <div 
                className="ocr-bounding-box ocr-claim-highlight"
                style={{ top: '22%', left: '12%', width: '76%', height: '24%' }}
                onClick={() => setSelectedAdSpan('claim')}
                title="Extracted Atomic Claim: Battery / Spec Assertion"
              >
                <span className="ocr-pill">EXTRACTED CLAIM #1</span>
                <span className="ocr-text-extracted">“{currentClaim.advertisedWording}”</span>
              </div>

              <div 
                className="ocr-bounding-box ocr-logo-highlight"
                style={{ top: '68%', left: '15%', width: '38%', height: '18%' }}
                onClick={() => setSelectedAdSpan('brand')}
                title="Product Identity Match"
              >
                <span className="ocr-pill">PRODUCT IDENTITY</span>
                <span className="ocr-text-extracted">{product.productName}</span>
              </div>
            </div>

            <div className="ocr-details-footer">
              <div className="footer-metric">
                <span className="foot-lbl">Normalization Engine:</span>
                <span className="foot-val">Gemini Multimodal Document API + OCR</span>
              </div>
              <div className="footer-metric">
                <span className="foot-lbl">Tamper Hash:</span>
                <span className="foot-val mono">sha256-4b82...c09</span>
              </div>
            </div>
          </div>

          {/* Section 10: The 4 Essential Questions Explainable Report */}
          <div className="four-questions-card glass-panel">
            <div className="card-header-clean">
              <div className="header-icon-label">
                <HelpCircle size={18} color="#3D5AFE" />
                <span className="title-bold">Explainable Verification Report</span>
              </div>
              <span className="tag-explain">Section 10 Standard</span>
            </div>
            
            <p className="explain-intro">
              A result should never be an unexplainable single score. It must transparently answer four core questions:
            </p>

            <div className="questions-list">
              <div className="question-item">
                <div className="question-q">1. What did the advertisement claim?</div>
                <div className="question-a">{currentClaim.fourQuestions.whatClaimed}</div>
              </div>

              <div className="question-item">
                <div className="question-q">2. What evidence was checked?</div>
                <div className="question-a">{currentClaim.fourQuestions.whatEvidenceChecked}</div>
              </div>

              <div className="question-item">
                <div className="question-q">3. What did the evidence say?</div>
                <div className="question-a">{currentClaim.fourQuestions.whatEvidenceSaid}</div>
              </div>

              <div className="question-item highlight-why">
                <div className="question-q">4. Why did the system choose this status?</div>
                <div className="question-a-bold">{currentClaim.fourQuestions.whyStatusChosen}</div>
              </div>
            </div>
          </div>

          {/* Evidence Coverage Matrix (Section 10) */}
          <div className="coverage-matrix-card glass-panel">
            <div className="card-header-clean">
              <div className="header-icon-label">
                <ShieldCheck size={18} color="#3D5AFE" />
                <span className="title-bold">Evidence Coverage Matrix</span>
              </div>
              <span className="tag-coverage">Coverage: 5/6 Verified</span>
            </div>

            <div className="coverage-table">
              <div className="cov-row">
                <span className="cov-check-name">Product Identity Resolution</span>
                <span className={`cov-status ${currentClaim.evidenceCoverage.productIdentity ? 'ok' : 'missing'}`}>
                  {currentClaim.evidenceCoverage.productIdentity ? '✓ Verified (GS1)' : '? Unconfirmed'}
                </span>
              </div>
              <div className="cov-row">
                <span className="cov-check-name">Official Manufacturer Specification</span>
                <span className={`cov-status ${currentClaim.evidenceCoverage.officialSpec ? 'ok' : 'missing'}`}>
                  {currentClaim.evidenceCoverage.officialSpec ? '✓ Found & Hash-Anchored' : 'Not Found'}
                </span>
              </div>
              <div className="cov-row">
                <span className="cov-check-name">Current Retailer Price / Market Observation</span>
                <span className={`cov-status ${currentClaim.evidenceCoverage.currentPrice ? 'ok' : 'missing'}`}>
                  {currentClaim.evidenceCoverage.currentPrice ? '✓ Live Observation' : 'No Data'}
                </span>
              </div>
              <div className="cov-row">
                <span className="cov-check-name">Independent Lab / Benchmark Measurement</span>
                <span className={`cov-status ${currentClaim.evidenceCoverage.independentLab ? 'ok' : 'missing'}`}>
                  {currentClaim.evidenceCoverage.independentLab ? '✓ Standardized Test Found' : 'Not Available'}
                </span>
              </div>
              <div className="cov-row">
                <span className="cov-check-name">Structured Consumer Real-World Observations</span>
                <span className={`cov-status ${currentClaim.evidenceCoverage.consumerReports ? 'ok' : 'missing'}`}>
                  {currentClaim.evidenceCoverage.consumerReports ? '✓ Aggregated Cluster' : 'Insufficient Samples'}
                </span>
              </div>
              <div className="cov-row">
                <span className="cov-check-name">C2PA / Media Content Credentials</span>
                <span className={`cov-status ${currentClaim.evidenceCoverage.c2paProvenance ? 'ok' : 'missing'}`}>
                  {currentClaim.evidenceCoverage.c2paProvenance ? '✓ Manifest Inspected' : 'Missing / Unsigned'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Conflict Inspector, Evidence Sources, Provenance & Dispute */}
        <div className="verify-col-right">
          {/* Cross-Source Conflict Detector */}
          <ConflictInspector claim={currentClaim} />

          {/* Provenance & C2PA Inspector */}
          <ProvenancePanel claim={currentClaim} />

          {/* Multi-Source Evidence Dossier */}
          <div className="evidence-dossier-card glass-panel">
            <div className="card-header-clean">
              <div className="header-icon-label">
                <FileText size={18} color="#3D5AFE" />
                <span className="title-bold">Multi-Source Evidence Hierarchy</span>
              </div>
              <span className="badge-meta">Section 7 Source Weighting</span>
            </div>

            <div className="sources-list">
              {currentClaim.sources.map((src) => (
                <div key={src.id} className="source-record-card">
                  <div className="src-card-top">
                    <div className="src-title-group">
                      <span className={`src-pill ${src.sourceType.toLowerCase()}`}>
                        {src.sourceType.replace('_', ' ')}
                      </span>
                      <span className="src-name">{src.sourceName}</span>
                    </div>
                    <span className="src-reliability">{src.reliability}</span>
                  </div>

                  <div className="src-value-row">
                    <span className="src-val-label">Observed Data:</span>
                    <span className="src-val-text">{src.observedValue}</span>
                  </div>

                  <div className="src-conditions-row">
                    <span className="src-cond-label">Test Conditions / Context:</span>
                    <span className="src-cond-text">{src.conditions}</span>
                  </div>

                  <div className="src-meta-footer">
                    <span className="src-citation">Citation: {src.citation}</span>
                    <span className="src-date">Checked: {src.retrievedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: Brand Response & Dispute Layer */}
          {currentClaim.brandDisputeResponse && (
            <div className="brand-dispute-card glass-panel">
              <div className="card-header-clean">
                <div className="header-icon-label">
                  <Building size={18} color="#3D5AFE" />
                  <span className="title-bold">Section 8: Brand Response & Dispute Layer</span>
                </div>
                <span className="badge-reviewed">Verified Platform Response</span>
              </div>

              <div className="dispute-body">
                <div className="dispute-author-row">
                  <span className="author-name">{currentClaim.brandDisputeResponse.author}</span>
                  <span className="dispute-date">
                    {new Date(currentClaim.brandDisputeResponse.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="dispute-text">
                  {currentClaim.brandDisputeResponse.responseContent}
                </p>
                <div className="dispute-footer-note">
                  <em>Principle: “Brands can respond to evidence without deleting conflicting evidence. Full transparency preserved.”</em>
                </div>
              </div>
            </div>
          )}

          {/* Where Claim Appears Across Ad Ecosystem (Section 9) */}
          <div className="claim-travel-card glass-panel">
            <div className="card-header-clean">
              <div className="header-icon-label">
                <Sparkles size={18} color="#FF2FA3" />
                <span className="title-bold">Claim Travel & Ad Ecosystem Occurrences</span>
              </div>
              <span className="badge-meta">{currentClaim.travelOccurrences.length} Linked Appearances</span>
            </div>

            <p className="travel-subtitle">
              Section 9: <em>“Don’t verify the ad once. Verify the claim wherever it travels.”</em>
            </p>

            <div className="travel-grid">
              {currentClaim.travelOccurrences.map((occ, idx) => (
                <div key={idx} className="travel-item">
                  <div className="travel-platform">
                    <span className="platform-tag">{occ.platform}</span>
                    <span className="travel-format">{occ.format}</span>
                  </div>
                  <div className="travel-title">{occ.adTitle}</div>
                  <div className="travel-meta">
                    <span>{occ.date}</span>
                    {occ.reachEstimate && <span>• {occ.reachEstimate}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
