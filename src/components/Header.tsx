import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Building2, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle,
  SlidersHorizontal,
  X
} from 'lucide-react';
import type { SystemNotification } from '../types';

interface HeaderProps {
  onOpenSearch: () => void;
  notifications: SystemNotification[];
  onSelectClaim: (claimId: string) => void;
  onOpenHelp: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  notifications,
  onSelectClaim,
  onOpenHelp,
  theme = 'dark',
  onToggleTheme
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="global-header">
      {/* Left: Workspace Selector */}
      <div className="header-left">
        <div className="workspace-dropdown-trigger">
          <div className="workspace-icon">
            <Building2 size={16} color="var(--text-primary)" />
          </div>
          <div className="workspace-info">
            <span className="workspace-label">Workspace</span>
            <span className="workspace-name">Global Brand Assurance</span>
          </div>
          <ChevronDown size={14} color="var(--text-secondary)" />
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

      {/* Right: Engine Status, Notifications, Help, Profile */}
      <div className="header-right">
        {/* Verification & Trust Engine Live Status Badge */}
        <div 
          className="engine-status-badge" 
          title="Multi-Source Verification Engine Active (Gemini Grounding v2.4 + Deterministic Rule Engine + C2PA Provenance)"
        >
          <span className="pulse-indicator-dot"></span>
          <span className="engine-status-text">Evidence Engine Active</span>
          <span className="engine-version-tag">v2.4</span>
        </div>
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
                {notifications.map((notif) => (
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
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help / Methodology */}
        <button 
          className="header-icon-btn" 
          onClick={onOpenHelp}
          title="Methodology & Documentation"
        >
          <HelpCircle size={18} color="var(--text-secondary)" />
        </button>

        {/* Profile Avatar */}
        <div className="header-profile-box">
          <div className="header-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={14} color="#00E5FF" />
          </div>
          <span className="header-status-indicator"></span>
        </div>
      </div>
    </header>
  );
};
