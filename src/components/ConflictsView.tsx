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

  // Collect all conflicts dynamically across claims
  const allConflicts = React.useMemo(() => {
    return claims.flatMap((claim) => {
      if (claim.status === 'SUPPORTED') return [];

      const officialSource = claim.sources.find(s => s.sourceType === 'OFFICIAL_BRAND');
      const independentSource = claim.sources.find(s => s.sourceType === 'INDEPENDENT_LAB' || s.sourceType === 'CONSUMER_OBSERVATION');

      if (claim.conflicts && claim.conflicts.length > 0) {
        return claim.conflicts.map((conf, idx) => ({
          id: `conf-${claim.id}-${idx}`,
          claimId: claim.id,
          claimWording: claim.advertisedWording,
          productName: claim.productName,
          adValue: conf.valueA || `${claim.normalizedValue} ${claim.unit}`,
          officialValue: conf.valueB || officialSource?.observedValue || 'Spec discrepancy',
          independentValue: independentSource?.observedValue || 'Lab benchmark pending',
          status: claim.status === 'CONTRADICTED' ? 'CONFLICT DETECTED' : claim.status === 'OUTDATED' ? 'OUTDATED' : 'CONTEXT MISSING',
          severity: claim.status === 'CONTRADICTED' ? 'Review Required' : 'Context Gap',
          severityType: (claim.status === 'CONTRADICTED' ? 'CRITICAL' : claim.status === 'OUTDATED' ? 'OUTDATED' : 'CONTEXT') as 'CRITICAL' | 'CONTEXT' | 'OUTDATED',
          missingCondition: conf.missingCondition || (claim.conditions.length > 0 ? claim.conditions.join(', ') : ''),
          analysis: conf.nature || claim.statusExplanation,
          actionRecommendation: conf.recommendedAction || 'Update claim copy to match verified manufacturer specifications'
        }));
      }

      return [{
        id: `conf-${claim.id}`,
        claimId: claim.id,
        claimWording: claim.advertisedWording,
        productName: claim.productName,
        adValue: `${claim.normalizedValue} ${claim.unit}`,
        officialValue: officialSource?.observedValue || 'Official manual specification',
        independentValue: independentSource?.observedValue || 'Independent benchmark test',
        status: claim.status === 'CONTRADICTED' ? 'CONFLICT DETECTED' : claim.status === 'OUTDATED' ? 'OUTDATED' : 'CONTEXT MISSING',
        severity: claim.status === 'CONTRADICTED' ? 'Review Required' : 'Context Gap',
        severityType: (claim.status === 'CONTRADICTED' ? 'CRITICAL' : claim.status === 'OUTDATED' ? 'OUTDATED' : 'CONTEXT') as 'CRITICAL' | 'CONTEXT' | 'OUTDATED',
        missingCondition: claim.conditions.join(', '),
        analysis: claim.statusExplanation,
        actionRecommendation: claim.status === 'CONTRADICTED' ? 'Revise creative copy to reflect verified factory ratings' : 'Attach required operational footnote'
      }];
    });
  }, [claims]);

  const criticalCount = allConflicts.filter(c => c.severityType === 'CRITICAL').length;
  const contextCount = allConflicts.filter(c => c.severityType === 'CONTEXT').length;
  const outdatedCount = allConflicts.filter(c => c.severityType === 'OUTDATED').length;

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
            Critical Contradictions ({criticalCount})
          </button>
          <button 
            className={`filter-btn ${filterSeverity === 'CONTEXT' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('CONTEXT')}
          >
            Context Missing ({contextCount})
          </button>
          <button 
            className={`filter-btn ${filterSeverity === 'OUTDATED' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('OUTDATED')}
          >
            Outdated Specs / Price ({outdatedCount})
          </button>
        </div>
      </div>

      {/* Conflicts Cards List */}
      <div className="conflicts-stack">
        {filtered.length === 0 && (
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
            <FileCheck2 size={42} color="#00FF87" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F5F7FF', marginBottom: '8px' }}>
              {claims.length === 0 ? 'No Claims Monitored' : 'Zero Conflicts Detected'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#AEB6C2' }}>
              {claims.length === 0 
                ? 'Verify an advertisement in the Verification Studio to audit claims for discrepancies.' 
                : 'All audited assertions are consistent with official specifications and empirical benchmarks.'}
            </p>
          </div>
        )}
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
