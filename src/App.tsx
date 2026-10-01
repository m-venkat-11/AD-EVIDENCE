import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import type { NavItem } from './components/Sidebar';
import { Header } from './components/Header';
import { SearchModal } from './components/SearchModal';
import { OverviewDashboard } from './components/OverviewDashboard';
import { VerifyContentStudio } from './components/VerifyContentStudio';
import { ClaimPassportView } from './components/ClaimPassportView';
import { ClaimEvidenceGraphView } from './components/ClaimEvidenceGraphView';
import { ConflictsView } from './components/ConflictsView';
import { TimelineView } from './components/TimelineView';
import { EvidenceLibraryView } from './components/EvidenceLibraryView';
import { ConsumerExperienceView } from './components/ConsumerExperienceView';
import { ReportsView } from './components/ReportsView';
import { ProjectsView } from './components/ProjectsView';
import { AlertsView } from './components/AlertsView';
import { DataSourcesView } from './components/DataSourcesView';
import { HelpView } from './components/HelpView';
import { PublicLandingView } from './components/PublicLandingView';
import { ConsumerReportModal } from './components/ConsumerReportModal';
import { BrandConsoleView } from './components/BrandConsoleView';
import { RegulatoryShieldView } from './components/RegulatoryShieldView';
import { EvaluationDashboard } from './components/EvaluationDashboard';

import { 
  INITIAL_CLAIM_PASSPORTS, 
  INITIAL_PRODUCTS, 
  INITIAL_TIMELINE_EVENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CONSUMER_OBSERVATIONS 
} from './data/mockData';
import type { 
  ClaimPassport, 
  Product, 
  TimelineEvent, 
  SystemNotification, 
  ConsumerObservation 
} from './types';
import './App.css';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // App Navigation & Mode
  const [appMode, setAppMode] = useState<'enterprise' | 'consumer' | 'landing'>('enterprise');
  const [currentNav, setCurrentNav] = useState<NavItem>('overview');

  // Active Database State - Persisted to LocalStorage or started in pristine state
  const [claims, setClaims] = useState<ClaimPassport[]>(() => {
    try {
      const saved = localStorage.getItem('ad_evidence_verified_claims');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ad_evidence_verified_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(() => {
    try {
      const saved = localStorage.getItem('ad_evidence_verified_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    try {
      const saved = localStorage.getItem('ad_evidence_verified_notifs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [consumerObservations, setConsumerObservations] = useState<ConsumerObservation[]>(INITIAL_CONSUMER_OBSERVATIONS);

  // Selected Claim
  const [selectedClaimId, setSelectedClaimId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ad_evidence_verified_claims');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed[0]?.id) return parsed[0].id;
      }
    } catch {}
    return '';
  });

  // Search Modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Consumer Report Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Fallback structures when no ad has been verified yet
  const fallbackClaim: ClaimPassport = {
    id: 'CLM-EMPTY',
    productId: 'prod-empty',
    productName: 'No Advertisement Verified',
    brandName: 'Brand',
    attribute: 'commercial_claim',
    advertisedWording: 'No active claims monitored yet. Verify an advertisement in the studio to generate passports.',
    normalizedValue: '0',
    unit: '',
    claimType: 'performance',
    conditions: [],
    status: 'UNDER_REVIEW',
    statusExplanation: 'Ingest advertising copy to generate empirical verification report.',
    fourQuestions: {
      whatClaimed: 'Awaiting content ingestion',
      whatEvidenceChecked: 'Awaiting evidence lookup',
      whatEvidenceSaid: 'Awaiting comparison',
      whyStatusChosen: 'Awaiting analysis'
    },
    firstSeenDate: 'Today',
    lastVerifiedDate: 'Today',
    freshnessPolicy: 'Dynamic',
    evidenceCoverage: { productIdentity: false, officialSpec: false, currentPrice: false, independentLab: false, consumerReports: false, c2paProvenance: false },
    sources: [],
    conflicts: [],
    travelOccurrences: [],
    regulatoryNotes: []
  };

  const activeClaim: ClaimPassport = claims.find(c => c.id === selectedClaimId) || claims[0] || fallbackClaim;
  const activeProduct: Product = products.find(p => p.id === activeClaim?.productId) || products[0] || {
    id: 'prod-empty',
    brandId: 'brand-empty',
    brandName: activeClaim.brandName || 'Brand',
    productName: activeClaim.productName || 'Audited Product',
    modelNumber: 'V1',
    gtin: 'GTIN-0000000000000',
    category: 'General',
    verifiedByGS1: false,
    officialDocUrl: 'https://specs.ad-evidence.org',
    specSummary: 'Awaiting advertisement verification',
    claimsCount: claims.length,
    activeConflicts: 0
  };

  // Reset workspace to verify a brand-new advertisement
  const handleResetWorkspace = () => {
    try {
      localStorage.removeItem('ad_evidence_verified_claims');
      localStorage.removeItem('ad_evidence_verified_products');
      localStorage.removeItem('ad_evidence_verified_events');
      localStorage.removeItem('ad_evidence_verified_notifs');
    } catch {}
    setClaims([]);
    setProducts([]);
    setTimelineEvents([]);
    setNotifications([]);
    setSelectedClaimId('');
    setCurrentNav('verify');
  };

  // Handler: Selecting a claim to inspect
  const handleSelectClaim = (claimId: string) => {
    setSelectedClaimId(claimId);
    if (appMode === 'landing') setAppMode('enterprise');
    setCurrentNav('claims');
  };

  // Handler: Re-checking claim freshness
  const handleRefreshFreshness = (claimId: string) => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          lastVerifiedDate: today
        };
      }
      return c;
    }));
  };

  // Handler: Updating official brand dispute response
  const handleUpdateBrandResponse = (claimId: string, responseContent: string) => {
    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          brandDisputeResponse: {
            author: `${activeProduct.brandName} Compliance Team`,
            date: new Date().toISOString(),
            responseContent,
            reviewedByPlatform: true
          }
        };
      }
      return c;
    }));
  };

  // Handler: Submitting structured consumer observation
  const handleAddConsumerObservation = (obs: ConsumerObservation) => {
    setConsumerObservations(prev => [obs, ...prev]);

    const newTlEvent: TimelineEvent = {
      id: `tl-${Date.now()}`,
      claimId: obs.claimId,
      date: 'Today',
      title: 'Consumer Telemetry Logged',
      description: `Verified purchaser observed ${obs.observedValue} under condition "${obs.conditions}".`,
      sourceType: 'CONSUMER_OBSERVATION',
      eventType: 'CONSUMER_OBSERVATION'
    };
    setTimelineEvents(prev => [newTlEvent, ...prev]);

    setClaims(prev => prev.map(c => {
      if (c.id === obs.claimId) {
        const updatedSources = c.sources.map(s => {
          if (s.sourceType === 'CONSUMER_OBSERVATION') {
            return {
              ...s,
              observedValue: `${obs.observedValue} (Latest entry by ${obs.userName})`
            };
          }
          return s;
        });
        return { ...c, sources: updatedSources };
      }
      return c;
    }));
  };

  // If in public landing page mode:
  if (appMode === 'landing') {
    return (
      <div className="landing-layout-wrapper">
        <header className="landing-top-nav">
          <div className="landing-logo">
            <span className="logo-bold">AD-EVIDENCE</span>
            <span className="logo-tag">See the Claim. See the Evidence.</span>
          </div>
          <div className="landing-nav-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setAppMode('consumer')}>
              Consumer Check
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setAppMode('enterprise')}>
              Enterprise Workspace
            </button>
          </div>
        </header>

        <PublicLandingView 
          onEnterEnterprise={() => setAppMode('enterprise')}
          onEnterConsumer={() => setAppMode('consumer')}
        />

        <footer className="landing-footer">
          <div className="footer-container">
            <span>© 2026 AD-EVIDENCE • The Evidence Layer for Modern Advertising</span>
            <div className="footer-links">
              <span onClick={() => setAppMode('enterprise')}>Brand Console</span>
              <span onClick={() => setAppMode('consumer')}>Consumer Check</span>
              <span onClick={() => { setAppMode('enterprise'); setCurrentNav('help'); }}>Methodology</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // If in simplified consumer mode:
  if (appMode === 'consumer') {
    return (
      <div className="consumer-layout-wrapper">
        <header className="consumer-top-header">
          <div className="consumer-logo" onClick={() => setAppMode('landing')}>
            <span className="logo-bold">AD-EVIDENCE</span>
            <span className="consumer-pill">CONSUMER</span>
          </div>
          <div className="consumer-top-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setAppMode('landing')}>
              Public Overview
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setAppMode('enterprise')}>
              Brand & Enterprise View
            </button>
          </div>
        </header>

        <main className="consumer-main-body">
          <ConsumerExperienceView 
            claim={activeClaim}
            onSubmitObservation={handleAddConsumerObservation}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        </main>

        {isReportModalOpen && (
          <ConsumerReportModal 
            claim={activeClaim}
            onClose={() => setIsReportModalOpen(false)}
            onSubmitObservation={handleAddConsumerObservation}
          />
        )}
      </div>
    );
  }

  // Standard Enterprise Workspace Mode (Default)
  return (
    <div className="enterprise-layout">
      {/* Persistent Left Sidebar */}
      <Sidebar 
        currentNav={currentNav}
        onNavigate={setCurrentNav}
        appMode={appMode}
        onSwitchMode={setAppMode}
        unreadAlertCount={notifications.filter(n => !n.read).length}
      />

      {/* Main Workspace Frame */}
      <div className="workspace-main-frame">
        {/* Global Header */}
        <Header 
          onOpenSearch={() => setIsSearchOpen(true)}
          notifications={notifications}
          onSelectClaim={handleSelectClaim}
          onOpenHelp={() => setCurrentNav('help')}
          theme={theme}
          onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          workspaceName={activeProduct?.productName && activeProduct.productName !== 'No Advertisement Verified' ? `${activeProduct.brandName} Verification Workspace` : 'Global Brand Assurance'}
          onNewVerification={() => setCurrentNav('verify')}
        />

        {/* Dynamic Route Content */}
        <main className="workspace-content-scroll">
          {currentNav === 'overview' && (
            <OverviewDashboard 
              claims={claims}
              timelineEvents={timelineEvents}
              onVerifyNew={() => setCurrentNav('verify')}
              onExploreGraph={() => setCurrentNav('graph')}
              onSelectClaim={handleSelectClaim}
            />
          )}

          {currentNav === 'claims' && (
            <ClaimPassportView 
              claim={activeClaim}
              product={activeProduct}
              onRefreshFreshness={handleRefreshFreshness}
              onUpdateBrandResponse={handleUpdateBrandResponse}
              onExploreInGraph={() => setCurrentNav('graph')}
            />
          )}

          {currentNav === 'graph' && (
            <ClaimEvidenceGraphView 
              claims={claims}
              product={activeProduct}
              onSelectClaim={handleSelectClaim}
            />
          )}

          {currentNav === 'verify' && (
            <VerifyContentStudio 
              onAnalyzeComplete={(newClaims, newProduct) => {
                if (newProduct) {
                  setProducts([newProduct]);
                  try {
                    localStorage.setItem('ad_evidence_verified_products', JSON.stringify([newProduct]));
                  } catch {}
                }
                if (newClaims && newClaims.length > 0) {
                  setClaims(newClaims);
                  setSelectedClaimId(newClaims[0].id);
                  try {
                    localStorage.setItem('ad_evidence_verified_claims', JSON.stringify(newClaims));
                  } catch {}

                  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                  const newEvents: TimelineEvent[] = newClaims.map((c, i) => ({
                    id: `tl-${Date.now()}-${i}`,
                    claimId: c.id,
                    date: today,
                    title: `Claim Verified: ${c.advertisedWording.slice(0, 45)}`,
                    description: `Status: ${c.status}. ${c.statusExplanation.slice(0, 90)}...`,
                    sourceType: 'SYSTEM',
                    eventType: c.status === 'CONTRADICTED' ? 'CONFLICT_DETECTED' : 'OFFICIAL_ADDED',
                    statusAfter: c.status
                  }));
                  setTimelineEvents(newEvents);
                  try {
                    localStorage.setItem('ad_evidence_verified_events', JSON.stringify(newEvents));
                  } catch {}

                  const newNotifs: SystemNotification[] = [{
                    id: `notif-${Date.now()}`,
                    date: today,
                    title: `Verification Complete: ${newProduct?.productName || 'New Advertisement'}`,
                    message: `Audited ${newClaims.length} commercial claims.`,
                    severity: newClaims.some(c => c.status === 'CONTRADICTED') ? 'CRITICAL' : 'INFO',
                    read: false
                  }];
                  setNotifications(newNotifs);
                  try {
                    localStorage.setItem('ad_evidence_verified_notifs', JSON.stringify(newNotifs));
                  } catch {}
                }
              }}
              onOpenPassport={(claimId) => {
                setSelectedClaimId(claimId);
                setCurrentNav('claims');
              }}
            />
          )}

          {currentNav === 'evidence' && (
            <EvidenceLibraryView 
              claims={claims}
              onSelectClaim={handleSelectClaim}
            />
          )}

          {currentNav === 'conflicts' && (
            <ConflictsView 
              claims={claims}
              onSelectClaim={handleSelectClaim}
            />
          )}

          {currentNav === 'timeline' && (
            <TimelineView 
              timelineEvents={timelineEvents}
              activeClaim={activeClaim}
              onSelectClaim={handleSelectClaim}
            />
          )}

          {currentNav === 'reports' && (
            <ReportsView 
              claims={claims}
            />
          )}

          {currentNav === 'monitoring' && (
            <ConflictsView 
              claims={claims}
              onSelectClaim={handleSelectClaim}
            />
          )}

          {currentNav === 'projects' && (
            <ProjectsView 
              onOpenProject={(projId) => setCurrentNav('claims')}
            />
          )}

          {currentNav === 'saved' && (
            <ClaimPassportView 
              claim={activeClaim}
              product={activeProduct}
              onRefreshFreshness={handleRefreshFreshness}
              onUpdateBrandResponse={handleUpdateBrandResponse}
              onExploreInGraph={() => setCurrentNav('graph')}
            />
          )}

          {currentNav === 'brand' && (
            <BrandConsoleView 
              products={products}
              currentProduct={activeProduct}
              claim={activeClaim}
              onUpdateDispute={(resp) => handleUpdateBrandResponse(activeClaim.id, resp)}
            />
          )}

          {currentNav === 'alerts' && (
            <AlertsView 
              notifications={notifications}
              onSelectClaim={handleSelectClaim}
            />
          )}

          {currentNav === 'evaluation' && (
            <EvaluationDashboard />
          )}

          {currentNav === 'policies' && (
            <RegulatoryShieldView />
          )}

          {currentNav === 'sources' && (
            <DataSourcesView />
          )}

          {currentNav === 'settings' && (
            <HelpView />
          )}

          {currentNav === 'help' && (
            <HelpView />
          )}
        </main>
      </div>

      {/* Global ⌘K Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        claims={claims}
        products={products}
        onSelectClaim={handleSelectClaim}
      />

      {/* Structured Consumer Observation Modal */}
      {isReportModalOpen && (
        <ConsumerReportModal 
          claim={activeClaim}
          onClose={() => setIsReportModalOpen(false)}
          onSubmitObservation={handleAddConsumerObservation}
        />
      )}
    </div>
  );
}

export default App;
