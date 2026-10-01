import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  FileCheck2, 
  Sliders, 
  CheckCircle2, 
  HelpCircle,
  Eye,
  Filter,
  ExternalLink
} from 'lucide-react';
import type { ClaimPassport } from '../types';

interface ConflictsViewProps {
  claims: ClaimPassport[];
  onSelectClaim: (claimId: string) => void;
}

export const ConflictsView: React.FC<ConflictsViewProps> = ({
  claims,
  onSelectClaim
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'CONTEXT' | 'OUTDATED'>('ALL');

  // Collect all conflicts across claims
  const allConflicts = [
    {
      id: 'conf-018',
      claimId: 'CLM-82917',
      claimWording: '50-hour battery life',
      productName: 'Sony WH-1000XM5 Wireless Headphones',
      adValue: '50 hours',
      officialValue: '40 hours (ANC Off)',
      independentValue: '38.4 hours',
      status: 'CONFLICT DETECTED',
      severity: 'Review Required',
      severityType: 'CRITICAL',
      analysis: 'Advertisement asserts a 50-hour guarantee, but official engineering specs rate the battery at up to 40 hours with ANC disabled. Independent tests report 38.4 hours.',
      actionRecommendation: 'Issue copy update: "Up to 40 hours with ANC off"'
    },
    {
      id: 'conf-007',
      claimId: 'CLM-82917',
      claimWording: 'Adaptive Noise Cancellation with 50-hour runtime',
      productName: 'Sony WH-1000XM5 Wireless Headphones',
      adValue: '50 hours (ANC implied)',
      officialValue: '30 hours (ANC On)',
      independentValue: '28.1 hours',
      status: 'CONTEXT MISSING',
      severity: 'Medium Severity',
      severityType: 'CONTEXT',
      missingCondition: 'ANC OFF condition omitted from ad copy',
      analysis: 'Operating runtime drops to 30 hours when ANC is engaged. Omitting the ANC OFF qualifier misleads consumers regarding active noise canceling duration.',
      actionRecommendation: 'Review advertisement wording and add ANC footnote'
    },
    {
      id: 'conf-022',
      claimId: 'CLM-41029',
      claimWording: '100% wrinkle elimination in just 7 days',
      productName: 'UltraGlow Super C Radiance Serum',
      adValue: '100% in 7 days',
      officialValue: '92% in 56 days (8 weeks)',
      independentValue: 'Hydration confirmed; wrinkles remain',
      status: 'CONFLICT DETECTED',
      severity: 'Review Required',
      severityType: 'CRITICAL',
      analysis: 'Timeline compressed from 8 weeks to 7 days, and clinical reduction in appearance inflated to absolute 100% elimination.',
      actionRecommendation: 'Legal clearance required: Align with CTRI registered protocol'
    },
    {
      id: 'conf-025',
      claimId: 'CLM-90312',
      claimWording: 'Starting at ₹44,999 with 120km certified range',
      productName: 'VoltDrive City S-100 Electric Scooter',
      adValue: '₹44,999 ex-showroom',
      officialValue: '₹54,999 current showroom price',
      independentValue: 'N/A (Pricing)',
      status: 'OUTDATED',
      severity: 'Price Expired',
      severityType: 'OUTDATED',
      analysis: 'Introductory promotional price of ₹44,999 expired on July 31, 2026. The ad continues to circulate with outdated pricing.',
      actionRecommendation: 'Takedown expired creative and update to ₹54,999'
    }
  ];

  const filtered = allConflicts.filter((c) => {
    if (filterSeverity === 'ALL') return true;
    if (filterSeverity === 'CRITICAL') return c.severityType === 'CRITICAL';
    if (filterSeverity === 'CONTEXT') return c.severityType === 'CONTEXT';
    if (filterSeverity === 'OUTDATED') return c.severityType === 'OUTDATED';
    return true;
  });

  return (
    <div className="conflicts-page-container">
      {/* Page Header */}
      <div className="conflicts-header-bar">
        <div>
          <h1 className="page-title">Conflicts & Context Anomalies</h1>
          <p className="page-subtitle">
            Section 11: Investigative queue of flagged contradictions, missing operating conditions, and outdated commercial assertions.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="conflicts-filter-chips">
          <button 
            className={`filter-btn ${filterSeverity === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('ALL')}
          >
            All Conflicts ({allConflicts.length})
          </button>
          <button 
            className={`filter-btn ${filterSeverity === 'CRITICAL' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('CRITICAL')}
          >
            Critical Contradictions (2)
          </button>
          <button 
            className={`filter-btn ${filterSeverity === 'CONTEXT' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('CONTEXT')}
          >
            Context Missing (1)
          </button>
          <button 
            className={`filter-btn ${filterSeverity === 'OUTDATED' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('OUTDATED')}
          >
            Outdated Specs / Price (1)
          </button>
        </div>
      </div>

      {/* Conflicts Cards List */}
      <div className="conflicts-stack">
        {filtered.map((item) => (
          <div key={item.id} className="conflict-investigation-card card">
            {/* Card Top */}
            <div className="conflict-card-top-row">
              <div className="conflict-id-group">
                <span className="conflict-code-tag mono">{item.id.toUpperCase()}</span>
                <span className={`status-pill ${item.status === 'CONFLICT DETECTED' ? 'CONTRADICTED' : item.status === 'OUTDATED' ? 'OUTDATED' : 'CONTEXT_MISSING'}`}>
                  {item.status}
                </span>
                <span className="severity-badge">{item.severity}</span>
              </div>

              <span className="conflict-product-name mono">{item.productName}</span>
            </div>

            {/* Target Claim Heading */}
            <div className="conflict-target-claim">
              <span className="claim-label">Investigated Assertion:</span>
              <h2 className="claim-wording-large">“{item.claimWording}”</h2>
            </div>

            {/* Comparison Columns: Ad vs Official vs Independent */}
            <div className="conflict-comparison-columns">
              <div className="compare-col col-ad">
                <span className="col-header-tag">ADVERTISEMENT</span>
                <div className="col-val-text font-bold">{item.adValue}</div>
                <span className="col-sub">Promotional creative</span>
              </div>

              <div className="compare-vs-badge">VS</div>

              <div className="compare-col col-official">
                <span className="col-header-tag text-green">OFFICIAL SPECIFICATION</span>
                <div className="col-val-text text-green">{item.officialValue}</div>
                <span className="col-sub">Ground truth manual</span>
              </div>

              <div className="compare-vs-badge">VS</div>

              <div className="compare-col col-independent">
                <span className="col-header-tag text-blue">INDEPENDENT EVIDENCE</span>
                <div className="col-val-text text-blue">{item.independentValue}</div>
                <span className="col-sub">Lab benchmark / Telemetry</span>
              </div>
            </div>

            {/* Missing Condition Banner (if applicable) */}
            {item.missingCondition && (
              <div className="missing-condition-box">
                <AlertTriangle size={15} color="#FF8A1E" />
                <span><strong>Missing Critical Condition:</strong> {item.missingCondition}</span>
              </div>
            )}

            {/* Analysis & Recommended Action */}
            <div className="conflict-analysis-footer">
              <div className="analysis-text-col">
                <strong>Investigative Finding:</strong> {item.analysis}
              </div>
              <div className="action-text-col">
                <strong>Recommended Action:</strong> {item.actionRecommendation}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="conflict-card-action-bar">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onSelectClaim(item.claimId)}
              >
                <span>View Sources</span>
              </button>

              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onSelectClaim(item.claimId)}
              >
                <span>Open Claim Passport</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
