import React, { useState } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Upload, 
  Send, 
  FileCheck, 
  Plus, 
  RefreshCw, 
  History, 
  Sliders, 
  Sparkles,
  ArrowRight,
  MessageSquare,
  Lock
} from 'lucide-react';
import type { Product, BrandKnowledgeRule, ClaimPassport } from '../types';
import { INITIAL_BRAND_RULES } from '../data/mockData';

interface BrandConsoleViewProps {
  products: Product[];
  currentProduct: Product;
  claim: ClaimPassport;
  onUpdateDispute: (response: string) => void;
}

export const BrandConsoleView: React.FC<BrandConsoleViewProps> = ({
  products,
  currentProduct,
  claim,
  onUpdateDispute
}) => {
  const [activeTab, setActiveTab] = useState<'prepublish' | 'knowledge' | 'campaigns' | 'dispute'>('prepublish');
  
  // Pre-publish scanner state
  const [adCopyDraft, setAdCopyDraft] = useState(
    claim?.advertisedWording 
      ? `Introducing the all-new ${currentProduct?.productName || 'Product'}: ${claim.advertisedWording} with next-generation performance.`
      : 'Introducing the all-new flagship model: Experience guaranteed performance and verified specifications.'
  );
  const [scanResult, setScanResult] = useState<{
    riskLevel: 'HIGH' | 'MEDIUM' | 'PASS';
    flaggedPhrases: Array<{ phrase: string; rule: string; fix: string }>;
    clearedToPublish: boolean;
  } | null>(null);

  // Brand Knowledge rules state
  const [rules, setRules] = useState<BrandKnowledgeRule[]>(INITIAL_BRAND_RULES);
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleText, setNewRuleText] = useState('');
  const [newRuleType, setNewRuleType] = useState<BrandKnowledgeRule['type']>('APPROVED_CLAIM');

  // Dispute editor state
  const [disputeText, setDisputeText] = useState(
    claim.brandDisputeResponse?.responseContent || ''
  );
  const [savedDisputeNotice, setSavedDisputeNotice] = useState(false);

  // Handle pre-publish scan
  const handleRunPrePublishCheck = () => {
    const flags: Array<{ phrase: string; rule: string; fix: string }> = [];
    const lower = adCopyDraft.toLowerCase();

    if (lower.includes('guaranteed')) {
      flags.push({
        phrase: 'guaranteed',
        rule: 'Brand Rule #02: Prohibition of Absolute Guarantees without 100% empirical proof',
        fix: 'Replace "guaranteed 50-hour" with "Up to 40 hours with ANC off (lab certified)"'
      });
    }

    if (lower.includes('50-hour') || lower.includes('50 hour') || lower.includes('50h')) {
      flags.push({
        phrase: '50-hour',
        rule: 'Official Spec Mismatch: Engineering rated ceiling is 40 hours (ANC Off)',
        fix: 'Correct runtime figure to "Up to 40 hours"'
      });
    }

    if (!lower.includes('anc off') && !lower.includes('anc disabled')) {
      flags.push({
        phrase: 'Omission of Condition',
        rule: 'India DCA 2022 Guidelines & Brand Rule #01: Mandatory disclaimer on ANC state',
        fix: 'Include mandatory footnote: "*With ANC disabled at 50% volume"'
      });
    }

    setScanResult({
      riskLevel: flags.length > 1 ? 'HIGH' : flags.length === 1 ? 'MEDIUM' : 'PASS',
      flaggedPhrases: flags,
      clearedToPublish: flags.length === 0
    });
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleTitle.trim() || !newRuleText.trim()) return;

    const newRule: BrandKnowledgeRule = {
      id: `rule-${Date.now()}`,
      brandId: currentProduct.brandId,
      title: newRuleTitle,
      type: newRuleType,
      ruleText: newRuleText,
      affectedAttributes: ['custom_attribute'],
      severity: newRuleType === 'PROHIBITED_CLAIM' ? 'BLOCKER' : 'WARNING'
    };

    setRules([newRule, ...rules]);
    setNewRuleTitle('');
    setNewRuleText('');
  };

  const handleSaveDispute = () => {
    onUpdateDispute(disputeText);
    setSavedDisputeNotice(true);
    setTimeout(() => setSavedDisputeNotice(false), 3000);
  };

  return (
    <div className="brand-console-container">
      {/* Brand Header */}
      <div className="brand-header-panel glass-panel">
        <div className="brand-header-left">
          <div className="brand-icon-box">
            <Building2 size={24} color="#3D5AFE" />
          </div>
          <div>
            <div className="brand-sub">Brand Governance & Compliance Console</div>
            <h2 className="brand-title">{currentProduct.brandName}</h2>
          </div>
        </div>

        <div className="brand-nav-pills">
          <button 
            className={`pill-btn ${activeTab === 'prepublish' ? 'active' : ''}`}
            onClick={() => setActiveTab('prepublish')}
          >
            <Sparkles size={15} />
            <span>Pre-Publish Creative Scanner</span>
          </button>

          <button 
            className={`pill-btn ${activeTab === 'knowledge' ? 'active' : ''}`}
            onClick={() => setActiveTab('knowledge')}
          >
            <FileCheck size={15} />
            <span>Brand Knowledge Base</span>
          </button>

          <button 
            className={`pill-btn ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaigns')}
          >
            <Sliders size={15} />
            <span>Campaign Batch Queue</span>
          </button>

          <button 
            className={`pill-btn ${activeTab === 'dispute' ? 'active' : ''}`}
            onClick={() => setActiveTab('dispute')}
          >
            <MessageSquare size={15} />
            <span>Dispute & Evidence Response</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Pre-Publication Scanner */}
      {activeTab === 'prepublish' && (
        <div className="prepublish-section grid-2">
          {/* Editor Column */}
          <div className="scanner-editor-card glass-panel">
            <div className="card-header-clean">
              <span className="title-bold">Pre-Flight Ad Copy & Creative Inspection</span>
              <span className="badge-meta">Target: Instagram & YouTube</span>
            </div>

            <p className="scanner-desc">
              Validate proposed marketing copy and visual prompts against engineering specs, CCPA/DCA policies, and brand knowledge base before spending budget.
            </p>

            <div className="form-group">
              <label className="form-label">Proposed Ad Headline & Script Copy:</label>
              <textarea 
                className="custom-textarea" 
                rows={5}
                value={adCopyDraft}
                onChange={(e) => setAdCopyDraft(e.target.value)}
              />
            </div>

            <div className="scanner-actions-row">
              <button 
                className="btn btn-primary"
                onClick={handleRunPrePublishCheck}
              >
                <Sparkles size={16} />
                <span>Run Pre-Publish AI & Policy Scan</span>
              </button>
              
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setAdCopyDraft('Experience up to 40 hours playback (with ANC off) on the new WH-950PRO. Acoustic lab certified.')}
              >
                Insert Cleared Copy Template
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div className="scanner-results-card glass-panel">
            <div className="card-header-clean">
              <span className="title-bold">Pre-Publish Verification Report</span>
              {scanResult && (
                <span className={`risk-pill ${scanResult.riskLevel.toLowerCase()}`}>
                  Risk: {scanResult.riskLevel}
                </span>
              )}
            </div>

            {!scanResult ? (
              <div className="empty-scan-state">
                <ShieldAlert size={36} color="#64748b" />
                <p>Click "Run Pre-Publish AI & Policy Scan" to evaluate the copy above against canonical product claims and rules.</p>
              </div>
            ) : (
              <div className="scan-report-body">
                <div className={`scan-verdict-banner ${scanResult.clearedToPublish ? 'pass' : 'block'}`}>
                  {scanResult.clearedToPublish ? (
                    <>
                      <CheckCircle2 size={20} color="#3D5AFE" />
                      <span>APPROVED FOR PUBLICATION: All claims corroborated by official documentation.</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={20} color="#FF2FA3" />
                      <span>CHANGES REQUIRED: {scanResult.flaggedPhrases.length} policy / spec conflicts detected.</span>
                    </>
                  )}
                </div>

                <div className="flagged-issues-list">
                  {scanResult.flaggedPhrases.map((issue, idx) => (
                    <div key={idx} className="issue-item-card">
                      <div className="issue-top">
                        <span className="issue-tag">CONFLICT #{idx + 1}</span>
                        <span className="flagged-phrase">“{issue.phrase}”</span>
                      </div>
                      <div className="issue-rule">{issue.rule}</div>
                      <div className="issue-recommendation">
                        <ArrowRight size={13} color="#3D5AFE" />
                        <span><strong>Recommended Fix:</strong> {issue.fix}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="scan-footer-audit">
                  <div className="audit-row">
                    <span className="audit-lbl">Model Version:</span>
                    <span className="audit-val">Gemini 2.5 Flash Grounded</span>
                  </div>
                  <div className="audit-row">
                    <span className="audit-lbl">Tenant Isolation:</span>
                    <span className="audit-val text-green">Brand-Private Document Vault Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Brand Knowledge Base */}
      {activeTab === 'knowledge' && (
        <div className="knowledge-base-section grid-2">
          {/* Rules List */}
          <div className="rules-list-card glass-panel">
            <div className="card-header-clean">
              <span className="title-bold">Brand Knowledge Rules & Mandates</span>
              <span className="badge-meta">{rules.length} Active Directives</span>
            </div>

            <div className="rules-stack">
              {rules.map((rule) => (
                <div key={rule.id} className="rule-box-item">
                  <div className="rule-top-meta">
                    <span className={`rule-type-badge ${rule.type.toLowerCase()}`}>
                      {rule.type.replace('_', ' ')}
                    </span>
                    <span className={`rule-sev-badge ${rule.severity.toLowerCase()}`}>
                      {rule.severity}
                    </span>
                  </div>
                  <div className="rule-title-text">{rule.title}</div>
                  <div className="rule-content-body">{rule.ruleText}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Rule */}
          <div className="add-rule-card glass-panel">
            <div className="card-header-clean">
              <span className="title-bold">Create Brand Rule / Footnote Directive</span>
              <span className="badge-meta">Admin Policy</span>
            </div>

            <form onSubmit={handleAddRule} className="rule-form">
              <div className="form-group">
                <label className="form-label">Rule Title:</label>
                <input 
                  type="text" 
                  className="custom-input" 
                  placeholder="e.g. Battery Disclaimer Requirement"
                  value={newRuleTitle}
                  onChange={(e) => setNewRuleTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Directive Type:</label>
                <select 
                  className="custom-select"
                  value={newRuleType}
                  onChange={(e) => setNewRuleType(e.target.value as any)}
                >
                  <option value="APPROVED_CLAIM">Approved Claim (Pre-cleared wording)</option>
                  <option value="PROHIBITED_CLAIM">Prohibited Claim (Banned wording/superlatives)</option>
                  <option value="MANDATORY_DISCLOSURE">Mandatory Disclosure (Required footnote)</option>
                  <option value="TONE_RULE">Tone / Visual Policy</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Rule Text & Specification:</label>
                <textarea 
                  className="custom-textarea" 
                  rows={4}
                  placeholder="Specify exact wording requirements, lab references, and compliance guidelines..."
                  value={newRuleText}
                  onChange={(e) => setNewRuleText(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                <Plus size={16} />
                <span>Save to Brand Knowledge Base</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Campaign Batch Queue */}
      {activeTab === 'campaigns' && (
        <div className="campaign-batch-card glass-panel">
          <div className="card-header-clean">
            <div>
              <span className="title-bold">Active Creative Asset Inspection Queue</span>
              <p className="card-subtitle">Batch scanning for large creative volumes across ad networks</p>
            </div>
            <button className="btn btn-secondary btn-sm">
              <RefreshCw size={14} /> Refresh Telemetry
            </button>
          </div>

          <div className="batch-table-wrap">
            <table className="batch-table">
              <thead>
                <tr>
                  <th>Creative ID</th>
                  <th>Channel</th>
                  <th>Asserted Claim</th>
                  <th>C2PA Manifest</th>
                  <th>Risk Tier</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono">CR-2026-081</td>
                  <td>Instagram Reel</td>
                  <td>“50-Hour Nonstop Battery”</td>
                  <td><span className="badge-c2pa-ok">C2PA Verified</span></td>
                  <td><span className="impact-badge critical">CRITICAL</span></td>
                  <td><span className="batch-status-flagged">Flagged by AI</span></td>
                  <td><button className="btn btn-sm btn-secondary">Review</button></td>
                </tr>
                <tr>
                  <td className="mono">CR-2026-082</td>
                  <td>YouTube 15s</td>
                  <td>“Up to 40 Hours Runtime (ANC off)”</td>
                  <td><span className="badge-c2pa-ok">C2PA Verified</span></td>
                  <td><span className="impact-badge informational">LOW</span></td>
                  <td><span className="batch-status-cleared">Cleared</span></td>
                  <td><button className="btn btn-sm btn-secondary">Audit</button></td>
                </tr>
                <tr>
                  <td className="mono">CR-2026-083</td>
                  <td>Amazon Headline</td>
                  <td>“Best in Class 50-Hour Playtime”</td>
                  <td><span className="badge-c2pa-none">Missing</span></td>
                  <td><span className="impact-badge critical">CRITICAL</span></td>
                  <td><span className="batch-status-flagged">Takedown Sent</span></td>
                  <td><button className="btn btn-sm btn-danger">Takedown</button></td>
                </tr>
                <tr>
                  <td className="mono">CR-2026-084</td>
                  <td>Google Search Ad</td>
                  <td>“Over-Ear Studio Headphones with LDAC”</td>
                  <td><span className="badge-c2pa-na">Text Only</span></td>
                  <td><span className="impact-badge informational">LOW</span></td>
                  <td><span className="batch-status-cleared">Cleared</span></td>
                  <td><button className="btn btn-sm btn-secondary">Audit</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Brand Dispute & Response Layer */}
      {activeTab === 'dispute' && (
        <div className="dispute-section-card glass-panel">
          <div className="card-header-clean">
            <div>
              <span className="title-bold">Section 8: Brand Dispute & Evidence Clarification</span>
              <p className="card-subtitle">
                Submit official technical clarification to explain lab or retailer divergences without overwriting public records.
              </p>
            </div>
            <span className="badge-meta">Current Claim: {claim.id}</span>
          </div>

          <div className="dispute-form-wrap">
            <div className="dispute-context-summary">
              <strong>Public Claim under Review:</strong> “{claim.advertisedWording}”
              <br />
              <span className="text-secondary">Official spec: 40h | Lab benchmark: 38.4h | Retailer copied: 50h</span>
            </div>

            <div className="form-group">
              <label className="form-label">Official Brand Clarification Statement:</label>
              <textarea 
                className="custom-textarea"
                rows={6}
                value={disputeText}
                onChange={(e) => setDisputeText(e.target.value)}
                placeholder="Explain the testing protocol difference, firmware update, or corrective action taken..."
              />
            </div>

            <div className="dispute-actions">
              <button 
                className="btn btn-primary"
                onClick={handleSaveDispute}
              >
                <Send size={15} />
                <span>Publish Official Brand Clarification to Claim Passport</span>
              </button>

              {savedDisputeNotice && (
                <span className="saved-notice text-green">
                  <CheckCircle2 size={16} /> Clarification saved to Claim Passport {claim.id}!
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
