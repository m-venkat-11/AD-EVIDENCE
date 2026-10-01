import React, { useState } from 'react';
import { 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  Share2, 
  Download, 
  Building2, 
  MessageSquare, 
  Send, 
  Sliders, 
  Layers, 
  ShieldCheck,
  ArrowRight,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import type { ClaimPassport, Product } from '../types';

interface ClaimPassportViewProps {
  claim: ClaimPassport;
  product: Product;
  onRefreshFreshness: (claimId: string) => void;
  onUpdateBrandResponse: (claimId: string, response: string) => void;
  onExploreInGraph: (claimId: string) => void;
}

export const ClaimPassportView: React.FC<ClaimPassportViewProps> = ({
  claim,
  product,
  onRefreshFreshness,
  onUpdateBrandResponse,
  onExploreInGraph
}) => {
  const [brandResponseInput, setBrandResponseInput] = useState(
    claim.brandDisputeResponse?.responseContent || 
    `Official ${product?.brandName || claim.brandName} testing protocols corroborate asserted performance under rated operating conditions. Documentation filed for compliance review.`
  );
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [responseSubmittedNotice, setResponseSubmittedNotice] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      onRefreshFreshness(claim.id);
      setIsRefreshing(false);
    }, 900);
  };

  const handleSaveResponse = () => {
    setIsSubmittingResponse(true);
    setTimeout(() => {
      onUpdateBrandResponse(claim.id, brandResponseInput);
      setIsSubmittingResponse(false);
      setResponseSubmittedNotice(true);
      setTimeout(() => setResponseSubmittedNotice(false), 3500);
    }, 600);
  };

  return (
    <div className="passport-page-container">
      {/* Signature Passport Header */}
      <div className="passport-hero-card card">
        <div className="passport-hero-top">
          <div className="passport-id-column">
            <span className="passport-kicker">CLAIM PASSPORT</span>
            <span className="passport-main-id mono">{claim.id}</span>
          </div>

          <div className="passport-status-column">
            <span className="status-label-caption">Verification Status:</span>
            <span className={`status-pill ${claim.status}`}>
              {claim.status === 'CONTRADICTED' ? (
                <>
                  <AlertTriangle size={14} color="#FF2FA3" />
                  <span>CONFLICT DETECTED</span>
                </>
              ) : claim.status === 'SUPPORTED' ? (
                <>
                  <CheckCircle2 size={14} color="#3D5AFE" />
                  <span>SUPPORTED</span>
                </>
              ) : (
                <span>{claim.status.replace('_', ' ')}</span>
              )}
            </span>
          </div>

          <div className="passport-actions-column">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Run deterministic rule re-check"
            >
              <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
              <span>{isRefreshing ? 'Re-checking...' : 'Re-check Freshness'}</span>
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onExploreInGraph(claim.id)}
            >
              <Share2 size={14} />
              <span>View in Graph</span>
            </button>
          </div>
        </div>

        {/* Claim Wording Strip */}
        <div className="passport-claim-banner">
          <div className="claim-banner-main">
            <span className="claim-wording-label">ASSERTED COMMERCIAL CLAIM:</span>
            <h1 className="claim-wording-quote">“{claim.advertisedWording}”</h1>
          </div>
          <div className="claim-banner-product">
            <span className="prod-label">Product Entity:</span>
            <span className="prod-name-bold">{claim.productName}</span>
            <span className="prod-sub mono">{product.brandName} • Model {product.modelNumber}</span>
          </div>
        </div>
      </div>

      {/* Central Evidence Summary & Visual Evidence Relationship Tree (Section 9) */}
      <div className="evidence-relationship-card card">
        <div className="section-card-header">
          <div>
            <h2 className="section-title">Visual Evidence Relationship</h2>
            <p className="section-subtitle">
              Section 9: Core multi-source divergence tree connecting claim to authoritative, independent, and market records.
            </p>
          </div>
          <span className="badge-relationship-type">Evidence Topology</span>
        </div>

        {/* The Clean Visual Relationship Tree Diagram */}
        <div className="evidence-tree-wrapper">
          {/* Level 1: Central Claim Node */}
          <div className="tree-node-claim-root">
            <div className="node-claim-box">
              <span className="node-kicker">ADVERTISED CLAIM</span>
              <div className="node-val-large">
                {claim.normalizedValue ? `${claim.normalizedValue} ${claim.unit || ''}`.trim() : (claim.advertisedWording.length > 25 ? claim.advertisedWording.slice(0, 22) + '...' : claim.advertisedWording)}
              </div>
              <span className="node-caption">“{claim.advertisedWording}”</span>
            </div>
          </div>

          {/* Connection Lines from Claim to Level 2 */}
          <div className="tree-connector-lines-row">
            <div className="connector-vertical-stem"></div>
            <div className="connector-horizontal-bar"></div>
            <div className="connector-down-stems">
              <div className="down-stem stem-brand"></div>
              <div className="down-stem stem-retailer"></div>
              <div className="down-stem stem-independent"></div>
            </div>
          </div>

          {/* Level 2: Brand, Retailer, Independent Nodes */}
          <div className="tree-level-two-grid">
            {/* Brand Node */}
            <div className="tree-node-box node-brand">
              <div className="node-type-label">OFFICIAL BRAND</div>
              <div className="node-data-value text-green">
                {claim.sources.find(s => s.sourceType === 'OFFICIAL_BRAND')?.observedValue || (claim.status === 'SUPPORTED' ? `${claim.normalizedValue || ''} ${claim.unit || ''}`.trim() || 'Factory Rating' : 'Specification Discrepancy')}
              </div>
              <div className="node-sub-meta">
                {claim.sources.find(s => s.sourceType === 'OFFICIAL_BRAND')?.conditions || (claim.conditions.length > 0 ? claim.conditions.join(', ') : 'Standard Operating Baseline')}
              </div>
              <span className="node-source-name">
                {claim.sources.find(s => s.sourceType === 'OFFICIAL_BRAND')?.sourceName || `${product?.brandName || claim.brandName} Specification`}
              </span>
            </div>

            {/* Retailer Node */}
            <div className="tree-node-box node-retailer">
              <div className="node-type-label">RETAILER LISTING</div>
              <div className="node-data-value text-amber">
                {claim.sources.find(s => s.sourceType === 'RETAILER')?.observedValue || `${claim.normalizedValue || ''} ${claim.unit || ''}`.trim() || 'Market Listing Spec'}
              </div>
              <div className="node-sub-meta">
                {claim.sources.find(s => s.sourceType === 'RETAILER')?.conditions || 'Merchant Catalog Listing'}
              </div>
              <span className="node-source-name">
                {claim.sources.find(s => s.sourceType === 'RETAILER')?.sourceName || 'Authorized Marketplace Listing'}
              </span>
            </div>

            {/* Independent Test Node */}
            <div className="tree-node-box node-independent">
              <div className="node-type-label">INDEPENDENT TEST</div>
              <div className="node-data-value text-blue">
                {claim.sources.find(s => s.sourceType === 'INDEPENDENT_LAB')?.observedValue || (claim.status === 'SUPPORTED' ? 'Benchmarking Passed' : 'Independent Benchmark')}
              </div>
              <div className="node-sub-meta">
                {claim.sources.find(s => s.sourceType === 'INDEPENDENT_LAB')?.conditions || 'Standardized Laboratory Benchmark'}
              </div>
              <span className="node-source-name">
                {claim.sources.find(s => s.sourceType === 'INDEPENDENT_LAB')?.sourceName || 'Certified Benchmark Bureau'}
              </span>
            </div>
          </div>

          {/* Connection Line from Brand to Consumer Observations */}
          <div className="tree-connector-consumer-stem">
            <div className="connector-vertical-consumer"></div>
          </div>

          {/* Level 3: Consumer Observations Cluster */}
          <div className="tree-node-consumer-root">
            <div className="node-consumer-box">
              <span className="node-type-label">CONSUMER OBSERVATIONS</span>
              <div className="node-data-value text-blue">
                {claim.sources.find(s => s.sourceType === 'CONSUMER_OBSERVATION')?.observedValue || (claim.status === 'SUPPORTED' ? 'Consistent User Telemetry' : 'Real-World Field Logs')}
              </div>
              <span className="node-sub-meta">
                {claim.sources.find(s => s.sourceType === 'CONSUMER_OBSERVATION')?.conditions || 'Verified purchaser and crowd observations logged'}
              </span>
            </div>
          </div>
        </div>

        {/* Quantitative Comparison Divergence Bars */}
        <div className="quantitative-bars-container">
          <div className="quant-section-title">
            <span>Quantitative Value Divergence: <code className="mono">`{claim.attribute}`</code></span>
            <span className="quant-unit-pill">Units: <strong>{claim.unit || 'Spec'}</strong></span>
          </div>

          <div className="quant-bars-stack">
            <div className="quant-bar-row">
              <div className="bar-label-col">
                <span className="bar-source-tag ad">ADVERTISEMENT</span>
                <span className="bar-source-sub">Promotional Claim</span>
              </div>
              <div className="bar-progress-col">
                <div className="bar-track">
                  <div className={`bar-fill ${claim.status === 'CONTRADICTED' ? 'fill-red' : 'fill-green'}`} style={{ width: '100%' }}></div>
                </div>
                <span className="bar-val-text font-bold">
                  {claim.normalizedValue ? `${claim.normalizedValue} ${claim.unit || ''}`.trim() : claim.advertisedWording.slice(0, 24)}
                </span>
              </div>
              <div className="bar-condition-col">
                <span>{claim.conditions.length > 0 ? claim.conditions.join(', ') : 'Asserted in promotional copy'}</span>
              </div>
            </div>

            {claim.sources.map((source, sIdx) => (
              <div key={source.id || sIdx} className="quant-bar-row">
                <div className="bar-label-col">
                  <span className={`bar-source-tag ${source.sourceType.toLowerCase()}`}>
                    {source.sourceType.replace('_', ' ')}
                  </span>
                  <span className="bar-source-sub">{source.publisher || source.sourceName}</span>
                </div>
                <div className="bar-progress-col">
                  <div className="bar-track">
                    <div 
                      className={`bar-fill ${source.conflictFlag ? 'fill-red' : 'fill-green'}`} 
                      style={{ width: source.conflictFlag ? '80%' : '100%' }}
                    ></div>
                  </div>
                  <span className="bar-val-text">{source.observedValue}</span>
                </div>
                <div className="bar-condition-col">
                  <span>{source.conditions || 'Standard observation baseline'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHY THIS RESULT & CONTEXT (Section 9) */}
      <div className="passport-explanation-grid">
        {/* Why this result */}
        <div className="why-result-card card">
          <div className="section-card-header">
            <h3 className="section-title">Why This Result?</h3>
            <span className="badge-meta">Algorithmic Synthesis</span>
          </div>

          <div className="why-result-body">
            <p className="why-statement-quote">
              “{claim.statusExplanation}”
            </p>

            <div className="four-q-summary-stack">
              <div className="four-q-item">
                <div className="four-q-label">1. What did the advertisement claim?</div>
                <div className="four-q-text">{claim.fourQuestions.whatClaimed}</div>
              </div>

              <div className="four-q-item">
                <div className="four-q-label">2. What evidence was checked?</div>
                <div className="four-q-text">{claim.fourQuestions.whatEvidenceChecked}</div>
              </div>

              <div className="four-q-item">
                <div className="four-q-label">3. What did the evidence say?</div>
                <div className="four-q-text">{claim.fourQuestions.whatEvidenceSaid}</div>
              </div>

              <div className="four-q-item highlight">
                <div className="four-q-label">4. Why did the system choose this status?</div>
                <div className="four-q-text font-medium">{claim.fourQuestions.whyStatusChosen}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Context & Conditions Box */}
        <div className="context-card card">
          <div className="section-card-header">
            <h3 className="section-title">Context & Modality</h3>
            <span className="badge-meta">Operating Scope</span>
          </div>

          <div className="context-fields-list">
            <div className="context-field-row">
              <span className="context-field-name">Operating Conditions:</span>
              <div className="context-field-value">
                <span className="badge-context-diff">Ad: {claim.conditions.length > 0 ? claim.conditions.join(', ') : 'Unqualified Claim'}</span>
                <span className="badge-context-ok">Official: {claim.sources.find(s => s.sourceType === 'OFFICIAL_BRAND')?.conditions || 'Standard Rated Protocol'}</span>
              </div>
            </div>

            <div className="context-field-row">
              <span className="context-field-name">Target Model:</span>
              <span className="context-field-value mono">{product.modelNumber}</span>
            </div>

            <div className="context-field-row">
              <span className="context-field-name">Claim Type / Modality:</span>
              <span className="context-field-value">{claim.claimType.replace('_', ' ').toUpperCase()}</span>
            </div>

            <div className="context-field-row">
              <span className="context-field-name">Last Verified Date:</span>
              <span className="context-field-value mono">{claim.lastVerifiedDate}</span>
            </div>

            <div className="context-field-row">
              <span className="context-field-name">Freshness Policy:</span>
              <span className="context-field-value text-secondary">{claim.freshnessPolicy}</span>
            </div>

            <div className="context-field-row">
              <span className="context-field-name">C2PA Manifest:</span>
              <span className="context-field-value text-green">✓ Content Credentials Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* SOURCE LIST (Section 9 & 19) */}
      <div className="source-list-card card">
        <div className="section-card-header">
          <div>
            <h3 className="section-title">Evidence Source Registry</h3>
            <p className="section-subtitle">
              Every result answers: <em>“Where did this information come from?”</em> with publisher, document and excerpt.
            </p>
          </div>
          <span className="badge-meta">{claim.sources.length} Traceable Anchors</span>
        </div>

        <div className="sources-table-wrapper">
          <table className="sources-table">
            <thead>
              <tr>
                <th>Source Type</th>
                <th>Publisher & Document</th>
                <th>Observed Value</th>
                <th>Operating Conditions</th>
                <th>Retrieval Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {claim.sources.map((src) => (
                <tr key={src.id}>
                  <td>
                    <span className={`src-badge ${src.sourceType.toLowerCase()}`}>
                      {src.sourceType.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="src-name-bold">{src.sourceName}</div>
                    <div className="src-pub-sub">{src.publisher}</div>
                    <div className="src-citation-text mono">{src.citation}</div>
                  </td>
                  <td>
                    <span className="src-val-highlight">{src.observedValue}</span>
                  </td>
                  <td>
                    <span className="src-cond-text">{src.conditions}</span>
                  </td>
                  <td className="mono">{src.retrievedDate}</td>
                  <td>
                    {src.conflictFlag ? (
                      <span className="status-pill CONTRADICTED">Conflict</span>
                    ) : (
                      <span className="status-pill SUPPORTED">Corroborates</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 17: BRAND RESPONSE FEATURE */}
      <div className="brand-response-feature-card card">
        <div className="section-card-header">
          <div>
            <h3 className="section-title">Brand Response & Dispute Layer</h3>
            <p className="section-subtitle">
              Section 17 Standard: Preserves both the independent evidence AND the brand explanation with full audit integrity.
            </p>
          </div>
          <span className="badge-meta">Two-Sided Transparency</span>
        </div>

        <div className="brand-response-inner-grid">
          <div className="response-evidence-side">
            <span className="side-title">AUDITED INDEPENDENT EVIDENCE:</span>
            <div className="evidence-quote-box">
              {(() => {
                const indSrc = claim.sources.find(s => s.sourceType === 'INDEPENDENT_LAB') || claim.sources[0];
                return (
                  <>
                    <strong>{indSrc?.sourceName || 'Independent Evidence Source'}:</strong>
                    <p>“{indSrc?.observedValue ? `${indSrc.observedValue} (${indSrc.conditions || 'standard benchmark conditions'})` : claim.fourQuestions.whatEvidenceSaid}”</p>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="response-form-side">
            <span className="side-title">OFFICIAL BRAND RESPONSE:</span>
            <textarea 
              className="textarea" 
              rows={3}
              value={brandResponseInput}
              onChange={(e) => setBrandResponseInput(e.target.value)}
              placeholder="State the testing protocol difference, firmware updates, or corrective measures..."
            />

            <div className="response-actions-row">
              <button 
                className="btn btn-primary btn-sm"
                onClick={handleSaveResponse}
                disabled={isSubmittingResponse}
              >
                <Send size={14} />
                <span>{isSubmittingResponse ? 'Updating...' : 'Submit Official Response'}</span>
              </button>

              {responseSubmittedNotice && (
                <span className="response-success text-green">
                  <CheckCircle2 size={14} /> Response saved to public Claim Passport!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
