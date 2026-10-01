import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Cpu, 
  Layers, 
  Activity, 
  DollarSign, 
  Clock, 
  Target,
  FileCheck
} from 'lucide-react';
import { SYSTEM_BENCHMARK_METRICS } from '../data/mockData';

export const EvaluationDashboard: React.FC = () => {
  return (
    <div className="evaluation-dashboard-container">
      {/* Header Panel */}
      <div className="eval-header-panel glass-panel">
        <div className="header-left">
          <div className="icon-badge-purple">
            <BarChart3 size={24} color="#FF2FA3" />
          </div>
          <div>
            <h2 className="panel-title">System Evaluation & Labeled Benchmark Set</h2>
            <p className="panel-subtitle">
              Section 20: <em>“A trust product needs measurable quality. Do not measure only whether the page looks good.”</em>
            </p>
          </div>
        </div>

        <div className="eval-meta-badge">
          <FileCheck size={14} color="#3D5AFE" />
          <span>Benchmark Suite v2.4 (500 Hand-Labeled Test Ads)</span>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="eval-kpi-grid grid-4">
        <div className="eval-kpi-card glass-panel">
          <div className="kpi-top">
            <span className="kpi-label">Claim Extraction F1</span>
            <Target size={18} color="#3D5AFE" />
          </div>
          <div className="kpi-val text-cyan">{SYSTEM_BENCHMARK_METRICS.claimExtractionF1}</div>
          <div className="kpi-note">Precision: 95.8% | Recall: 92.7%</div>
        </div>

        <div className="eval-kpi-card glass-panel">
          <div className="kpi-top">
            <span className="kpi-label">Product Identity Accuracy</span>
            <CheckCircle2 size={18} color="#3D5AFE" />
          </div>
          <div className="kpi-val text-green">{SYSTEM_BENCHMARK_METRICS.productIdentityAccuracy}</div>
          <div className="kpi-note">GS1 GTIN & Fuzzy Model Match</div>
        </div>

        <div className="eval-kpi-card glass-panel">
          <div className="kpi-top">
            <span className="kpi-label">Citation Coverage</span>
            <Layers size={18} color="#FF2FA3" />
          </div>
          <div className="kpi-val text-purple">{SYSTEM_BENCHMARK_METRICS.citationCoverage}</div>
          <div className="kpi-note">Zero ungrounded hallucinations</div>
        </div>

        <div className="eval-kpi-card glass-panel">
          <div className="kpi-top">
            <span className="kpi-label">False Positive Rate</span>
            <AlertTriangle size={18} color="#FF8A1E" />
          </div>
          <div className="kpi-val text-amber">{SYSTEM_BENCHMARK_METRICS.falsePositiveRate}</div>
          <div className="kpi-note">Industry standard tolerance &lt; 5.0%</div>
        </div>
      </div>

      {/* Detailed Benchmark Metrics Table (Section 20) */}
      <div className="eval-table-card glass-panel">
        <div className="card-header-clean">
          <span className="title-bold">Production Readiness Benchmark Matrix</span>
          <span className="badge-meta">Evaluated across 500 Ads & 1,420 Claims</span>
        </div>

        <div className="eval-table-wrap">
          <table className="eval-table">
            <thead>
              <tr>
                <th>Target Metric</th>
                <th>Measured Value</th>
                <th>Benchmark Target</th>
                <th>Evaluation Methodology</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Claim Extraction Precision / Recall</strong></td>
                <td className="mono text-cyan">95.8% / 92.7% (F1: 94.2%)</td>
                <td className="mono">&gt; 90%</td>
                <td>Evaluated against human-annotated commercial creatives across 6 categories.</td>
                <td><span className="cov-status ok">✓ Exceeds Target</span></td>
              </tr>
              <tr>
                <td><strong>Product Identity Resolution</strong></td>
                <td className="mono text-green">98.1%</td>
                <td className="mono">&gt; 95%</td>
                <td>Barcode / GS1 Registry matching with fallback fuzzy variant disambiguation.</td>
                <td><span className="cov-status ok">✓ Exceeds Target</span></td>
              </tr>
              <tr>
                <td><strong>Evidence Retrieval Precision</strong></td>
                <td className="mono text-cyan">91.7%</td>
                <td className="mono">&gt; 88%</td>
                <td>Relevance score of retrieved official spec sheets and certified lab docs.</td>
                <td><span className="cov-status ok">✓ Exceeds Target</span></td>
              </tr>
              <tr>
                <td><strong>Citation Coverage</strong></td>
                <td className="mono text-green">100.0%</td>
                <td className="mono">100%</td>
                <td>Zero findings admitted without cryptographic hash and document citation anchor.</td>
                <td><span className="cov-status ok">✓ Optimal (100%)</span></td>
              </tr>
              <tr>
                <td><strong>Contradiction Precision</strong></td>
                <td className="mono text-purple">96.3%</td>
                <td className="mono">&gt; 92%</td>
                <td>Percentage of flagged contradictions corroborated by independent human legal audit.</td>
                <td><span className="cov-status ok">✓ Exceeds Target</span></td>
              </tr>
              <tr>
                <td><strong>Freshness Re-check Accuracy</strong></td>
                <td className="mono text-amber">99.0%</td>
                <td className="mono">&gt; 98%</td>
                <td>Automatic detection of expired retail pricing or superseded spec releases.</td>
                <td><span className="cov-status ok">✓ Exceeds Target</span></td>
              </tr>
              <tr>
                <td><strong>End-to-End Pipeline Latency</strong></td>
                <td className="mono text-cyan">1.84 seconds</td>
                <td className="mono">&lt; 3.00s</td>
                <td>Asynchronous worker queue with Redis cache and vector indexing.</td>
                <td><span className="cov-status ok">✓ Fast</span></td>
              </tr>
              <tr>
                <td><strong>Cost per Ad Verification</strong></td>
                <td className="mono text-green">$0.0034 / ad</td>
                <td className="mono">&lt; $0.01</td>
                <td>Hybrid caching: deterministic checks run locally, LLM called only for ambiguous extraction.</td>
                <td><span className="cov-status ok">✓ Ultra Cost Efficient</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 21: Continuous Improvement Loop */}
      <div className="eval-loop-card glass-panel">
        <div className="card-header-clean">
          <div className="header-icon-label">
            <Activity size={18} color="#3D5AFE" />
            <span className="title-bold">Section 21: Intelligent Learning & Continuous Improvement Loop</span>
          </div>
          <span className="badge-meta">Controlled Active Learning</span>
        </div>

        <div className="loop-diagram-flow">
          <div className="loop-step">
            <div className="step-num">1</div>
            <div className="step-title">Model Finding</div>
            <div className="step-sub">Deterministic + AI verification outcome generated</div>
          </div>
          <div className="loop-arrow">➔</div>
          <div className="loop-step">
            <div className="step-num">2</div>
            <div className="step-title">Reviewer Outcome</div>
            <div className="step-sub">Human compliance analyst confirms or amends</div>
          </div>
          <div className="loop-arrow">➔</div>
          <div className="loop-step">
            <div className="step-num">3</div>
            <div className="step-title">Root-Cause Label</div>
            <div className="step-sub">e.g. "Condition Mismatch", "Stale Price", "Unit Conversion"</div>
          </div>
          <div className="loop-arrow">➔</div>
          <div className="loop-step">
            <div className="step-num">4</div>
            <div className="step-title">Regression Benchmark</div>
            <div className="step-sub">Automated unit test added to suite without blind self-training</div>
          </div>
        </div>
      </div>
    </div>
  );
};
