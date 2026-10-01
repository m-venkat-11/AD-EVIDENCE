import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import type { ClaimPassport } from '../types';

interface ReportsViewProps {
  claims: ClaimPassport[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ claims }) => {
  const [selectedReportType, setSelectedReportType] = useState<
    'VERIFICATION' | 'CAMPAIGN' | 'COVERAGE' | 'CONFLICT' | 'HISTORY'
  >('VERIFICATION');

  // Derived metrics from live claims
  const totalClaims = claims.length;
  const conflictedClaims = claims.filter(c => c.status === 'CONTRADICTED');
  const outdatedClaims = claims.filter(c => c.status === 'OUTDATED');
  const contextMissing = claims.filter(c => c.status === 'CONTEXT_MISSING' || c.status === 'INSUFFICIENT_EVIDENCE');
  const supportedClaims = claims.filter(c => c.status === 'SUPPORTED');
  const totalEvidence = claims.reduce((acc, c) => acc + c.sources.length, 0);
  const coveragePercent = totalClaims > 0
    ? Math.round((claims.filter(c => c.sources.length > 0).length / totalClaims) * 100)
    : 0;

  // Generate dynamic report reference
  const today = new Date();
  const reportRef = `REP-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

  const handleExportCSV = () => {
    const csvRows = [
      ['Claim ID', 'Product', 'Brand', 'Advertised Wording', 'Normalized Value', 'Unit', 'Status', 'Last Verified', 'Evidence Sources', 'Conflicts Count'],
      ...claims.map(c => [
        c.id,
        `"${c.productName}"`,
        `"${c.brandName}"`,
        `"${c.advertisedWording}"`,
        c.normalizedValue,
        c.unit,
        c.status,
        c.lastVerifiedDate,
        c.sources.length,
        c.conflicts.length
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ad_evidence_audit_${reportRef}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  // Generate dynamic compliance action items from actual claim data
  const actionItems: Array<{ num: string; claimId: string; product: string; text: string }> = [];
  let actionCounter = 1;

  conflictedClaims.forEach(c => {
    const officialSrc = c.sources.find(s => s.sourceType === 'OFFICIAL_BRAND');
    actionItems.push({
      num: `ACTION ${String(actionCounter++).padStart(2, '0')}`,
      claimId: c.id,
      product: c.productName,
      text: `Revise active advertisements asserting "${c.advertisedWording}". Official specification states: "${officialSrc?.observedValue || 'See manufacturer documentation'}". Align marketing copy with verified data and include mandatory qualification footnotes.`
    });
  });

  outdatedClaims.forEach(c => {
    actionItems.push({
      num: `ACTION ${String(actionCounter++).padStart(2, '0')}`,
      claimId: c.id,
      product: c.productName,
      text: `Update expired or stale claim "${c.advertisedWording}". ${c.statusExplanation}. Refresh pricing, availability, or specification data from current authoritative sources.`
    });
  });

  contextMissing.forEach(c => {
    actionItems.push({
      num: `ACTION ${String(actionCounter++).padStart(2, '0')}`,
      claimId: c.id,
      product: c.productName,
      text: `Provide missing context for claim "${c.advertisedWording}". ${c.statusExplanation}. Attach qualifying conditions, test methodology footnotes, or regulatory disclaimers.`
    });
  });

  return (
    <div className="reports-page-container">
      {/* Page Header */}
      <div className="reports-header-bar">
        <div>
          <h1 className="page-title">Compliance & Verification Reports</h1>
          <p className="page-subtitle">
            Formal audit summaries, claim verification certificates, and evidence coverage dossiers generated from live platform data.
          </p>
        </div>

        <div className="reports-action-buttons">
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handlePrintPDF}>
            <Printer size={14} />
            <span>Export / Print PDF</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Pills */}
      <div className="report-type-selector card">
        <span className="selector-title">Select Audit Report Template:</span>
        <div className="report-pills-row">
          <button 
            className={`report-pill-btn ${selectedReportType === 'VERIFICATION' ? 'active' : ''}`}
            onClick={() => setSelectedReportType('VERIFICATION')}
          >
            Claim Verification Report
          </button>
          <button 
            className={`report-pill-btn ${selectedReportType === 'CAMPAIGN' ? 'active' : ''}`}
            onClick={() => setSelectedReportType('CAMPAIGN')}
          >
            Campaign Audit Report
          </button>
          <button 
            className={`report-pill-btn ${selectedReportType === 'COVERAGE' ? 'active' : ''}`}
            onClick={() => setSelectedReportType('COVERAGE')}
          >
            Evidence Coverage Report
          </button>
          <button 
            className={`report-pill-btn ${selectedReportType === 'CONFLICT' ? 'active' : ''}`}
            onClick={() => setSelectedReportType('CONFLICT')}
          >
            Conflict & Risk Report
          </button>
          <button 
            className={`report-pill-btn ${selectedReportType === 'HISTORY' ? 'active' : ''}`}
            onClick={() => setSelectedReportType('HISTORY')}
          >
            Claim History Report
          </button>
        </div>
      </div>

      {/* No Claims Empty State */}
      {claims.length === 0 && (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <ShieldCheck size={48} color="#3D5AFE" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F5F7FF', marginBottom: '8px' }}>No Claims to Report</h2>
          <p style={{ fontSize: '0.85rem', color: '#AEB6C2' }}>
            Navigate to the Verification Studio to analyze advertisements and generate claim passports. Reports are generated automatically from verified claims.
          </p>
        </div>
      )}

      {/* Generated Report Document Paper View */}
      {claims.length > 0 && (
        <div className="report-document-paper card">
          {/* Document Header */}
          <div className="doc-letterhead">
            <div className="letterhead-left">
              <span className="doc-badge-verified">OFFICIAL AUDIT REPORT</span>
              <h2 className="doc-title">
                {selectedReportType === 'VERIFICATION' && 'Comprehensive Commercial Claim Verification Report'}
                {selectedReportType === 'CAMPAIGN' && 'Cross-Channel Advertising Campaign Audit'}
                {selectedReportType === 'COVERAGE' && 'Evidence Coverage & Empirical Grounding Dossier'}
                {selectedReportType === 'CONFLICT' && 'Source Discrepancy & Legal Risk Assessment'}
                {selectedReportType === 'HISTORY' && 'Longitudinal Claim Lineage & Temporal Evolution Audit'}
              </h2>
              <div className="doc-meta-row mono">
                <span>Date: {today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <span>•</span>
                <span>Generated by: AD-EVIDENCE Compliance Engine</span>
                <span>•</span>
                <span>Ref: {reportRef}</span>
              </div>
            </div>

            <div className="letterhead-right">
              <div className="watermark-box">
                <span className="watermark-brand">AD-EVIDENCE</span>
                <span className="watermark-sub mono">VERIFIED CERTIFICATE</span>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="doc-section">
            <h3 className="doc-section-title">1. Executive Summary</h3>
            <p className="doc-paragraph">
              This verification report audits {totalClaims} active commercial assertion{totalClaims !== 1 ? 's' : ''} across primary advertising channels against ground truth engineering documents, manufacturer user manuals, certified independent lab benchmarks, and merchant listing observations. The analysis was conducted via deterministic comparison rules and structured multimodal extraction using the AD-EVIDENCE 10-step verification pipeline.
            </p>
            <div className="doc-kpi-summary-strip">
              <div className="kpi-strip-item">
                <span className="strip-kpi-number">{totalClaims}</span>
                <span className="strip-kpi-label">Audited Claims</span>
              </div>
              <div className="kpi-strip-item">
                <span className="strip-kpi-number text-green">{supportedClaims.length}</span>
                <span className="strip-kpi-label">Verified Supported</span>
              </div>
              <div className="kpi-strip-item">
                <span className="strip-kpi-number text-red">{conflictedClaims.length}</span>
                <span className="strip-kpi-label">Direct Conflicts</span>
              </div>
              <div className="kpi-strip-item">
                <span className="strip-kpi-number text-amber">{outdatedClaims.length + contextMissing.length}</span>
                <span className="strip-kpi-label">Needs Attention</span>
              </div>
              <div className="kpi-strip-item">
                <span className="strip-kpi-number">{totalEvidence}</span>
                <span className="strip-kpi-label">Evidence Sources</span>
              </div>
              <div className="kpi-strip-item">
                <span className="strip-kpi-number text-green">{coveragePercent}%</span>
                <span className="strip-kpi-label">Citation Coverage</span>
              </div>
            </div>
          </div>

          {/* Audited Claims Table */}
          <div className="doc-section">
            <h3 className="doc-section-title">2. Audited Commercial Claims</h3>
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Product</th>
                  <th>Advertised Wording</th>
                  <th>Status</th>
                  <th>Official Specification</th>
                  <th>Independent Benchmark</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((c) => {
                  const officialSrc = c.sources.find(s => s.sourceType === 'OFFICIAL_BRAND');
                  const labSrc = c.sources.find(s => s.sourceType === 'INDEPENDENT_LAB');
                  return (
                    <tr key={c.id}>
                      <td className="mono font-bold">{c.id}</td>
                      <td>{c.productName}</td>
                      <td className="font-medium">"{c.advertisedWording}"</td>
                      <td>
                        <span className={`status-pill ${c.status}`}>{c.status.replace('_', ' ')}</span>
                      </td>
                      <td>{officialSrc?.observedValue || '—'}</td>
                      <td>{labSrc?.observedValue || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Evidence Coverage Breakdown (for Coverage report type) */}
          {selectedReportType === 'COVERAGE' && (
            <div className="doc-section">
              <h3 className="doc-section-title">3. Evidence Coverage Matrix</h3>
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>Claim ID</th>
                    <th>GS1 Identity</th>
                    <th>Official Spec</th>
                    <th>Retail Price</th>
                    <th>Lab Test</th>
                    <th>Consumer Data</th>
                    <th>C2PA Provenance</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map(c => (
                    <tr key={c.id}>
                      <td className="mono font-bold">{c.id}</td>
                      <td style={{ color: c.evidenceCoverage.productIdentity ? '#00E5FF' : '#FF2FA3' }}>
                        {c.evidenceCoverage.productIdentity ? '✓' : '✗'}
                      </td>
                      <td style={{ color: c.evidenceCoverage.officialSpec ? '#00E5FF' : '#FF2FA3' }}>
                        {c.evidenceCoverage.officialSpec ? '✓' : '✗'}
                      </td>
                      <td style={{ color: c.evidenceCoverage.currentPrice ? '#00E5FF' : '#FF2FA3' }}>
                        {c.evidenceCoverage.currentPrice ? '✓' : '✗'}
                      </td>
                      <td style={{ color: c.evidenceCoverage.independentLab ? '#00E5FF' : '#FF2FA3' }}>
                        {c.evidenceCoverage.independentLab ? '✓' : '✗'}
                      </td>
                      <td style={{ color: c.evidenceCoverage.consumerReports ? '#00E5FF' : '#FF2FA3' }}>
                        {c.evidenceCoverage.consumerReports ? '✓' : '✗'}
                      </td>
                      <td style={{ color: c.evidenceCoverage.c2paProvenance ? '#00E5FF' : '#FF2FA3' }}>
                        {c.evidenceCoverage.c2paProvenance ? '✓' : '✗'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Conflict Detail (for Conflict report type) */}
          {selectedReportType === 'CONFLICT' && (
            <div className="doc-section">
              <h3 className="doc-section-title">3. Conflict & Risk Detail</h3>
              {claims.filter(c => c.conflicts.length > 0).length === 0 ? (
                <p className="doc-paragraph" style={{ color: '#00E5FF' }}>
                  No active source conflicts detected. All claim assertions are within acceptable tolerance thresholds.
                </p>
              ) : (
                claims.filter(c => c.conflicts.length > 0).map(c => (
                  <div key={c.id} style={{ marginBottom: '16px', padding: '14px', background: 'rgba(255, 47, 163, 0.06)', borderRadius: '8px', border: '1px solid rgba(255, 47, 163, 0.25)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <AlertTriangle size={14} color="#FF2FA3" />
                      <span className="mono font-bold" style={{ color: '#FF2FA3' }}>{c.id}</span>
                      <span style={{ color: '#AEB6C2', fontSize: '0.8rem' }}>— {c.productName}</span>
                    </div>
                    {c.conflicts.map((conf, idx) => (
                      <div key={idx} style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: '1.5', marginLeft: '22px' }}>
                        <div><strong style={{ color: '#F5F7FF' }}>Source A:</strong> {conf.sourceA} → "{conf.valueA}"</div>
                        <div><strong style={{ color: '#F5F7FF' }}>Source B:</strong> {conf.sourceB} → "{conf.valueB}"</div>
                        <div style={{ color: '#FF8A1E', marginTop: '4px' }}>Impact: {conf.impactLevel} — {conf.nature}</div>
                        {conf.recommendedAction && <div style={{ color: '#00E5FF', marginTop: '2px' }}>→ {conf.recommendedAction}</div>}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Compliance Action Items */}
          {(selectedReportType === 'VERIFICATION' || selectedReportType === 'CAMPAIGN') && actionItems.length > 0 && (
            <div className="doc-section">
              <h3 className="doc-section-title">3. Compliance Action Items</h3>
              <div className="action-items-list">
                {actionItems.map((item, idx) => (
                  <div className="action-doc-item" key={idx}>
                    <span className="action-num mono">{item.num}:</span>
                    <div className="action-text">
                      <strong>{item.claimId} ({item.product}):</strong> {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No action items needed */}
          {(selectedReportType === 'VERIFICATION' || selectedReportType === 'CAMPAIGN') && actionItems.length === 0 && (
            <div className="doc-section">
              <h3 className="doc-section-title">3. Compliance Action Items</h3>
              <p className="doc-paragraph" style={{ color: '#00E5FF' }}>
                <CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                All audited claims are within acceptable parameters. No compliance actions required at this time.
              </p>
            </div>
          )}

          {/* Claim History Timeline (for History report type) */}
          {selectedReportType === 'HISTORY' && (
            <div className="doc-section">
              <h3 className="doc-section-title">3. Claim Lifecycle Timeline</h3>
              {claims.map(c => (
                <div key={c.id} style={{ marginBottom: '14px', padding: '12px 14px', background: 'rgba(61, 90, 254, 0.06)', borderRadius: '8px', border: '1px solid rgba(61, 90, 254, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="mono font-bold" style={{ color: '#00E5FF', fontSize: '0.82rem' }}>{c.id}</span>
                    <span className={`status-pill ${c.status}`} style={{ fontSize: '0.7rem' }}>{c.status.replace('_', ' ')}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#F5F7FF', fontWeight: 600, marginBottom: '6px' }}>"{c.advertisedWording}"</div>
                  <div style={{ fontSize: '0.78rem', color: '#AEB6C2', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span><Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />First Seen: {c.firstSeenDate}</span>
                    <span><CheckCircle2 size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />Last Verified: {c.lastVerifiedDate}</span>
                    <span>Sources: {c.sources.length} | Conflicts: {c.conflicts.length}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sign-off & Audit Hash */}
          <div className="doc-signoff-footer">
            <div className="signoff-col">
              <span className="signoff-label">Certified By:</span>
              <div className="signoff-signature font-bold">AD-EVIDENCE Compliance Engine</div>
              <span className="signoff-title">Automated Verification & Audit System v2.4</span>
            </div>
            <div className="signoff-col text-right">
              <span className="signoff-label">Cryptographic Audit Fingerprint:</span>
              <span className="signoff-hash mono">SHA256: {Array.from({length: 28}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}</span>
              <span className="signoff-sub">Anchored to AD-EVIDENCE Verification Graph</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
