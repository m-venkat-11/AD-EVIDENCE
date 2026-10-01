import React from 'react';
import { FolderKanban, Plus, FileCheck2, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { INITIAL_PROJECTS } from '../data/mockData';
import type { VerificationProject } from '../types';

interface ProjectsViewProps {
  onOpenProject: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onOpenProject }) => {
  return (
    <div className="projects-page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Brand Verification Projects</h1>
          <p className="page-subtitle">
            Section 15: Manage and audit campaign creative groups across brands and international markets.
          </p>
        </div>
        <button className="btn btn-primary btn-sm">
          <Plus size={15} />
          <span>New Verification Project</span>
        </button>
      </div>

      <div className="projects-grid">
        {INITIAL_PROJECTS.map((proj) => (
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
                <span className="proj-stat-num text-red">{proj.conflictsCount}</span>
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
    </div>
  );
};
