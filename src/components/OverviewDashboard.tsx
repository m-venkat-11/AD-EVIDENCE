import React from 'react';
import { 
  Plus, 
  Share2, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileCheck2, 
  Database, 
  ArrowUpRight, 
  Layers,
  ChevronRight,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';
import type { ClaimPassport, TimelineEvent } from '../types';

interface OverviewDashboardProps {
  claims: ClaimPassport[];
  timelineEvents: TimelineEvent[];
  onVerifyNew: () => void;
  onExploreGraph: () => void;
  onSelectClaim: (claimId: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  claims,
  timelineEvents,
  onVerifyNew,
  onExploreGraph,
  onSelectClaim
}) => {
  // Derive KPI metrics from live state
  const totalClaims = claims.length;
  const totalEvidence = claims.reduce((acc, c) => acc + c.sources.length, 0);
  const needingReview = claims.filter(c => c.status === 'CONTEXT_MISSING' || c.status === 'OUTDATED' || c.status === 'UNDER_REVIEW' || c.status === 'INSUFFICIENT_EVIDENCE').length;
  const conflictsDetected = claims.filter(c => c.status === 'CONTRADICTED').length;
  const coveragePercent = totalClaims > 0
    ? Math.round((claims.filter(c => c.sources.length > 0).length / totalClaims) * 100)
    : 0;

  // Dynamic greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const recentEvidence = claims.flatMap(c => 
    c.sources.map(s => ({
      ...s,
      claimWording: c.advertisedWording,
      productName: c.productName
    }))
  ).slice(0, 5);

  return (
    <div className="overview-container">
      {/* Top Greeting & Action Header */}
      <div className="overview-header-bar">
        <div>
          <h1 className="page-title">Verification Dashboard</h1>
          <p className="page-subtitle">
            Monitor the commercial claims your organization makes and the evidence behind them.
          </p>
        </div>

        <div className="overview-header-actions">
          <button className="btn btn-secondary" onClick={onExploreGraph}>
            <Share2 size={16} />
            <span>Explore Claim Graph</span>
          </button>

          <button className="btn btn-primary" onClick={onVerifyNew}>
            <Plus size={16} />
            <span>Verify New Content</span>
          </button>
        </div>
      </div>

      {/* Zero State Onboarding Hero if no claims exist */}
      {totalClaims === 0 && (
        <div className="card" style={{ padding: '36px', textAlign: 'center', margin: '16px 0 24px', border: '1px solid rgba(0, 229, 255, 0.3)', background: 'radial-gradient(ellipse at top, rgba(0, 229, 255, 0.08), transparent 70%)' }}>
          <ShieldCheck size={48} color="#00E5FF" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F5F7FF', marginBottom: '8px' }}>
            Ready to Verify Your Advertisement
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#AEB6C2', maxWidth: '650px', margin: '0 auto 20px', lineHeight: 1.6 }}>
            Paste or upload any ad copy, image, or URL. AD-EVIDENCE will extract atomic claims, gather multi-tier evidence (official specifications, retailer listings, lab tests), and dynamically populate the entire dashboard, claim passports, knowledge graph, and compliance reports.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={onVerifyNew} style={{ padding: '10px 22px', fontSize: '0.92rem' }}>
              <Plus size={16} />
              <span>Verify An Advertisement Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards - Section 6 Standard */}
      <div className="stats-kpi-grid">
        {/* KPI 1: Claims Monitored */}
        <div className="kpi-card card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Claims Monitored</span>
            <div className="kpi-icon-pill icon-blue">
              <FileCheck2 size={16} color="#3D5AFE" />
            </div>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">{totalClaims}</span>
            <span className="kpi-trend trend-up">
              <TrendingUp size={13} /> {totalClaims > 0 ? 'Active tracking' : 'Standby'}
            </span>
          </div>
          <p className="kpi-explanation">
            Persistent atomic assertions tracked across ads, marketplaces and technical sheets.
          </p>
          <div className="kpi-indicator-bar bar-blue"></div>
        </div>

        {/* KPI 2: Evidence Sources */}
        <div className="kpi-card card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Evidence Sources</span>
            <div className="kpi-icon-pill icon-green">
              <Database size={16} color="#00E5FF" />
            </div>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number">{totalEvidence}</span>
            <span className="kpi-trend trend-neutral">
              {coveragePercent}% citation coverage
            </span>
          </div>
          <p className="kpi-explanation">
            Anchored records across manufacturer manuals, certified lab tests and retailer feeds.
          </p>
          <div className="kpi-indicator-bar bar-green"></div>
        </div>

        {/* KPI 3: Claims Needing Review */}
        <div className="kpi-card card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Claims Needing Review</span>
            <div className="kpi-icon-pill icon-amber">
              <Clock size={16} color="#FF8A1E" />
            </div>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number text-amber">{needingReview}</span>
            <span className="kpi-trend trend-amber">
              Pending context match
            </span>
          </div>
          <p className="kpi-explanation">
            Unverified marketing variants, missing test condition footnotes or expiring prices.
          </p>
          <div className="kpi-indicator-bar bar-amber"></div>
        </div>

        {/* KPI 4: Conflicts Detected */}
        <div className="kpi-card card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Conflicts Detected</span>
            <div className="kpi-icon-pill icon-red">
              <AlertTriangle size={16} color="#FF2FA3" />
            </div>
          </div>
          <div className="kpi-number-row">
            <span className="kpi-main-number text-red">{conflictsDetected}</span>
            <span className="kpi-trend trend-red">
              {conflictsDetected > 0 ? 'Action required' : 'No conflicts'}
            </span>
          </div>
          <p className="kpi-explanation">
            Direct contradictions between advertised copy, engineering specs, or lab benchmarks.
          </p>
          <div className="kpi-indicator-bar bar-red"></div>
        </div>
      </div>

      {/* Main Grid: Claim Activity (Left) + Priority Reviews & Recent Evidence (Right) */}
      <div className="overview-content-layout">
        {/* Left: Claim Activity Timeline */}
        <div className="activity-section card">
          <div className="section-card-header">
            <div>
              <h2 className="section-title">Claim Activity</h2>
              <p className="section-subtitle">Real-time audit log of claim lifecycle, evidence ingestion and conflict flags.</p>
            </div>
            <span className="badge-live-feed">Live Feed</span>
          </div>

          <div className="timeline-activity-feed">
            {timelineEvents.length === 0 ? (
              <div style={{ padding: '36px 16px', textAlign: 'center', color: '#AEB6C2', fontSize: '0.88rem' }}>
                No claim activity recorded yet. Verify an advertisement to generate audit trail.
              </div>
            ) : (
              timelineEvents.map((event) => (
                <div key={event.id} className="activity-item">
                  <div className="activity-left-col">
                    <div className={`activity-bullet-dot ${event.eventType.toLowerCase()}`}></div>
                    <div className="activity-line"></div>
                  </div>

                  <div className="activity-body">
                    <div className="activity-meta-row">
                      <span className="activity-title-bold">{event.title}</span>
                      <span className="activity-date mono">{event.date}</span>
                    </div>

                    <p className="activity-description">{event.description}</p>

                    <div className="activity-footer-row">
                      <span className="activity-claim-id mono">{event.claimId}</span>
                      <button 
                        className="activity-inspect-btn"
                        onClick={() => onSelectClaim(event.claimId)}
                      >
                        <span>View Claim Passport</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Priority Reviews & Recent Evidence */}
        <div className="overview-side-column">
          {/* Priority Reviews */}
          <div className="side-card card">
            <div className="section-card-header">
              <div>
                <h3 className="section-title">Priority Reviews</h3>
                <p className="section-subtitle">Flagged claims requiring compliance or legal resolution.</p>
              </div>
              <span className="badge-count-red">{conflictsDetected} Flagged</span>
            </div>

            <div className="priority-items-stack">
              {claims.filter(c => c.status === 'CONTRADICTED').length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: '#AEB6C2', fontSize: '0.85rem' }}>
                  {totalClaims === 0 ? 'No claims monitored yet.' : 'No direct conflicts detected across verified claims.'}
                </div>
              ) : (
                claims.filter(c => c.status === 'CONTRADICTED').map((claim) => (
                  <div 
                    key={claim.id} 
                    className="priority-review-item"
                    onClick={() => onSelectClaim(claim.id)}
                  >
                    <div className="priority-item-top">
                      <span className="priority-claim-type">{claim.claimType.replace('_', ' ').toUpperCase()}</span>
                      <span className="status-pill CONTRADICTED">Conflict Detected</span>
                    </div>

                    <div className="priority-claim-wording">“{claim.advertisedWording}”</div>
                    <div className="priority-product-name">{claim.productName}</div>

                    <div className="priority-conflict-summary">
                      <span className="text-secondary">{claim.conflicts.length || 1} conflicting sources identified (Official vs Ad Copy)</span>
                    </div>

                    <div className="priority-action-link">
                      <span>Inspect Evidence Breakdown</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Evidence */}
          <div className="side-card card">
            <div className="section-card-header">
              <div>
                <h3 className="section-title">Recent Evidence Ingested</h3>
                <p className="section-subtitle">Latest ground truth and benchmark sources added.</p>
              </div>
            </div>

            <div className="recent-evidence-list">
              {recentEvidence.length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: '#AEB6C2', fontSize: '0.85rem' }}>
                  No evidence sources ingested yet.
                </div>
              ) : (
                recentEvidence.map((snippet, idx) => (
                  <div key={idx} className="evidence-snippet-item">
                    <div className="snippet-type-row">
                      <span className={`snippet-type ${snippet.sourceType.toLowerCase()}`}>
                        {snippet.sourceType.replace('_', ' ')}
                      </span>
                      <span className="snippet-date">{snippet.retrievedDate || 'Recent'}</span>
                    </div>
                    <div className="snippet-title">{snippet.sourceName}</div>
                    <div className="snippet-quote">“{snippet.observedValue}”</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

