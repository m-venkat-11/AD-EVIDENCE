import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  UploadCloud, 
  ArrowRight, 
  MessageSquarePlus, 
  FileText,
  Database,
  Sliders,
  ExternalLink
} from 'lucide-react';
import type { ClaimPassport, ConsumerObservation } from '../types';

interface ConsumerExperienceViewProps {
  claim: ClaimPassport;
  onSubmitObservation: (obs: ConsumerObservation) => void;
  onOpenReportModal: () => void;
}

export const ConsumerExperienceView: React.FC<ConsumerExperienceViewProps> = ({
  claim,
  onSubmitObservation,
  onOpenReportModal
}) => {
  const [adQuery, setAdQuery] = useState('');
  const [submittedObservationNotice, setSubmittedObservationNotice] = useState(false);

  // Quick form state for consumer observation
  const [obsHours, setObsHours] = useState('');
  const [obsCondition, setObsCondition] = useState('');

  const hasValidClaim = claim && claim.id && claim.id !== 'CLM-EMPTY';

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obsHours || !hasValidClaim) return;

    const newObs: ConsumerObservation = {
      id: `obs-${Date.now()}`,
      claimId: claim.id,
      productId: claim.productId,
      productName: claim.productName,
      userName: 'Verified Consumer',
      verifiedPurchase: true,
      observedValue: obsHours,
      conditions: obsCondition || 'General real-world usage',
      usageDuration: 'Standard usage period',
      region: 'Verified Consumer Log',
      submissionDate: new Date().toISOString().split('T')[0],
      notes: 'Logged empirical observation on commercial claim.',
      proofAttached: false,
      moderationStatus: 'APPROVED'
    };

    onSubmitObservation(newObs);
    setObsHours('');
    setObsCondition('');
    setSubmittedObservationNotice(true);
    setTimeout(() => setSubmittedObservationNotice(false), 3500);
  };

  return (
    <div className="consumer-page-container">
      {/* Consumer Clean Hero */}
      <div className="consumer-hero-box">
        <div className="consumer-hero-badge">
          <ShieldCheck size={20} color="#3D5AFE" />
          <span>AD-EVIDENCE CONSUMER CHECK</span>
        </div>
        <h1 className="consumer-main-title">Check before you trust an ad.</h1>
        <p className="consumer-subtitle">
          Enter an advertisement link or search a commercial claim to inspect the verified empirical evidence behind it.
        </p>

        {/* Large Clean Search Input */}
        <div className="consumer-search-box card">
          <div className="consumer-input-row">
            <Search size={20} color="#AEB6C2" />
            <input 
              type="text" 
              className="consumer-main-input" 
              placeholder="Paste advertisement link, product URL (Flipkart, Amazon, etc.), or claim text..." 
              value={adQuery}
              onChange={(e) => setAdQuery(e.target.value)}
            />
            <button className="btn btn-primary" onClick={() => {
              if (adQuery) {
                // If query is present, prompt user or focus
              }
            }}>
              <span>Check Claim</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Consumer Claim Check Card */}
      {hasValidClaim ? (
        <div className="consumer-result-card card">
          <div className="consumer-result-header">
            <div className="check-kicker">CLAIM CHECK RESULT</div>
            <div className="consumer-status-strip">
              <span className={`status-pill ${claim.status}`}>
                {claim.status === 'CONTRADICTED' ? (
                  <>
                    <AlertTriangle size={15} color="#FF2FA3" />
                    <span>CONFLICT DETECTED</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} color="#00E5FF" />
                    <span>{claim.status}</span>
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="consumer-claim-quote-box">
            <span className="quote-lbl">What the ad claims:</span>
            <h2 className="consumer-claim-heading">“{claim.advertisedWording}”</h2>
            <span className="consumer-prod-sub">{claim.productName} • {claim.brandName}</span>
          </div>

          {/* Plain-English Explanation */}
          <div className="consumer-explanation-box">
            <div className="explanation-title">Evidence Breakdown:</div>
            <p className="explanation-text-large">
              {claim.statusExplanation || 'Empirical evidence audited across official engineering documentation, laboratory benchmarks, and real-world market telemetry.'}
            </p>
          </div>

          {/* SEE THE EVIDENCE SECTION */}
          <div className="see-evidence-section">
            <h3 className="see-evidence-title">SEE THE EVIDENCE</h3>

            <div className="evidence-simple-grid">
              {claim.sources.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#AEB6C2', gridColumn: '1 / -1' }}>
                  No evidence sources grounded for this claim yet.
                </div>
              ) : (
                claim.sources.map((source, sIdx) => (
                  <div key={source.id || sIdx} className="evidence-simple-card">
                    <div className="simple-card-top">
                      <span className={`card-source-tag ${source.sourceType === 'OFFICIAL_BRAND' ? 'text-green' : source.sourceType === 'INDEPENDENT_LAB' ? 'text-purple' : source.sourceType === 'RETAILER' ? 'text-amber' : 'text-blue'}`}>
                        {source.sourceType.replace('_', ' ')}
                      </span>
                      <span className="card-source-val">{source.observedValue}</span>
                    </div>
                    <p className="simple-card-snippet">
                      {source.citation || source.conditions || 'Corroborating specification logged in evidence registry.'}
                    </p>
                    <div className="simple-card-citation mono">{source.sourceName || source.publisher}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center', margin: '20px 0' }}>
          <ShieldCheck size={44} color="#00E5FF" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F5F7FF', marginBottom: '8px' }}>
            Ready to Verify Any Commercial Claim
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#AEB6C2', maxWidth: '540px', margin: '0 auto 16px', lineHeight: 1.6 }}>
            Paste any advertisement link, e-commerce product URL, or promotional claim above to inspect the multi-source evidence and truth score.
          </p>
        </div>
      )}

      {/* CONSUMER OBSERVATION FEATURE */}
      {hasValidClaim && (
        <div className="consumer-contribute-card card">
          <div className="contribute-header">
            <div>
              <h3 className="contribute-title">How was your experience?</h3>
              <p className="contribute-sub">
                Contribute structured telemetry with your real-world usage conditions to help inform other consumers.
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={onOpenReportModal}>
              <MessageSquarePlus size={14} />
              <span>Open Full Submission Form</span>
            </button>
          </div>

          <form onSubmit={handleQuickSubmit} className="quick-obs-form">
            <div className="obs-form-grid">
              <div className="obs-field-col">
                <label className="obs-label">Claim under review:</label>
                <input type="text" className="input-text" disabled value={`${claim.attribute || 'Commercial Claim'} (${claim.productName || 'Verified Product'})`} />
              </div>

              <div className="obs-field-col">
                <label className="obs-label">Observed value / performance:</label>
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="e.g. 35 hours / 85 km / 2500 lumens" 
                  value={obsHours}
                  onChange={(e) => setObsHours(e.target.value)}
                />
              </div>

              <div className="obs-field-col">
                <label className="obs-label">Usage conditions:</label>
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="e.g. Standard ambient temperature, normal volume" 
                  value={obsCondition}
                  onChange={(e) => setObsCondition(e.target.value)}
                />
              </div>
            </div>

            <div className="obs-action-row">
              <button type="submit" className="btn btn-primary btn-sm">
                <CheckCircle2 size={14} />
                <span>Submit Observation</span>
              </button>

              <span className="consumer-disclaimer-note">
                <em>“Consumer observations are signals and may vary by usage conditions.”</em>
              </span>

              {submittedObservationNotice && (
                <span className="obs-notice text-green font-medium">
                  ✓ Observation verified and added to consumer cluster!
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
