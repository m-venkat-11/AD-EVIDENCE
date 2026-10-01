import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sliders,
  Sparkles
} from 'lucide-react';
import type { ClaimPassport } from '../types';

interface ClaimPassportsViewProps {
  passports: ClaimPassport[];
  onSelectClaim: (claimId: string) => void;
  onRefreshFreshness: (claimId: string) => void;
}

export const ClaimPassportsView: React.FC<ClaimPassportsViewProps> = ({
  passports,
  onSelectClaim,
  onRefreshFreshness
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(passports[0]?.id || null);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  const filtered = passports.filter((cp) => {
    const matchesSearch = 
      cp.advertisedWording.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cp.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || cp.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleTriggerRecheck = (claimId: string) => {
    setRefreshingId(claimId);
    setTimeout(() => {
      onRefreshFreshness(claimId);
      setRefreshingId(null);
    }, 1200);
  };

  return (
    <div className="claim-passports-container">
      {/* Header and Filter Controls */}
      <div className="passports-header-panel glass-panel">
        <div className="header-left">
          <div className="icon-badge-cyan">
            <FileText size={22} color="#38bdf8" />
          </div>
          <div>
            <h2 className="panel-title">Claim Passport Registry</h2>
            <p className="panel-subtitle">
              Section 2: Persistent verifiable claims that travel across platforms, retail listings, and ads.
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="passports-search-row">
          <div className="search-input-wrap">
            <Search size={16} color="#64748b" />
            <input 
              type="text" 
              className="passport-search-input" 
              placeholder="Search Claim ID, product name, or assertion wording..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="status-filter-pills">
            <button 
              className={`filter-tag ${selectedStatus === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('all')}
            >
              All ({passports.length})
            </button>
            <button 
              className={`filter-tag ${selectedStatus === 'CONTRADICTED' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('CONTRADICTED')}
            >
              Contradicted
            </button>
            <button 
              className={`filter-tag ${selectedStatus === 'OUTDATED' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('OUTDATED')}
            >
              Outdated
            </button>
            <button 
              className={`filter-tag ${selectedStatus === 'CONTEXT_MISSING' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('CONTEXT_MISSING')}
            >
              Context Missing
            </button>
          </div>
        </div>
      </div>

      {/* Claim Passports List */}
      <div className="passports-stack">
        {filtered.map((cp) => {
          const isExpanded = expandedClaimId === cp.id;
          const isRefreshing = refreshingId === cp.id;

          return (
            <div key={cp.id} className={`passport-card glass-panel ${isExpanded ? 'expanded' : ''}`}>
              {/* Top Summary Bar */}
              <div 
                className="passport-card-header" 
                onClick={() => setExpandedClaimId(isExpanded ? null : cp.id)}
              >
                <div className="passport-id-badge">
                  <span className="passport-label">PASSPORT</span>
                  <span className="mono-claim-id">{cp.id}</span>
                </div>

                <div className="passport-core-info">
                  <div className="passport-prod-name">{cp.productName}</div>
                  <div className="passport-claim-quote">“{cp.advertisedWording}”</div>
                </div>

                <div className="passport-status-col">
                  <span className={`status-badge ${cp.status}`}>
                    {cp.status.replace('_', ' ')}
                  </span>
                  <div className="passport-last-verified">
                    <Clock size={12} />
                    <span>Last checked: {cp.lastVerifiedDate}</span>
                  </div>
                </div>

                <div className="passport-header-actions" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleTriggerRecheck(cp.id)}
                    disabled={isRefreshing}
                    title="Run deterministic rule re-check"
                  >
                    <RefreshCw size={13} className={isRefreshing ? 'spin-animation' : ''} />
                    <span>{isRefreshing ? 'Re-verifying...' : 'Re-check Freshness'}</span>
                  </button>

                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => onSelectClaim(cp.id)}
                    title="Open in Consumer Verify View"
                  >
                    <ArrowUpRight size={14} />
                    <span>Inspect</span>
                  </button>

                  <button 
                    className="expand-toggle-btn"
                    onClick={() => setExpandedClaimId(isExpanded ? null : cp.id)}
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Expanded Passport Details */}
              {isExpanded && (
                <div className="passport-expanded-drawer">
                  <div className="passport-table-spec">
                    <div className="spec-row">
                      <div className="spec-key">Claim Passport ID:</div>
                      <div className="spec-val mono text-cyan">{cp.id}</div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-key">Normalized Attribute:</div>
                      <div className="spec-val mono">`{cp.attribute}` = {String(cp.normalizedValue)} {cp.unit}</div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-key">Claim Modality:</div>
                      <div className="spec-val">{cp.claimType.replace('_', ' ').toUpperCase()}</div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-key">Mandatory Conditions:</div>
                      <div className="spec-val">
                        {cp.conditions.map((c, i) => (
                          <span key={i} className="condition-pill-mini">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-key">Freshness Policy:</div>
                      <div className="spec-val text-amber">{cp.freshnessPolicy}</div>
                    </div>
                    <div className="spec-row">
                      <div className="spec-key">Status Explanation:</div>
                      <div className="spec-val">{cp.statusExplanation}</div>
                    </div>
                  </div>

                  {/* Multi-source Comparison Grid inside passport */}
                  <div className="passport-sources-subgrid">
                    <div className="subgrid-title">Multi-Source Lineage Anchors:</div>
                    <div className="sources-pills-row">
                      {cp.sources.map((src) => (
                        <div key={src.id} className="passport-src-pill">
                          <span className={`src-dot ${src.sourceType.toLowerCase()}`}></span>
                          <span className="src-name-bold">{src.sourceName}:</span>
                          <span className="src-val-highlight">{src.observedValue}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ecosystem travel footprint */}
                  <div className="passport-travel-subgrid">
                    <div className="subgrid-title">Ecosystem Footprint ({cp.travelOccurrences.length} Linked Appearances):</div>
                    <div className="footprint-tags">
                      {cp.travelOccurrences.map((occ, i) => (
                        <div key={i} className="footprint-chip">
                          <span className="chip-platform">{occ.platform}</span>
                          <span className="chip-title">{occ.adTitle}</span>
                          <span className="chip-date">{occ.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
