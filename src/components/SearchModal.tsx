import React, { useState, useEffect } from 'react';
import { Search, X, FileCheck2, Package, Building2, Database, Megaphone, ArrowRight } from 'lucide-react';
import type { ClaimPassport, Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  claims: ClaimPassport[];
  products: Product[];
  onSelectClaim: (claimId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  claims,
  products,
  onSelectClaim
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CLAIMS' | 'PRODUCTS' | 'EVIDENCE'>('ALL');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter logic
  const filteredClaims = claims.filter(c => 
    c.advertisedWording.toLowerCase().includes(query.toLowerCase()) ||
    c.id.toLowerCase().includes(query.toLowerCase()) ||
    c.productName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    p.productName.toLowerCase().includes(query.toLowerCase()) ||
    p.brandName.toLowerCase().includes(query.toLowerCase()) ||
    p.modelNumber.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal-box card" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className="search-input-header">
          <Search size={20} color="#AEB6C2" />
          <input 
            type="text" 
            className="search-main-input" 
            placeholder="Search claims, products, brands, evidence, sources..." 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="search-filters-bar">
          <button 
            className={`filter-chip ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            All Results
          </button>
          <button 
            className={`filter-chip ${activeFilter === 'CLAIMS' ? 'active' : ''}`}
            onClick={() => setActiveFilter('CLAIMS')}
          >
            Claims ({filteredClaims.length})
          </button>
          <button 
            className={`filter-chip ${activeFilter === 'PRODUCTS' ? 'active' : ''}`}
            onClick={() => setActiveFilter('PRODUCTS')}
          >
            Products ({filteredProducts.length})
          </button>
        </div>

        {/* Search Results List */}
        <div className="search-results-container">
          {/* Claims Results */}
          {(activeFilter === 'ALL' || activeFilter === 'CLAIMS') && filteredClaims.length > 0 && (
            <div className="result-category-group">
              <div className="result-category-label">
                <FileCheck2 size={14} />
                <span>Commercial Claims ({filteredClaims.length})</span>
              </div>
              {filteredClaims.map((claim) => (
                <div 
                  key={claim.id} 
                  className="search-result-row"
                  onClick={() => {
                    onSelectClaim(claim.id);
                    onClose();
                  }}
                >
                  <div className="result-row-left">
                    <span className="result-mono-id">{claim.id}</span>
                    <span className="result-title">“{claim.advertisedWording}”</span>
                    <span className="result-meta-sub">{claim.productName}</span>
                  </div>
                  <div className="result-row-right">
                    <span className={`status-pill ${claim.status}`}>{claim.status.replace('_', ' ')}</span>
                    <ArrowRight size={14} color="#AEB6C2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products Results */}
          {(activeFilter === 'ALL' || activeFilter === 'PRODUCTS') && filteredProducts.length > 0 && (
            <div className="result-category-group">
              <div className="result-category-label">
                <Package size={14} />
                <span>Monitored Products ({filteredProducts.length})</span>
              </div>
              {filteredProducts.map((prod) => (
                <div 
                  key={prod.id} 
                  className="search-result-row"
                  onClick={() => {
                    const firstClaim = claims.find(c => c.productId === prod.id);
                    if (firstClaim) onSelectClaim(firstClaim.id);
                    onClose();
                  }}
                >
                  <div className="result-row-left">
                    <span className="result-title">{prod.productName}</span>
                    <span className="result-meta-sub">{prod.brandName} • Model {prod.modelNumber}</span>
                  </div>
                  <div className="result-row-right">
                    <span className="badge-claims-count">{prod.claimsCount} claims tracked</span>
                    <ArrowRight size={14} color="#AEB6C2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredClaims.length === 0 && filteredProducts.length === 0 && (
            <div className="search-empty-state">
              <p>No results found matching "<strong>{query}</strong>"</p>
              <span className="empty-tip">Try searching for "battery", "serum", "price", or a claim ID like "CLM-82917".</span>
            </div>
          )}
        </div>

        {/* Search Modal Footer */}
        <div className="search-modal-footer">
          <span className="footer-tip">Tip: Press <kbd>ESC</kbd> to exit, <kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
          <span className="footer-brand">AD-EVIDENCE Search Index</span>
        </div>
      </div>
    </div>
  );
};
