import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  FileCheck2,
  Calendar,
  Layers
} from 'lucide-react';
import type { ClaimPassport } from '../types';

interface EvidenceLibraryViewProps {
  claims: ClaimPassport[];
  onSelectClaim: (claimId: string) => void;
}

export const EvidenceLibraryView: React.FC<EvidenceLibraryViewProps> = ({
  claims,
  onSelectClaim
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all evidence items from claims
  const allEvidence = claims.flatMap(c => 
    c.sources.map(s => ({
      ...s,
      productName: c.productName,
      claimId: c.id,
      claimWording: c.advertisedWording
    }))
  );

  const filtered = allEvidence.filter(item => {
    const matchesFilter = activeFilter === 'ALL' || item.sourceType === activeFilter;
    const matchesQuery = 
      item.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.observedValue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="evidence-library-container">
      {/* Page Header */}
      <div className="evidence-header-bar">
        <div>
          <h1 className="page-title">Evidence Library</h1>
          <p className="page-subtitle">
            Section 18: Searchable repository of authoritative engineering manuals, standardized lab certifications, and market telemetry.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="evidence-controls-row">
          <div className="evidence-search-input-wrap">
            <Search size={16} color="#AEB6C2" />
            <input 
              type="text" 
              className="evidence-search-input" 
              placeholder="Search by publisher, source document, or product..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="evidence-filter-tags">
            <button 
              className={`filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveFilter('ALL')}
            >
              All Sources ({allEvidence.length})
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'OFFICIAL_BRAND' ? 'active' : ''}`}
              onClick={() => setActiveFilter('OFFICIAL_BRAND')}
            >
              Official Brand
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'INDEPENDENT_LAB' ? 'active' : ''}`}
              onClick={() => setActiveFilter('INDEPENDENT_LAB')}
            >
              Independent Lab
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'RETAILER' ? 'active' : ''}`}
              onClick={() => setActiveFilter('RETAILER')}
            >
              Retailer Feeds
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'CONSUMER_OBSERVATION' ? 'active' : ''}`}
              onClick={() => setActiveFilter('CONSUMER_OBSERVATION')}
            >
              Consumer Telemetry
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="evidence-cards-grid">
        {filtered.map((item, idx) => (
          <div key={idx} className="evidence-library-item card">
            <div className="evidence-item-header">
              <span className={`src-badge ${item.sourceType.toLowerCase()}`}>
                {item.sourceType.replace('_', ' ')}
              </span>
              <span className="evidence-date mono">{item.retrievedDate}</span>
            </div>

            <div className="evidence-doc-title">
              {item.sourceName}
            </div>

            <div className="evidence-publisher mono">{item.publisher}</div>

            <div className="evidence-observed-strip">
              <span className="strip-lbl">Observed Value:</span>
              <span className="strip-val">{item.observedValue}</span>
            </div>

            <div className="evidence-conditions-box">
              <span className="cond-title">Test Protocol & Conditions:</span>
              <p className="cond-desc">{item.conditions}</p>
            </div>

            <div className="evidence-supports-row">
              <span className="supports-lbl">Related Claim:</span>
              <span className="supports-wording">“{item.claimWording}”</span>
            </div>

            <div className="evidence-item-footer">
              <span className="evidence-citation mono" title={item.citation}>
                {item.documentName || item.citation}
              </span>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onSelectClaim(item.claimId)}
              >
                <span>View Passport</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
