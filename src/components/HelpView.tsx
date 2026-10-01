import React from 'react';
import { HelpCircle, ShieldCheck, Scale, CheckCircle2, AlertTriangle, Clock, Layers } from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div className="help-page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Methodology & System Principles</h1>
          <p className="page-subtitle">
            Section 1, 9, 29: How AD-EVIDENCE extracts claims, scores evidence, and maintains multi-source transparency.
          </p>
        </div>
      </div>

      <div className="help-sections-stack">
        {/* Principle 1 */}
        <div className="help-card card">
          <div className="help-card-header">
            <ShieldCheck size={20} color="#3D5AFE" />
            <h3 className="help-card-title">1. The Core Philosophy: Claim-Centric, Not Ad-Centric</h3>
          </div>
          <p className="help-text">
            Advertisements are temporary containers of assertions. A commercial claim—such as battery life, clinical improvement, warranty, or delivery speed—persists across social ads, marketplace listings, TV commercials, and influencer reviews. AD-EVIDENCE creates a persistent <strong>Claim Passport</strong> that tracks the claim wherever it appears in the ecosystem.
          </p>
        </div>

        {/* Principle 2: Status Taxonomy */}
        <div className="help-card card">
          <div className="help-card-header">
            <Scale size={20} color="#3D5AFE" />
            <h3 className="help-card-title">2. Status Taxonomy (Section 29)</h3>
          </div>
          <p className="help-text">
            We reject simplistic binary true/false classifications. Commercial claims contain nuances, operating modes, and temporal validity:
          </p>
          <div className="taxonomy-grid">
            <div className="tax-item">
              <span className="status-pill SUPPORTED">SUPPORTED</span>
              <p>Evidence adequately corroborates the claim under stated scope and conditions.</p>
            </div>
            <div className="tax-item">
              <span className="status-pill CONTRADICTED">CONTRADICTED</span>
              <p>Available official or certified independent testing directly conflicts with the advertised value.</p>
            </div>
            <div className="tax-item">
              <span className="status-pill CONTEXT_MISSING">CONTEXT MISSING</span>
              <p>The numerical figure is valid only under strict conditions (e.g. "ANC Off" or "Eco Mode") which were omitted.</p>
            </div>
            <div className="tax-item">
              <span className="status-pill OUTDATED">OUTDATED</span>
              <p>The assertion was historically accurate, but current pricing or specifications have superseded it.</p>
            </div>
            <div className="tax-item">
              <span className="status-pill INSUFFICIENT_EVIDENCE">INSUFFICIENT EVIDENCE</span>
              <p>No adequate empirical documentation has been located. We never label missing evidence as false.</p>
            </div>
          </div>
        </div>

        {/* Principle 3: The 4 Essential Questions */}
        <div className="help-card card">
          <div className="help-card-header">
            <Layers size={20} color="#3D5AFE" />
            <h3 className="help-card-title">3. The 4 Essential Questions Standard (Section 10)</h3>
          </div>
          <p className="help-text">
            Every verification result must be fully explainable to humans by answering:
          </p>
          <ul className="questions-bullet-list">
            <li><strong>1. What did the advertisement claim?</strong> The exact normalized assertion extracted from the creative.</li>
            <li><strong>2. What evidence was checked?</strong> Specific official documents, lab reports, and merchant observations reviewed.</li>
            <li><strong>3. What did the evidence say?</strong> The direct excerpts, normalized numbers, and test conditions discovered.</li>
            <li><strong>4. Why did the system choose this status?</strong> The explicit deterministic rule or delta that triggered the conclusion.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
