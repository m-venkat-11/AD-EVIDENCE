import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  X 
} from 'lucide-react';
import type { SystemNotification } from '../types';

interface HeaderProps {
  onOpenSearch: () => void;
  notifications: SystemNotification[];
  onSelectClaim: (claimId: string) => void;
  onOpenHelp: () => void;
  workspaceName?: string;
  onReplayIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  notifications,
  onSelectClaim,
  workspaceName = 'Global Brand Assurance',
  onReplayIntro
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="global-header">
      {/* Left: Active Workspace Badge */}
      <div className="header-left">
        <div 
          className="workspace-badge-box" 
          title="Active Verification Workspace"
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div className="workspace-icon" style={{ background: 'rgba(0, 229, 255, 0.1)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={16} color="var(--brand-cyan, #00E5FF)" />
          </div>
          <div className="workspace-info">
            <span className="workspace-label" style={{ fontSize: '0.68rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary, #94A3B8)', display: 'block' }}>
              Active Workspace
            </span>
            <span className="workspace-name" style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary, #F5F7FF)' }}>
              {workspaceName}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar with ⌘K */}
      <div className="header-center">
        <button className="global-search-trigger" onClick={onOpenSearch}>
          <Search size={16} color="var(--text-secondary)" />
          <span className="search-placeholder">Search claims, products, evidence, sources...</span>
          <span className="search-shortcut">
            <kbd>⌘</kbd><kbd>K</kbd>
          </span>
        </button>
      </div>

      {/* Right: Engine Status, Notifications, Theme Toggle, + Verify Action */}
      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Verification Engine Active Pill */}
        <div 
          className="engine-status-badge" 
          title="Multi-Source Verification Engine Active (Gemini Grounding v2.4 + Deterministic Rule Engine + C2PA Provenance)"
        >
          <span className="pulse-indicator-dot"></span>
          <span className="engine-status-text">Evidence Engine Active</span>
          <span className="engine-version-tag">v2.4</span>
        </div>

        {/* 3D Intro Animation Replay Trigger */}
        {onReplayIntro && (
          <button 
            className="intro-replay-trigger-btn"
            onClick={onReplayIntro}
            title="Play 3D Holographic Title Intro"
            style={{
              background: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid rgba(0, 229, 255, 0.35)',
              color: '#00E5FF',
              padding: '6px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
          >
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 8px #00E5FF' }}></span>
            <span>3D Intro</span>
          </button>
        )}

        {/* Notifications Popover Trigger */}
        <div className="relative-container">
          <button 
            className="header-icon-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            title="System Alerts & Notifications"
          >
            <Bell size={18} color="var(--text-secondary)" />
            {unreadCount > 0 && <span className="unread-dot"></span>}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown card">
              <div className="notifications-header">
                <span className="notif-title">Alerts & Notifications</span>
                <button 
                  className="close-notif-btn" 
                  onClick={() => setShowNotifications(false)}
                >
                  <X size={14} />
                </button>
              </div>

              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary, #94A3B8)', fontSize: '0.85rem' }}>
                    No alerts pending in active workspace
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${!notif.read ? 'unread' : ''}`}
                      onClick={() => {
                        if (notif.claimId) onSelectClaim(notif.claimId);
                        setShowNotifications(false);
                      }}
                    >
                      <div className="notif-icon-col">
                        {notif.severity === 'CRITICAL' ? (
                          <AlertTriangle size={15} color="#FF2FA3" />
                        ) : notif.severity === 'WARNING' ? (
                          <AlertTriangle size={15} color="#FF8A1E" />
                        ) : (
                          <CheckCircle2 size={15} color="#00E5FF" />
                        )}
                      </div>
                      <div className="notif-content-col">
                        <div className="notif-item-title">{notif.title}</div>
                        <div className="notif-item-msg">{notif.message}</div>
                        <div className="notif-item-time">{notif.date}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
