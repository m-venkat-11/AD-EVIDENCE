import React from 'react';
import { FolderKanban, Plus, FileCheck2, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import type { ClaimPassport, Product, VerificationProject } from '../types';

interface ProjectsViewProps {
  claims?: ClaimPassport[];
  products?: Product[];
  onOpenProject: (projectId: string) => void;
  onVerifyNew?: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ 
  claims = [], 
  products = [], 
  onOpenProject,
  onVerifyNew 
}) => {
  // Derive projects dynamically from verified claims and products
  const dynamicProjects: VerificationProject[] = React.useMemo(() => {
    if (!claims || claims.length === 0) return [];

    const grouped: { [key: string]: { claims: ClaimPassport[]; product?: Product } } = {};
    claims.forEach(c => {
      const pId = c.productId || 'default-prod';
      if (!grouped[pId]) {
        grouped[pId] = {
          claims: [],
          product: products.find(p => p.id === pId)
        };
      }
      grouped[pId].claims.push(c);
    });

    return Object.entries(grouped).map(([pId, data], idx) => {
      const pClaims = data.claims;
      const conflicts = pClaims.filter(c => c.status === 'CONTRADICTED').length;
      const brand = data.product?.brandName || pClaims[0]?.brandName || 'Brand';
      const prodName = data.product?.productName || pClaims[0]?.productName || 'Campaign';

      return {
        id: `proj-${idx + 1}`,
        name: `${prodName} Launch Verification`,
        brandName: brand,
        status: (conflicts > 0 ? 'NEEDS_REVIEW' : 'ACTIVE') as VerificationProject['status'],
        claimsCount: pClaims.length,
        conflictsCount: conflicts,
        productCount: 1,
        lastActivity: 'Today'
      };
    });
  }, [claims, products]);

  return (
    <div className="projects-page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Brand Verification Projects</h1>
          <p className="page-subtitle">
            Manage and audit campaign creative groups across brands and international markets.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onVerifyNew}>
          <Plus size={15} />
          <span>New Verification Project</span>
        </button>
      </div>

      {dynamicProjects.length === 0 ? (
        <div className="card" style={{ padding: '60px 24px', textAlign: 'center', margin: '20px 0' }}>
          <FolderKanban size={48} color="#00E5FF" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F5F7FF', marginBottom: '8px' }}>
            No Verification Projects Yet
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#AEB6C2', maxWidth: '520px', margin: '0 auto 20px', lineHeight: 1.6 }}>
            Verify your first advertisement to dynamically generate campaign projects, monitor claim drift, and manage compliance audits.
          </p>
          <button className="btn btn-primary" onClick={onVerifyNew} style={{ margin: '0 auto' }}>
            <Plus size={16} />
            <span>Verify An Advertisement</span>
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {dynamicProjects.map((proj) => (
            <div key={proj.id} className="project-card card" onClick={() => onOpenProject(proj.id)}>
              <div className="project-top-row">
                <span className="project-id-tag mono">{proj.id.toUpperCase()}</span>
                <span className={`status-pill ${proj.status}`}>
                  {proj.status.replace('_', ' ')}
                </span>
              </div>

              <h3 className="project-name-title">{proj.name}</h3>
              <span className="project-brand-meta">{proj.brandName}</span>

              <div className="project-stats-grid">
                <div className="proj-stat-box">
                  <span className="proj-stat-num">{proj.claimsCount}</span>
                  <span className="proj-stat-lbl">Claims Monitored</span>
                </div>
                <div className="proj-stat-box">
                  <span className={`proj-stat-num ${proj.conflictsCount > 0 ? 'text-red' : 'text-green'}`}>
                    {proj.conflictsCount}
                  </span>
                  <span className="proj-stat-lbl">Conflicts Caught</span>
                </div>
                <div className="proj-stat-box">
                  <span className="proj-stat-num">{proj.productCount}</span>
                  <span className="proj-stat-lbl">Products</span>
                </div>
              </div>

              <div className="project-footer-row">
                <span className="proj-activity-text">Updated: {proj.lastActivity}</span>
                <div className="proj-open-link">
                  <span>Open Project</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
