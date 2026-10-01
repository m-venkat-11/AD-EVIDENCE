import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  Clock, 
  Share2, 
  Building2, 
  UserCheck,
  Search,
  Scale
} from 'lucide-react';

interface PublicLandingViewProps {
  onEnterEnterprise: () => void;
  onEnterConsumer: () => void;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({
  onEnterEnterprise,
  onEnterConsumer
}) => {
  return (
    <div className="landing-page-container">
      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="landing-hero-badge">
          <ShieldCheck size={16} color="#3D5AFE" />
          <span>THE EVIDENCE LAYER FOR MODERN ADVERTISING</span>
        </div>

        <h1 className="landing-hero-headline">
          SEE THE CLAIM.<br />
          SEE THE EVIDENCE.
        </h1>

        <p className="landing-hero-subtitle">
          AD-EVIDENCE connects advertising claims with the empirical evidence behind them — helping brands verify before publishing and consumers verify before buying.
        </p>

        <div className="landing-hero-cta-row">
          <button className="btn btn-primary" onClick={onEnterConsumer}>
            <Search size={16} />
            <span>Verify an Advertisement</span>
          </button>

          <button className="btn btn-secondary" onClick={onEnterEnterprise}>
            <Building2 size={16} />
            <span>Explore Brand Console</span>
          </button>
        </div>

        {/* Hero Visual: The Claim Flow Diagram */}
        <div className="landing-hero-diagram-card card">
          <div className="diagram-flow-steps">
            <div className="diagram-step">
              <span className="step-tag">ADVERTISEMENT</span>
              <div className="step-box">Instagram / TV Ad</div>
            </div>

            <div className="diagram-arrow">➔</div>

            <div className="diagram-step">
              <span className="step-tag">EXTRACTED CLAIM</span>
              <div className="step-box font-bold">“50-hour battery”</div>
            </div>

            <div className="diagram-arrow">➔</div>

            <div className="diagram-step">
              <span className="step-tag">CLAIM PASSPORT</span>
              <div className="step-box passport-box mono">CLM-82917</div>
            </div>

            <div className="diagram-arrow">➔</div>

            <div className="diagram-step">
              <span className="step-tag">MULTI-SOURCE EVIDENCE</span>
              <div className="step-multi-stack">
                <span className="stack-badge text-green">Official: 40h</span>
                <span className="stack-badge text-purple">Lab: 38.4h</span>
                <span className="stack-badge text-blue">Consumer: 27-42h</span>
              </div>
            </div>

            <div className="diagram-arrow">➔</div>

            <div className="diagram-step">
              <span className="step-tag">EXPLAINABLE RESULT</span>
              <div className="step-box result-conflict">
                <AlertTriangle size={14} color="#FF2FA3" />
                <span>Conflict Detected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="landing-section-problem">
        <div className="section-pill-tag">THE PROBLEM</div>
        <h2 className="section-heading-large">
          AI makes advertising faster to create.<br />
          Verifying the claims inside it remains broken.
        </h2>
        <p className="section-body-text">
          Generative tools allow marketers to spin up thousands of creative variations in seconds. But an ad is not just an image or a video — it is a container of testable commercial assertions. When claims like battery life, clinical efficacy, range, and pricing diverge from engineering reality, both consumer trust and brand integrity fracture.
        </p>
      </section>

      {/* THE SOLUTION SECTION */}
      <section className="landing-section-solution">
        <div className="section-pill-tag">THE SOLUTION</div>
        <h2 className="section-heading-large">
          A Persistent Claim & Evidence Network
        </h2>

        <div className="solution-steps-grid">
          <div className="solution-step-card card">
            <div className="step-num mono">01</div>
            <h3 className="step-card-title">Extract Claims</h3>
            <p className="step-card-desc">
              Decomposes text, video, and image ads into atomic testable assertions with standardized unit normalization.
            </p>
          </div>

          <div className="solution-step-card card">
            <div className="step-num mono">02</div>
            <h3 className="step-card-title">Connect Evidence</h3>
            <p className="step-card-desc">
              Anchors claims to manufacturer spec sheets, accredited lab tests, retailer feeds, and verified consumer telemetry.
            </p>
          </div>

          <div className="solution-step-card card">
            <div className="step-num mono">03</div>
            <h3 className="step-card-title">Detect Conflicts</h3>
            <p className="step-card-desc">
              Deterministic engines identify numerical discrepancies, missing operating conditions (e.g. ANC Off), and outdated prices.
            </p>
          </div>

          <div className="solution-step-card card">
            <div className="step-num mono">04</div>
            <h3 className="step-card-title">Track Changes</h3>
            <p className="step-card-desc">
              Creates a persistent Claim Passport that follows a claim across social reels, marketplaces, and print media over time.
            </p>
          </div>

          <div className="solution-step-card card">
            <div className="step-num mono">05</div>
            <h3 className="step-card-title">Explain Results</h3>
            <p className="step-card-desc">
              Replaces opaque trust scores with transparent answers: what was claimed, what was checked, and exact citations.
            </p>
          </div>
        </div>
      </section>

      {/* DIFFERENT FOR A REASON */}
      <section className="landing-section-differentiators">
        <div className="section-pill-tag">DIFFERENT FOR A REASON</div>
        <h2 className="section-heading-large">Built on Evidence, Not Black-Box Intuition</h2>

        <div className="diff-cards-grid">
          <div className="diff-card card">
            <h4 className="diff-title">Claim-Centered</h4>
            <p className="diff-desc">Ads change and expire. Commercial claims persist and travel with products.</p>
          </div>

          <div className="diff-card card">
            <h4 className="diff-title">Evidence-Connected</h4>
            <p className="diff-desc">Every finding has a publisher, timestamp, document citation, and tamper hash.</p>
          </div>

          <div className="diff-card card">
            <h4 className="diff-title">Context-Aware</h4>
            <p className="diff-desc">Distinguishes conditions like volume level, test mode, payload, and ambient temperature.</p>
          </div>

          <div className="diff-card card">
            <h4 className="diff-title">Time-Aware</h4>
            <p className="diff-desc">Recognizes expired promotional pricing rather than blindly labeling old ads as false.</p>
          </div>

          <div className="diff-card card">
            <h4 className="diff-title">Two-Sided</h4>
            <p className="diff-desc">One shared evidence network serving both enterprise brand compliance and consumers.</p>
          </div>
        </div>
      </section>

      {/* FOR BRANDS & FOR CONSUMERS */}
      <section className="landing-two-sided-section">
        <div className="two-sided-grid">
          <div className="two-sided-card card">
            <div className="side-badge">FOR BRANDS</div>
            <h3 className="side-heading">Verify Before Publishing</h3>
            <p className="side-sub">
              Screen pre-flight ad copy, batch scan campaigns, attach engineering proof, and respond to independent evidence disputes without deleting public audit trails.
            </p>
            <button className="btn btn-primary btn-sm" onClick={onEnterEnterprise}>
              <span>Open Brand Workspace</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="two-sided-card card">
            <div className="side-badge">FOR CONSUMERS</div>
            <h3 className="side-heading">Verify Before Buying</h3>
            <p className="side-sub">
              Check commercial claims instantly against official specifications, independent benchmark testing, and aggregated user observations.
            </p>
            <button className="btn btn-secondary btn-sm" onClick={onEnterConsumer}>
              <span>Verify an Advertisement</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="landing-final-cta card">
        <h2 className="final-cta-headline">Don’t just trust the claim. See the evidence.</h2>
        <p className="final-cta-sub">
          Join the evidence layer for modern advertising. Start inspecting claims with complete source traceability.
        </p>
        <div className="final-cta-buttons">
          <button className="btn btn-primary" onClick={onEnterConsumer}>
            <span>Verify an Ad Now</span>
          </button>
          <button className="btn btn-secondary" onClick={onEnterEnterprise}>
            <span>Enterprise Workspace</span>
          </button>
        </div>
      </section>
    </div>
  );
};
