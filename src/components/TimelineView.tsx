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
import type { TimelineEvent, ClaimPassport } from '../types';

interface TimelineViewProps {
  timelineEvents: TimelineEvent[];
  activeClaim?: ClaimPassport;
  onSelectClaim: (claimId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timelineEvents,
  activeClaim,
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
          <span>Target: {activeClaim ? `${activeClaim.id} (${activeClaim.advertisedWording.slice(0, 30)}...)` : 'Audit Trail Feed'}</span>
        </div>
      </div>

      {/* Vertical Timeline Card */}
      <div className="timeline-main-card card">
        {timelineEvents.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#AEB6C2' }}>
            <Clock size={36} color="#3D5AFE" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#F5F7FF', marginBottom: '6px' }}>No Claim History Logged</h3>
            <p style={{ fontSize: '0.85rem' }}>Verify an advertisement to start tracking its evidence lifecycle over time.</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};
