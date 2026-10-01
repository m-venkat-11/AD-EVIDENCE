import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Sliders, 
  Clock, 
  HelpCircle, 
  ArrowRight,
  TrendingDown,
  Layers,
  Sparkles
} from 'lucide-react';
import type { ClaimPassport } from '../types';

interface ConflictInspectorProps {
  claim: ClaimPassport;
}

export const ConflictInspector: React.FC<ConflictInspectorProps> = ({ claim }) => {
  return (
    <div className="conflict-inspector-card glass-panel">
      <div className="section-title-row">
        <div className="title-left">
          <div className="icon-badge-amber">
            <Sliders size={20} color="#FF8A1E" />
          </div>
          <div>
            <h3 className="card-title">Cross-Source Conflict & Context Detector</h3>
            <p className="card-subtitle">
              Section 4 & 5: Multi-source divergence analysis. <em>“Don’t declare true or false; show the evidence.”</em>
            </p>
          </div>
        </div>

        <div className="conflict-count-pill">
          <AlertTriangle size={14} color="#FF2FA3" />
          <span>{claim.conflicts.length} Active Discrepancies</span>
        </div>
      </div>

      {/* Discrepancy Matrix Cards */}
      <div className="conflicts-grid">
        {claim.conflicts.map((conflict, idx) => (
          <div 
            key={idx} 
            className={`conflict-card-item impact-${conflict.impactLevel.toLowerCase()}`}
          >
            <div className="conflict-card-header">
              <span className={`impact-badge ${conflict.impactLevel.toLowerCase()}`}>
                {conflict.impactLevel} CONFLICT
              </span>
              <span className="conflict-index">Delta #{idx + 1}</span>
            </div>

            <div className="conflict-sides-row">
              <div className="conflict-side side-advertised">
                <div className="side-source-label">{conflict.sourceA}</div>
                <div className="side-value-highlight">{conflict.valueA}</div>
              </div>

              <div className="conflict-vs-divider">
                <span className="vs-circle">VS</span>
              </div>

              <div className="conflict-side side-verified">
                <div className="side-source-label">{conflict.sourceB}</div>
                <div className="side-value-highlight verified">{conflict.valueB}</div>
              </div>
            </div>

            <div className="conflict-nature-box">
              <div className="nature-text">
                <strong>Analysis:</strong> {conflict.nature}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quantitative Value Comparison Visualizer (e.g. for battery, range, price) */}
      <div className="quantitative-compare-section">
        <div className="quant-header">
          <span className="quant-title">Attribute Value Divergence: <span className="attr-tag">`{claim.attribute}`</span></span>
          <span className="quant-unit">Units: <strong>{claim.unit}</strong></span>
        </div>

        <div className="quant-bars-list">
          {claim.sources.map((src) => {
            const numVal = typeof src.normalizedValue === 'number' ? src.normalizedValue : null;
            // Let's compute a proportional bar width relative to highest observed or advertised
            const maxVal = Math.max(
              typeof claim.normalizedValue === 'number' ? claim.normalizedValue : 60,
              ...claim.sources.map(s => typeof s.normalizedValue === 'number' ? s.normalizedValue : 0),
              1
            );
            const percent = numVal ? Math.min(Math.round((numVal / maxVal) * 100), 100) : 75;

            return (
              <div key={src.id} className="quant-bar-row">
                <div className="bar-source-col">
                  <span className={`source-type-pill ${src.sourceType.toLowerCase()}`}>
                    {src.sourceType.replace('_', ' ')}
                  </span>
                  <span className="bar-source-name">{src.sourceName}</span>
                </div>

                <div className="bar-visual-col">
                  <div className="bar-track">
                    <div 
                      className={`bar-fill type-${src.sourceType.toLowerCase()}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="bar-value-label">{src.observedValue}</span>
                </div>

                <div className="bar-conditions-col">
                  <span className="condition-note" title={src.conditions}>
                    {src.conditions}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
