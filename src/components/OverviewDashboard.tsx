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
              <TrendingUp size={13} /> Active tracking
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
            {timelineEvents.map((event) => (
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
            ))}
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
              <span className="badge-count-red">2 High Severity</span>
            </div>

            <div className="priority-items-stack">
              {claims.filter(c => c.status === 'CONTRADICTED').map((claim) => (
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
                    <span className="text-secondary">2 conflicting sources identified (Official vs Ad Copy)</span>
                  </div>

                  <div className="priority-action-link">
                    <span>Inspect Evidence Breakdown</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              ))}
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
              <div className="evidence-snippet-item">
                <div className="snippet-type-row">
                  <span className="snippet-type official">OFFICIAL SPECIFICATION</span>
                  <span className="snippet-date">28 Sep 2026</span>
                </div>
                <div className="snippet-title">Sony WH-1000XM5 User Manual (WH-1000XM5, p.18)</div>
                <div className="snippet-quote">“Up to 40 hours with ANC Off at 50% volume (AAC codec).”</div>
              </div>

              <div className="evidence-snippet-item">
                <div className="snippet-type-row">
                  <span className="snippet-type lab">INDEPENDENT TEST</span>
                  <span className="snippet-date">14 Sep 2026</span>
                </div>
                <div className="snippet-title">AcousticLab Runtime Evaluation Report #TAL-2026</div>
                <div className="snippet-quote">“38.4 hours measured under IEC 60268 continuous pink noise output.”</div>
              </div>

              <div className="evidence-snippet-item">
                <div className="snippet-type-row">
                  <span className="snippet-type retailer">RETAILER LISTING</span>
                  <span className="snippet-date">03 Aug 2026</span>
                </div>
                <div className="snippet-title">Amazon ASIN B0C8XYZ950 Product Bullets</div>
                <div className="snippet-quote">“40 hours battery backup. Fast charging enabled.”</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
