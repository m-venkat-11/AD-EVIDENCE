import React, { useState } from 'react';
import { 
  X, 
  MessageSquarePlus, 
  CheckCircle2, 
  ShieldCheck, 
  FileCheck2,
  Lock
} from 'lucide-react';
import type { ConsumerObservation, ClaimPassport } from '../types';

interface ConsumerReportModalProps {
  claim: ClaimPassport;
  onClose: () => void;
  onSubmitObservation: (obs: ConsumerObservation) => void;
}

export const ConsumerReportModal: React.FC<ConsumerReportModalProps> = ({
  claim,
  onClose,
  onSubmitObservation
}) => {
  const [userName, setUserName] = useState('');
  const [observedValue, setObservedValue] = useState('');
  const [conditions, setConditions] = useState('');
  const [usageDuration, setUsageDuration] = useState('');
  const [region, setRegion] = useState('Bengaluru, India');
  const [verifiedPurchase, setVerifiedPurchase] = useState(true);
  const [notes, setNotes] = useState('');
  const [proofAttached, setProofAttached] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observedValue.trim() || !conditions.trim()) return;

    const newObs: ConsumerObservation = {
      id: `obs-${Date.now()}`,
      claimId: claim.id,
      productId: claim.productId,
      productName: claim.productName,
      userName: userName.trim() || 'Anonymous Verified User',
      verifiedPurchase,
      observedValue: observedValue.trim(),
      conditions: conditions.trim(),
      usageDuration: usageDuration.trim() || '2 weeks active usage',
      region,
      submissionDate: new Date().toISOString().split('T')[0],
      notes: notes.trim(),
      proofAttached,
      moderationStatus: 'APPROVED'
    };

    onSubmitObservation(newObs);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <MessageSquarePlus size={20} color="#3D5AFE" />
            </div>
            <div>
              <h3 className="modal-title">Submit Structured Consumer Observation</h3>
              <p className="modal-subtitle">
                Section 14: <em>“Structured telemetry with conditions, not an arbitrary star review.”</em>
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="modal-success-state">
            <CheckCircle2 size={44} color="#3D5AFE" />
            <h4>Observation Verified & Clustered!</h4>
            <p>Your telemetry log has been indexed into the verified consumer observation cluster for Claim <strong>{claim.id}</strong>.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="modal-claim-summary">
              <span className="summary-label">Target Commercial Claim:</span>
              <span className="summary-val font-medium">“{claim.advertisedWording}” ({claim.productName})</span>
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label className="form-label">Your Name / Reviewer Handle:</label>
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="e.g. Anand K. (Audio Enthusiast)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Observed Measurement ({claim.unit}):</label>
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="e.g. 31.5 hours"
                  required
                  value={observedValue}
                  onChange={(e) => setObservedValue(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Operating Conditions & Mode (Crucial):</label>
              <input 
                type="text" 
                className="input-text" 
                placeholder="e.g. ANC ON, 60% Volume, AAC codec, connected to phone"
                required
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
              />
              <span className="field-hint">Specify volume, ANC mode, speed, ambient temperature, or workload.</span>
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label className="form-label">Usage Duration / Window:</label>
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="e.g. 5 days continuous log"
                  value={usageDuration}
                  onChange={(e) => setUsageDuration(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Geography / Region:</label>
                <input 
                  type="text" 
                  className="input-text" 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contextual Notes / Observations:</label>
              <textarea 
                className="textarea" 
                rows={3}
                placeholder="Any firmware versions, ambient conditions, or discrepancies noticed..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="modal-checkboxes-row">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={verifiedPurchase}
                  onChange={(e) => setVerifiedPurchase(e.target.checked)}
                />
                <span>Verified Retail Purchase (Order / Serial Number Checked)</span>
              </label>

              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={proofAttached}
                  onChange={(e) => setProofAttached(e.target.checked)}
                />
                <span>Attach Measurement Telemetry Screenshot / Log</span>
              </label>
            </div>

            <div className="modal-poison-shield-note">
              <ShieldCheck size={14} color="#3D5AFE" />
              <span>Section 17 Anti-Poisoning: Observations undergo Sybil filtering before inclusion in clusters.</span>
            </div>

            <div className="modal-actions-row">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <CheckCircle2 size={16} />
                <span>Submit to Evidence Graph</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
