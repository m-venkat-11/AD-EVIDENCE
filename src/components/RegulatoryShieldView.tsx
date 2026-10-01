import React from 'react';
import { 
  Scale, 
  ShieldCheck, 
  Lock, 
  FileWarning, 
  CheckCircle2, 
  AlertOctagon, 
  EyeOff, 
  Terminal, 
  FileCode,
  Flame,
  Fingerprint
} from 'lucide-react';

export const RegulatoryShieldView: React.FC = () => {
  return (
    <div className="regulatory-shield-container">
      {/* Title Panel */}
      <div className="shield-header-panel glass-panel">
        <div className="header-left">
          <div className="icon-badge-rose">
            <Scale size={24} color="#FF2FA3" />
          </div>
          <div>
            <h2 className="panel-title">Regulatory Frameworks & Anti-Poisoning Shield</h2>
            <p className="panel-subtitle">
              Section 11, 12.C & 17: Jurisdiction rulesets, IAB AI Transparency V2, and multi-tenant evidence integrity.
            </p>
          </div>
        </div>

        <div className="active-framework-pills">
          <span className="fw-pill fw-india">India DCA / CCPA 2022</span>
          <span className="fw-pill fw-iab">IAB AI Transparency V2</span>
          <span className="fw-pill fw-c2pa">C2PA Standardized</span>
        </div>
      </div>

      {/* Grid of Regulatory Rulesets */}
      <div className="regulatory-cards-grid grid-2">
        {/* Card 1: India CCPA / DCA Guidelines 2022 */}
        <div className="reg-card glass-panel">
          <div className="card-header-clean">
            <div className="reg-title-wrap">
              <span className="reg-flag">🇮🇳</span>
              <div>
                <div className="title-bold">Department of Consumer Affairs (DCA) 2022</div>
                <div className="card-subtitle">Guidelines for Prevention of Misleading Advertisements</div>
              </div>
            </div>
            <span className="badge-meta">Statutory Rule</span>
          </div>

          <div className="reg-rules-list">
            <div className="reg-rule-item">
              <div className="reg-rule-code">Rule 4(1)(c) - Omission of Material Conditions</div>
              <div className="reg-rule-desc">
                An advertisement is misleading if it conceals conditions under which a claim holds true.
              </div>
              <div className="reg-rule-enforcement">
                <strong>System Enforcement:</strong> Advertising "50-hour battery" without disclosing "with ANC disabled at 50% volume" triggers automatic `CONTEXT_MISSING` and policy violation warning.
              </div>
            </div>

            <div className="reg-rule-item">
              <div className="reg-rule-code">Section 5 - Absolute Guarantees & Superlatives</div>
              <div className="reg-rule-desc">
                Unsubstantiated claims claiming "100% cure", "instant elimination", or absolute guarantees without certified scientific evidence are prohibited.
              </div>
              <div className="reg-rule-enforcement">
                <strong>System Enforcement:</strong> Triggers deterministic flag on terms like "Guaranteed 100%" or "Instant" in cosmetic and consumer electronics copy.
              </div>
            </div>

            <div className="reg-rule-item">
              <div className="reg-rule-code">Price Transparency & Freshness</div>
              <div className="reg-rule-desc">
                Prices advertised to Indian consumers must reflect current valid ex-showroom/on-road retail prices and clearly date introductory promotional windows.
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: IAB AI Transparency & Disclosure V2 */}
        <div className="reg-card glass-panel">
          <div className="card-header-clean">
            <div className="reg-title-wrap">
              <span className="reg-flag">🌐</span>
              <div>
                <div className="title-bold">IAB AI Transparency & Disclosure V2</div>
                <div className="card-subtitle">Global Advertising Framework (August 2026)</div>
              </div>
            </div>
            <span className="badge-meta">Industry Standard</span>
          </div>

          <div className="reg-rules-list">
            <div className="reg-rule-item">
              <div className="reg-rule-code">Materiality-Driven AI Labeling</div>
              <div className="reg-rule-desc">
                Distinguishes between harmless creative assistance (e.g. background stylization) versus deceptive claims (e.g. synthetic before-and-after skin smoothing).
              </div>
              <div className="reg-rule-enforcement">
                <strong>System Enforcement:</strong> Does not label an ad "misleading" simply because SynthID or C2PA detected synthetic pixels. Flags only if AI generates unsupported product claims.
              </div>
            </div>

            <div className="reg-rule-item">
              <div className="reg-rule-code">Claim Strengthening Detection</div>
              <div className="reg-rule-desc">
                Automated detection of LLM-generated copy expanding an approved engineering claim into an exaggerated marketing claim.
              </div>
              <div className="reg-rule-enforcement">
                <strong>System Enforcement:</strong> Compares semantic embeddings and numeric bounds between internal spec sheet and outward-facing creative variants.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 17: Evidence-Poisoning & Adversarial Defenses */}
      <div className="defense-architecture-card glass-panel">
        <div className="card-header-clean">
          <div className="header-icon-label">
            <ShieldCheck size={20} color="#3D5AFE" />
            <span className="title-bold">Section 17: Security, Privacy & Evidence-Poisoning Defenses</span>
          </div>
          <span className="badge-meta text-green">Multi-Layer Active Defense</span>
        </div>

        <div className="defenses-grid grid-3">
          {/* Defense 1 */}
          <div className="defense-item-box">
            <div className="def-icon-row">
              <Terminal size={18} color="#3D5AFE" />
              <span className="def-name">Untrusted Web Ingestion Shield</span>
            </div>
            <p className="def-desc">
              Webpages and competitor reviews retrieved during automated evidence collection are strictly treated as <strong>data payloads, not instructions</strong>.
            </p>
            <div className="def-pill-tag">Prompt Injection Proof</div>
          </div>

          {/* Defense 2 */}
          <div className="defense-item-box">
            <div className="def-icon-row">
              <Lock size={18} color="#3D5AFE" />
              <span className="def-name">Tenant Isolation Vault</span>
            </div>
            <p className="def-desc">
              Brand-private documents (unreleased engineering whitepapers, internal stress tests) are locked to tenant boundaries and never published to the public graph without permission.
            </p>
            <div className="def-pill-tag">Zero Cross-Tenant Leakage</div>
          </div>

          {/* Defense 3 */}
          <div className="defense-item-box">
            <div className="def-icon-row">
              <Fingerprint size={18} color="#FF2FA3" />
              <span className="def-name">Cryptographic Hash Anchoring</span>
            </div>
            <p className="def-desc">
              Every retrieved document, user manual page, and lab report receives a SHA-256 fingerprint. Sources can introduce observations, but cannot overwrite historical truth.
            </p>
            <div className="def-pill-tag">Tamper-Evident Graph</div>
          </div>

          {/* Defense 4 */}
          <div className="defense-item-box">
            <div className="def-icon-row">
              <AlertOctagon size={18} color="#FF8A1E" />
              <span className="def-name">Crowdsource Sybil Filter</span>
            </div>
            <p className="def-desc">
              Consumer reports require verified purchase invoices or serial number checks to prevent malicious competitor review bombing or astroturfing.
            </p>
            <div className="def-pill-tag">Anti-Astroturf Moderation</div>
          </div>

          {/* Defense 5 */}
          <div className="defense-item-box">
            <div className="def-icon-row">
              <EyeOff size={18} color="#3D5AFE" />
              <span className="def-name">Conflict Transparency Principle</span>
            </div>
            <p className="def-desc">
              Conflicting sources are permanently retained as discrete competing vertices in the graph. The system never averages away genuine disagreement.
            </p>
            <div className="def-pill-tag">Preserves Contradictions</div>
          </div>

          {/* Defense 6 */}
          <div className="defense-item-box">
            <div className="def-icon-row">
              <Scale size={18} color="#FF2FA3" />
              <span className="def-name">Human Escalation Gate</span>
            </div>
            <p className="def-desc">
              Legal, health, and cosmetic safety claims exceeding critical risk thresholds automatically trigger mandatory human reviewer approval queues.
            </p>
            <div className="def-pill-tag">Human-in-the-Loop</div>
          </div>
        </div>
      </div>
    </div>
  );
};
