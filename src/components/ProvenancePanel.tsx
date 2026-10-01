import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Binary, 
  Cpu, 
  AlertCircle, 
  ExternalLink, 
  FileCode, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import type { ClaimPassport } from '../types';

interface ProvenancePanelProps {
  claim: ClaimPassport;
}

export const ProvenancePanel: React.FC<ProvenancePanelProps> = ({ claim }) => {
  const prov = claim.provenanceDetails;

  return (
    <div className="provenance-panel-card glass-panel">
      <div className="provenance-header">
        <div className="prov-title-wrap">
          <div className="prov-icon-badge">
            <Binary size={20} color="#3D5AFE" />
          </div>
          <div>
            <h3 className="card-title">Media Provenance & AI Transparency (C2PA)</h3>
            <p className="card-subtitle">
              Section 11: Cryptographic provenance & disclosure without false accusations
            </p>
          </div>
        </div>

        <div className="c2pa-badge-wrap">
          {prov?.c2paDetected ? (
            <span className="c2pa-status-tag c2pa-valid">
              <ShieldCheck size={14} /> C2PA Credentials Verified
            </span>
          ) : (
            <span className="c2pa-status-tag c2pa-missing">
              <AlertCircle size={14} /> C2PA Manifest Not Present
            </span>
          )}
        </div>
      </div>

      {/* Provenance Metadata Grid */}
      <div className="prov-meta-grid">
        <div className="prov-meta-card">
          <div className="prov-card-label">Digital Watermark</div>
          <div className="prov-card-val">
            {prov?.synthIdDetected ? (
              <span className="signal-detected text-cyan">
                <Sparkles size={14} /> Google SynthID Detected
              </span>
            ) : (
              <span className="signal-none text-muted">No imperceptible watermark signal</span>
            )}
          </div>
          <div className="prov-card-caption">Detects statistical imperceptible watermarks in media pixels.</div>
        </div>

        <div className="prov-meta-card">
          <div className="prov-card-label">Asset Generation Mode</div>
          <div className="prov-card-val">
            {prov?.aiModifiedVisual ? (
              <span className="signal-detected text-amber">
                <Cpu size={14} /> Hybrid AI-Assisted Creative
              </span>
            ) : (
              <span className="signal-none text-green">
                <CheckCircle2 size={14} /> Camera Sensor Raw Footage
              </span>
            )}
          </div>
          <div className="prov-card-caption">Classifies whether background/audio contains synthetic elements.</div>
        </div>

        <div className="prov-meta-card">
          <div className="prov-card-label">Tamper-Evident Hash</div>
          <div className="prov-card-val mono text-cyan">
            {prov?.tamperEvidentHash || 'SHA256: e81b99a...'}
          </div>
          <div className="prov-card-caption">Cryptographic signature anchoring creative to verification log.</div>
        </div>
      </div>

      {/* Explanatory summary and IAB disclosure note */}
      <div className="prov-narrative-box">
        <div className="prov-narrative-header">
          <Info size={16} color="#3D5AFE" />
          <span>Material Impact & Policy Assessment:</span>
        </div>
        <p className="prov-narrative-text">
          {prov?.details || 'Standard ad creative inspection complete. No cryptographic anomalies detected in original payload.'}
        </p>
        <div className="prov-principle-quote">
          <em>Rule 8 Boundary: “Absence of provenance is not treated as proof of fabrication; AI-generated content is not synonymous with misleading content.”</em>
        </div>
      </div>
    </div>
  );
};
