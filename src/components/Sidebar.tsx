import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  Share2, 
  ShieldCheck, 
  Database, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Activity, 
  FolderKanban, 
  Bookmark, 
  Bell, 
  Server, 
  Settings, 
  HelpCircle,
  Building,
  User,
  ExternalLink,
  Search,
  Scale,
  BarChart3
} from 'lucide-react';

export type NavItem = 
  | 'overview' 
  | 'claims' 
  | 'graph' 
  | 'verify' 
  | 'brand'
  | 'evidence' 
  | 'conflicts' 
  | 'timeline' 
  | 'reports' 
  | 'monitoring'
  | 'projects'
  | 'saved'
  | 'alerts'
  | 'evaluation'
  | 'policies'
  | 'sources'
  | 'settings'
  | 'help';

interface SidebarProps {
  currentNav: NavItem;
  onNavigate: (nav: NavItem) => void;
  appMode: 'enterprise' | 'consumer' | 'landing';
  onSwitchMode: (mode: 'enterprise' | 'consumer' | 'landing') => void;
  unreadAlertCount: number;
  conflictCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentNav,
  onNavigate,
  appMode,
  onSwitchMode,
  unreadAlertCount,
  conflictCount = 0
}) => {
  return (
    <aside className="sidebar-container">
      {/* Brand & Logo Header */}
      <div className="sidebar-brand-box">
        <div className="sidebar-brand-top">
          <div className="brand-badge-icon">
            <ShieldCheck size={20} color="#00E5FF" />
          </div>
          <div>
            <div className="sidebar-logo-title">
              <span className="brand-ad">AD</span>
              <span className="brand-evidence">-EVIDENCE</span>
            </div>
            <div className="sidebar-logo-tagline">See the Claim. See the Evidence.</div>
          </div>
        </div>
      </div>

      {/* Mode Switcher Pill */}
      <div className="sidebar-mode-toggle">
        <button 
          className={`mode-btn ${appMode === 'enterprise' ? 'active' : ''}`}
          onClick={() => onSwitchMode('enterprise')}
          title="Full Enterprise Compliance Workspace"
        >
          Enterprise
        </button>
        <button 
          className={`mode-btn ${appMode === 'consumer' ? 'active' : ''}`}
          onClick={() => onSwitchMode('consumer')}
          title="Simple Consumer Verification"
        >
          Consumer
        </button>
        <button 
          className={`mode-btn ${appMode === 'landing' ? 'active' : ''}`}
          onClick={() => onSwitchMode('landing')}
          title="Product Landing Overview"
        >
          Public
        </button>
      </div>

      {/* Navigation Scrollable Area */}
      <div className="sidebar-nav-scroll">
        {/* Section 1: Core Navigation */}
        <div className="nav-group">
          <div className="nav-group-title">VERIFICATION CORE</div>

          <button 
            className={`nav-link ${currentNav === 'overview' ? 'active' : ''}`}
            onClick={() => onNavigate('overview')}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>

          <button 
            className={`nav-link ${currentNav === 'claims' ? 'active' : ''}`}
            onClick={() => onNavigate('claims')}
          >
            <FileCheck2 size={18} />
            <span>Claims</span>
          </button>

          <button 
            className={`nav-link ${currentNav === 'graph' ? 'active' : ''}`}
            onClick={() => onNavigate('graph')}
          >
            <Share2 size={18} />
            <span>Claim Graph</span>
          </button>

          <button 
            className={`nav-link ${currentNav === 'verify' ? 'active' : ''}`}
            onClick={() => onNavigate('verify')}
          >
            <ShieldCheck size={18} />
            <span>Verification</span>
            <span className="badge-nav-action">+ New</span>
          </button>

          <button 
            className={`nav-link ${currentNav === 'brand' ? 'active' : ''}`}
            onClick={() => onNavigate('brand')}
          >
            <Building size={18} />
            <span>Brand Console</span>
          </button>

          <button 
            className={`nav-link ${currentNav === 'evidence' ? 'active' : ''}`}
            onClick={() => onNavigate('evidence')}
          >
            <Database size={18} />
            <span>Evidence</span>
          </button>

          <button 
            className={`nav-link ${currentNav === 'conflicts' ? 'active' : ''}`}
            onClick={() => onNavigate('conflicts')}
          >
            <AlertTriangle size={18} />
            <span>Conflicts</span>
            {conflictCount > 0 && (
              <span className="badge-nav-alert">{conflictCount}</span>
            )}
          </button>

          <button 
            className={`nav-link ${currentNav === 'timeline' ? 'active' : ''}`}
            onClick={() => onNavigate('timeline')}
          >
            <Clock size={18} />
            <span>Timeline</span>
          </button>

          <button 
            className={`nav-link ${currentNav === 'reports' ? 'active' : ''}`}
            onClick={() => onNavigate('reports')}
          >
            <FileText size={18} />
            <span>Reports</span>
          </button>

          <button 
            className={`nav-link ${currentNav === 'monitoring' ? 'active' : ''}`}
            onClick={() => onNavigate('monitoring')}
          >
            <Activity size={18} />
            <span>Monitoring</span>
          </button>
        </div>

        {/* Section 2: Workspace */}
        <div className="nav-group">
          <div className="nav-group-title">WORKSPACE</div>

          <button 
            className={`nav-link ${currentNav === 'projects' ? 'active' : ''}`}
            onClick={() => onNavigate('projects')}
          >
            <FolderKanban size={18} />
            <span>Projects</span>
          </button>

          <button 
            className={`nav-link ${currentNav === 'saved' ? 'active' : ''}`}
            onClick={() => onNavigate('saved')}
          >
            <Bookmark size={18} />
            <span>Saved Claims</span>
          </button>

          <button 
            className={`nav-link ${currentNav === 'alerts' ? 'active' : ''}`}
            onClick={() => onNavigate('alerts')}
          >
            <Bell size={18} />
            <span>Alerts</span>
            {unreadAlertCount > 0 && (
              <span className="badge-nav-count">{unreadAlertCount}</span>
            )}
          </button>

          <button 
            className={`nav-link ${currentNav === 'evaluation' ? 'active' : ''}`}
            onClick={() => onNavigate('evaluation')}
          >
            <BarChart3 size={18} />
            <span>Evaluation Suite</span>
          </button>
        </div>

        {/* Section 3: System */}
        <div className="nav-group">
          <div className="nav-group-title">SYSTEM</div>

          <button 
            className={`nav-link ${currentNav === 'policies' ? 'active' : ''}`}
            onClick={() => onNavigate('policies')}
          >
            <Scale size={18} />
            <span>Regulatory Shield</span>
          </button>

          <button 
            className={`nav-link ${currentNav === 'sources' ? 'active' : ''}`}
            onClick={() => onNavigate('sources')}
          >
            <Server size={18} />
            <span>Data Sources</span>
          </button>

          <button 
            className={`nav-link ${currentNav === 'settings' ? 'active' : ''}`}
            onClick={() => onNavigate('settings')}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <button 
            className={`nav-link ${currentNav === 'help' ? 'active' : ''}`}
            onClick={() => onNavigate('help')}
          >
            <HelpCircle size={18} />
            <span>Help & Specs</span>
          </button>
        </div>
      </div>

      {/* Sidebar Footer User Profile */}
      <div className="sidebar-footer-profile">
        <div className="user-avatar">
          <ShieldCheck size={16} color="#00E5FF" />
        </div>
        <div className="user-details">
          <div className="user-name">Admin Workspace</div>
          <div className="user-role">Compliance & Verification</div>
        </div>
      </div>
    </aside>
  );
};
