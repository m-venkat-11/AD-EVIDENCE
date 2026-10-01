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
  const [adQuery, setAdQuery] = useState('https://instagram.com/p/C9xL2094Kz');
  const [submittedObservationNotice, setSubmittedObservationNotice] = useState(false);

  // Quick form state for consumer observation
  const [obsHours, setObsHours] = useState('28 hours');
  const [obsCondition, setObsCondition] = useState('ANC ON, High volume (80%)');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obsHours) return;

    const newObs: ConsumerObservation = {
      id: `obs-${Date.now()}`,
      claimId: claim.id,
      productId: claim.productId,
      productName: claim.productName,
      userName: 'Verified Consumer',
      verifiedPurchase: true,
      observedValue: obsHours,
      conditions: obsCondition,
      usageDuration: '2 weeks active commute',
      region: 'Bengaluru, India',
      submissionDate: new Date().toISOString().split('T')[0],
      notes: 'Logged continuous playback on mobile commute.',
      proofAttached: false,
      moderationStatus: 'APPROVED'
    };

    onSubmitObservation(newObs);
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
          Enter an advertisement link or search a commercial claim to inspect the verified facts behind it.
        </p>

        {/* Large Clean Search / Upload Input (Section 13) */}
        <div className="consumer-search-box card">
          <div className="consumer-input-row">
            <Search size={20} color="#AEB6C2" />
            <input 
              type="text" 
              className="consumer-main-input" 
              placeholder="Paste advertisement link, product URL, or claim text..." 
              value={adQuery}
              onChange={(e) => setAdQuery(e.target.value)}
            />
            <button className="btn btn-primary">
              <span>Check Claim</span>
            </button>
          </div>

          <div className="consumer-search-presets">
            <span className="preset-lbl">Try checking:</span>
            <button 
              className="preset-btn"
              onClick={() => setAdQuery('Guaranteed 50-hour battery life on a single charge')}
            >
              "50-hour battery life"
            </button>
            <button 
              className="preset-btn"
              onClick={() => setAdQuery('DermaPure Serum: 100% wrinkle elimination in 7 days')}
            >
              "100% wrinkle elimination"
            </button>
            <button 
              className="preset-btn"
              onClick={() => setAdQuery('VoltDrive S-100: Starting at ₹44,999')}
            >
              "₹44,999 scooter price"
            </button>
          </div>
        </div>
      </div>

      {/* Main Consumer Claim Check Card (Section 13) */}
      <div className="consumer-result-card card">
        <div className="consumer-result-header">
          <div className="check-kicker">CLAIM CHECK RESULT</div>
          <div className="consumer-status-strip">
            <span className={`status-pill ${claim.status}`}>
              <AlertTriangle size={15} color="#FF2FA3" />
              <span>{claim.status === 'CONTRADICTED' ? 'CONFLICT DETECTED' : claim.status}</span>
            </span>
          </div>
        </div>

        <div className="consumer-claim-quote-box">
          <span className="quote-lbl">What the ad claims:</span>
          <h2 className="consumer-claim-heading">“{claim.advertisedWording}”</h2>
          <span className="consumer-prod-sub">{claim.productName}</span>
        </div>

        {/* Simple Plain-English Explanation */}
        <div className="consumer-explanation-box">
          <div className="explanation-title">Evidence Breakdown:</div>
          <p className="explanation-text-large">
            The advertisement says <strong>50 hours</strong>. The current official manufacturer specification says <strong>up to 40 hours</strong>. Independent lab tests measured <strong>38.4 hours</strong> under standard conditions.
          </p>
        </div>

        {/* SEE THE EVIDENCE SECTION (Section 13) */}
        <div className="see-evidence-section">
          <h3 className="see-evidence-title">SEE THE EVIDENCE</h3>

          <div className="evidence-simple-grid">
            {/* Source 1: Official */}
            <div className="evidence-simple-card">
              <div className="simple-card-top">
                <span className="card-source-tag text-green">OFFICIAL BRAND SPECIFICATION</span>
                <span className="card-source-val">40 hours</span>
              </div>
              <p className="simple-card-snippet">
                Manufacturer user manual (page 18) states "Up to 40 hours with ANC turned OFF (30 hours with ANC ON)".
              </p>
              <div className="simple-card-citation mono">User Manual WH-950PRO</div>
            </div>

            {/* Source 2: Independent Lab */}
            <div className="evidence-simple-card">
              <div className="simple-card-top">
                <span className="card-source-tag text-purple">INDEPENDENT LAB TEST</span>
                <span className="card-source-val">38.4 hours</span>
              </div>
              <p className="simple-card-snippet">
                AcousticLab continuous playback benchmark at standard 75dB volume output with ANC disabled.
              </p>
              <div className="simple-card-citation mono">AcousticLab Report #TAL-2026</div>
            </div>

            {/* Source 3: Retailer */}
            <div className="evidence-simple-card">
              <div className="simple-card-top">
                <span className="card-source-tag text-amber">RETAILER LISTING</span>
                <span className="card-source-val">40 hours</span>
              </div>
              <p className="simple-card-snippet">
                Amazon marketplace listing reflects the official 40-hour specification without the inflated 50h claim.
              </p>
              <div className="simple-card-citation mono">Amazon ASIN B0C8XYZ950</div>
            </div>

            {/* Source 4: Consumer Observations */}
            <div className="evidence-simple-card">
              <div className="simple-card-top">
                <span className="card-source-tag text-blue">CONSUMER OBSERVATIONS</span>
                <span className="card-source-val">27–42 hours</span>
              </div>
              <p className="simple-card-snippet">
                Aggregated real-world logs from 127 verified purchasers under varying volume levels and commute modes.
              </p>
              <div className="simple-card-citation mono">127 Verified User Logs</div>
            </div>
          </div>
        </div>
      </div>

      {/* CONSUMER OBSERVATION FEATURE (Section 14) */}
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
              <input type="text" className="input-text" disabled value={claim ? `${claim.attribute || 'Commercial Claim'} (${claim.productName || 'Verified Product'})` : 'Claim under review'} />
            </div>

            <div className="obs-field-col">
              <label className="obs-label">Observed runtime / value:</label>
              <input 
                type="text" 
                className="input-text" 
                placeholder="e.g. 28 hours" 
                value={obsHours}
                onChange={(e) => setObsHours(e.target.value)}
              />
            </div>

            <div className="obs-field-col">
              <label className="obs-label">Usage conditions:</label>
              <input 
                type="text" 
                className="input-text" 
                placeholder="e.g. ANC ON, High volume"
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
    </div>
  );
};
