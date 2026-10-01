import React, { useState } from 'react';
import { 
  Settings, 
  Cpu, 
  ShieldCheck, 
  Sliders, 
  SlidersHorizontal, 
  Database, 
  Trash2, 
  Download, 
  CheckCircle2, 
  RefreshCw, 
  Moon, 
  Sun, 
  Globe, 
  Key, 
  Lock, 
  Sparkles, 
  AlertTriangle,
  Server
} from 'lucide-react';
import type { ClaimPassport, Product } from '../types';

interface SettingsViewProps {
  claims: ClaimPassport[];
  product: Product;
  workspaceName: string;
  onUpdateWorkspaceName?: (name: string) => void;
  onResetWorkspace: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  claims,
  product,
  workspaceName,
  onUpdateWorkspaceName,
  onResetWorkspace
}) => {
  // Local state for configuration
  const [activeWorkspace, setActiveWorkspace] = useState(workspaceName);
  const [numericTolerance, setNumericTolerance] = useState(5);
  const [searchGroundingEnabled, setSearchGroundingEnabled] = useState(true);
  const [c2paEnabled, setC2paEnabled] = useState(true);
  const [superlativeStrictness, setSuperlativeStrictness] = useState('strict');
  const [freshnessWindow, setFreshnessWindow] = useState('30');
  const [showSaveNotice, setShowSaveNotice] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const handleSaveSettings = () => {
    if (onUpdateWorkspaceName && activeWorkspace.trim()) {
      onUpdateWorkspaceName(activeWorkspace.trim());
    }
    setShowSaveNotice(true);
    setTimeout(() => setShowSaveNotice(false), 3000);
  };

  const handleExportData = () => {
    setIsExporting(true);
    try {
      const exportObject = {
        exportDate: new Date().toISOString(),
        workspace: activeWorkspace,
        product,
        claimsCount: claims.length,
        claims,
        toleranceConfig: {
          numericTolerancePercent: numericTolerance,
          superlativeStrictness,
          freshnessWindowDays: freshnessWindow,
          searchGroundingEnabled,
          c2paEnabled
        }
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `ad-evidence-workspace-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Export failed', e);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  const handleConfirmClear = () => {
    onResetWorkspace();
    setConfirmClearOpen(false);
  };

  return (
    <div className="settings-page-container" style={{ padding: '24px 32px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Page Title & Status */}
      <div className="page-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0, 229, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-cyan, #00E5FF)' }}>
              <Settings size={20} />
            </div>
            <h1 className="page-title" style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>
              System & Verification Settings
            </h1>
          </div>
          <p className="page-subtitle" style={{ color: 'var(--text-secondary, #94A3B8)', marginTop: '6px', fontSize: '0.9rem' }}>
            Configure the multi-source AI verification pipeline, deterministic tolerance thresholds, and workspace storage.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {showSaveNotice && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00E676', fontSize: '0.85rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} /> Preferences Saved
            </span>
          )}
          <button 
            className="btn btn-primary btn-sm"
            onClick={handleSaveSettings}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ShieldCheck size={15} />
            <span>Apply Settings</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
        
        {/* Card 1: AI Verification Engine & Providers */}
        <div className="card" style={{ padding: '22px', borderRadius: '12px', background: 'var(--card-bg, #0F131E)', border: '1px solid var(--border-color, rgba(255,255,255,0.08))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))', paddingBottom: '12px' }}>
            <Cpu size={18} color="var(--brand-cyan, #00E5FF)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>AI Verification Engine (Pipeline)</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Primary Provider */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Google Gemini Flash v2.4</span>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(0, 229, 255, 0.15)', color: '#00E5FF', fontWeight: 700 }}>
                    ACTIVE PRIMARY
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #94A3B8)', marginTop: '3px' }}>
                  Multimodal claim extraction, entity resolution & semantic decomposition
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00E676', fontSize: '0.8rem', fontWeight: 600 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00E676', display: 'inline-block' }}></span>
                Connected
              </div>
            </div>

            {/* Google Search Grounding */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={15} color="#4361EE" />
                  <span>Google Search Live Grounding</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #94A3B8)', marginTop: '3px' }}>
                  Queries real-world official datasheets, retail listings & benchmark databases
                </div>
              </div>
              <button 
                className={`btn btn-sm ${searchGroundingEnabled ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSearchGroundingEnabled(!searchGroundingEnabled)}
                style={{ padding: '4px 12px', fontSize: '0.78rem' }}
              >
                {searchGroundingEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Secondary Cascade Provider */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Groq (Meta Llama 3.3 70B Versatile)</span>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255, 138, 30, 0.15)', color: '#FF8A1E', fontWeight: 700 }}>
                    FAILOVER
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #94A3B8)', marginTop: '3px' }}>
                  Ultra-low latency fallback cascade if primary API reaches rate limit
                </div>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #94A3B8)' }}>Standby</span>
            </div>

            {/* C2PA Provenance Inspection */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} color="#00E5FF" />
                  <span>C2PA Content Credentials & SynthID</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #94A3B8)', marginTop: '3px' }}>
                  Inspects cryptographic manifests, synthetic media origins & generative disclaimers
                </div>
              </div>
              <button 
                className={`btn btn-sm ${c2paEnabled ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setC2paEnabled(!c2paEnabled)}
                style={{ padding: '4px 12px', fontSize: '0.78rem' }}
              >
                {c2paEnabled ? 'Active' : 'Bypass'}
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Deterministic Rule Engine Thresholds */}
        <div className="card" style={{ padding: '22px', borderRadius: '12px', background: 'var(--card-bg, #0F131E)', border: '1px solid var(--border-color, rgba(255,255,255,0.08))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))', paddingBottom: '12px' }}>
            <SlidersHorizontal size={18} color="var(--brand-pink, #FF2FA3)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Deterministic Rule Thresholds</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Numeric Tolerance Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Numerical Tolerance Margin:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-cyan, #00E5FF)' }}>
                  ±{numericTolerance}%
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="1" 
                value={numericTolerance}
                onChange={(e) => setNumericTolerance(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--brand-cyan, #00E5FF)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary, #94A3B8)', marginTop: '4px' }}>
                <span>0% (Exact match only)</span>
                <span>5% (Industry Standard)</span>
                <span>20% (Permissive)</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary, #94A3B8)', marginTop: '6px', margin: 0 }}>
                Discrepancies exceeding ±{numericTolerance}% trigger automatic CONTRADICTED status.
              </p>
            </div>

            {/* Superlative Claim Proof */}
            <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Superlative Claims Standard ("#1", "Best", "First"):</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '6px' }}>
                {['strict', 'moderate', 'advisory'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSuperlativeStrictness(mode)}
                    className={`btn btn-sm ${superlativeStrictness === mode ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ textTransform: 'capitalize', fontSize: '0.78rem' }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary, #94A3B8)', marginTop: '6px', margin: 0 }}>
                {superlativeStrictness === 'strict' ? 'Requires accredited 3rd-party independent ranking benchmark.' : 'Allows qualified internal methodology disclaimers.'}
              </p>
            </div>

            {/* Freshness Window */}
            <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Claim Freshness & Re-audit Cycle:</span>
              </div>
              <select
                value={freshnessWindow}
                onChange={(e) => setFreshnessWindow(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-primary, #F5F7FF)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="15">Every 15 Days (High-Velocity / E-commerce Price Tracking)</option>
                <option value="30">Every 30 Days (Standard Continuous Assurance)</option>
                <option value="90">Every 90 Days (Consumer Electronics Hardware Cycles)</option>
                <option value="180">Every 180 Days (Long-term Homologation Records)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 3: Workspace & Audit Ledger */}
        <div className="card" style={{ padding: '22px', borderRadius: '12px', background: 'var(--card-bg, #0F131E)', border: '1px solid var(--border-color, rgba(255,255,255,0.08))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))', paddingBottom: '12px' }}>
            <Database size={18} color="var(--brand-blue, #4361EE)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Active Workspace Ledger</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #94A3B8)', display: 'block', marginBottom: '4px' }}>
                Workspace Display Name
              </label>
              <input 
                type="text"
                value={activeWorkspace}
                onChange={(e) => setActiveWorkspace(e.target.value)}
                placeholder="e.g., Samsung Verification Workspace"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-primary, #F5F7FF)',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '4px' }}>
              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary, #F5F7FF)' }}>
                  {claims.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #94A3B8)' }}>Audited Claims</div>
              </div>

              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FF2FA3' }}>
                  {claims.filter(c => c.status === 'CONTRADICTED').length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #94A3B8)' }}>Conflicts</div>
              </div>

              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#00E676' }}>
                  {claims.filter(c => c.status === 'SUPPORTED').length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #94A3B8)' }}>Supported</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={handleExportData}
                disabled={isExporting}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Download size={14} />
                <span>{isExporting ? 'Exporting...' : 'Export Audit JSON'}</span>
              </button>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setConfirmClearOpen(true)}
                style={{ color: '#FF2FA3', borderColor: 'rgba(255, 47, 163, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                title="Purge localStorage and reset workspace"
              >
                <Trash2 size={14} />
                <span>Reset Data</span>
              </button>
            </div>

            {confirmClearOpen && (
              <div style={{ padding: '12px', background: 'rgba(255, 47, 163, 0.1)', border: '1px solid rgba(255, 47, 163, 0.3)', borderRadius: '8px', marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF2FA3', fontSize: '0.85rem', fontWeight: 600 }}>
                  <AlertTriangle size={15} />
                  <span>Reset all verified claims and products?</span>
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary, #94A3B8)', margin: '6px 0 10px 0' }}>
                  This will clear browser cache and take you directly to the Verification Studio for a fresh ad upload.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={handleConfirmClear}
                    style={{ background: '#FF2FA3', borderColor: '#FF2FA3', fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    Confirm Reset
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => setConfirmClearOpen(false)}
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 4: Appearance & User Experience */}
        <div className="card" style={{ padding: '22px', borderRadius: '12px', background: 'var(--card-bg, #0F131E)', border: '1px solid var(--border-color, rgba(255,255,255,0.08))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))', paddingBottom: '12px' }}>
            <Sun size={18} color="var(--brand-yellow, #FFD166)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Appearance & Interface</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Moon size={15} color="#3D5AFE" />
                  <span>Color Theme</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #94A3B8)', marginTop: '3px' }}>
                  AD-EVIDENCE Cyber Dark Obsidian Engine (Default)
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(61, 90, 254, 0.15)', color: '#3D5AFE', fontWeight: 600 }}>
                CYBER DARK ACTIVE
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>API Endpoint Connection</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #94A3B8)', marginTop: '3px', fontFamily: 'var(--font-mono)' }}>
                  http://localhost:8000 (FastAPI Backend)
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(0, 230, 118, 0.15)', color: '#00E676', fontWeight: 600 }}>
                ONLINE
              </span>
            </div>

            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary, #94A3B8)' }}>
                <Lock size={13} />
                <span>API Key Security: Protected server-side via environment variables.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
