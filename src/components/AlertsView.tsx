import React from 'react';
import { Bell, AlertTriangle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import type { SystemNotification } from '../types';

interface AlertsViewProps {
  notifications: SystemNotification[];
  onSelectClaim: (claimId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  notifications,
  onSelectClaim
}) => {
  return (
    <div className="alerts-page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Monitoring Alerts & Telemetry</h1>
          <p className="page-subtitle">
            Section 22: Real-time conflict notifications, pricing changes, and specification updates.
          </p>
        </div>
      </div>

      <div className="alerts-stack-card card">
        <div className="alerts-stack-list">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`alert-feed-item ${!notif.read ? 'unread' : ''}`}
              onClick={() => notif.claimId && onSelectClaim(notif.claimId)}
            >
              <div className="alert-icon-col">
                {notif.severity === 'CRITICAL' ? (
                  <AlertTriangle size={18} color="#FF2FA3" />
                ) : notif.severity === 'WARNING' ? (
                  <AlertTriangle size={18} color="#FF8A1E" />
                ) : (
                  <CheckCircle2 size={18} color="#3D5AFE" />
                )}
              </div>

              <div className="alert-content-col">
                <div className="alert-top-line">
                  <span className="alert-item-title">{notif.title}</span>
                  <span className="alert-item-time mono">{notif.date}</span>
                </div>
                <p className="alert-item-msg">{notif.message}</p>
                {notif.claimId && (
                  <span className="alert-claim-anchor mono">Linked Passport: {notif.claimId}</span>
                )}
              </div>

              <div className="alert-action-col">
                <ArrowRight size={16} color="#AEB6C2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
