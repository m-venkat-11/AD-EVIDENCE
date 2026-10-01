import React from 'react';
import { 
  Clock, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Megaphone, 
  AlertTriangle, 
  FileCheck2,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import type { TimelineEvent } from '../types';

interface TimelineViewProps {
  timelineEvents: TimelineEvent[];
  onSelectClaim: (claimId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timelineEvents,
  onSelectClaim
}) => {
  return (
    <div className="timeline-page-container">
      {/* Page Header */}
      <div className="timeline-header-bar">
        <div>
          <h1 className="page-title">Claim History & Evolution</h1>
          <p className="page-subtitle">
            Section 12: <em>“Claims change over time.”</em> Track how commercial assertions evolve from initial creative briefs through official releases and real-world testing.
          </p>
        </div>

        <div className="timeline-badge-pill">
          <Clock size={16} color="#3D5AFE" />
          <span>Target Claim: CLM-82917 (50h Battery Life)</span>
        </div>
      </div>

      {/* Vertical Timeline Card */}
      <div className="timeline-main-card card">
        <div className="timeline-vertical-stream">
          {timelineEvents.map((evt, idx) => (
            <div key={evt.id} className="timeline-entry-row">
              {/* Left Date Column */}
              <div className="timeline-date-col">
                <span className="timeline-date-bold mono">{evt.date}</span>
                <span className="timeline-index mono">Step #{idx + 1}</span>
              </div>

              {/* Center Dot & Track */}
              <div className="timeline-node-track">
                <div className={`timeline-dot ${evt.eventType.toLowerCase()}`}>
                  {evt.eventType === 'CONFLICT_DETECTED' ? (
                    <AlertTriangle size={14} color="#FF2FA3" />
                  ) : evt.eventType === 'OFFICIAL_ADDED' ? (
                    <CheckCircle2 size={14} color="#3D5AFE" />
                  ) : evt.eventType === 'LAB_ADDED' ? (
                    <Database size={14} color="#FF2FA3" />
                  ) : evt.eventType === 'AD_PUBLISHED' ? (
                    <Megaphone size={14} color="#FF8A1E" />
                  ) : (
                    <FileCheck2 size={14} color="#3D5AFE" />
                  )}
                </div>
                {idx < timelineEvents.length - 1 && <div className="timeline-stem-line"></div>}
              </div>

              {/* Right Event Content */}
              <div className="timeline-content-box">
                <div className="timeline-event-header">
                  <h3 className="timeline-event-title">{evt.title}</h3>
                  {evt.statusAfter && (
                    <span className={`status-pill ${evt.statusAfter}`}>
                      {evt.statusAfter.replace('_', ' ')}
                    </span>
                  )}
                </div>

                <p className="timeline-event-desc">{evt.description}</p>

                <div className="timeline-event-meta">
                  <span className="meta-tag">Source Class: {evt.sourceType.replace('_', ' ')}</span>
                  <button 
                    className="meta-action-link"
                    onClick={() => onSelectClaim(evt.claimId)}
                  >
                    <span>Inspect Claim Passport</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
