import React from 'react';
import { Server, CheckCircle2, RefreshCw, ExternalLink, ShieldCheck, Database, FileText } from 'lucide-react';

export const DataSourcesView: React.FC = () => {
  const sources = [
    {
      name: 'Verified by GS1 Product Identity Registry',
      category: 'Product Identity & Barcodes',
      status: 'Connected & Synced',
      coverage: '300M+ Global GTINs',
      lastSync: 'Today, 04:00 UTC',
      desc: 'Canonical resolution of brand ownership, model numbers, packaging specifications, and manufacturer identity.'
    },
    {
      name: 'ARAI / ICAT Automotive Homologation Database',
      category: 'Vehicle Certifications & Range',
      status: 'Connected & Synced',
      coverage: 'EV Certified Test Standards (IDC / WLTP)',
      lastSync: 'Yesterday',
      desc: 'Authoritative range, top speed, and dynamometer laboratory certificates for electric mobility products.'
    },
    {
      name: 'AHAM Verified Air Filtration Directory',
      category: 'Environmental & HEPA Lab Benchmarks',
      status: 'Connected & Synced',
      coverage: 'CADR Ratings & Microbial Reduction',
      lastSync: '28 Sep 2026',
      desc: 'Standardized test results for clean air delivery rates and pathogen removal timelines in cubic meter test chambers.'
    },
    {
      name: 'C2PA Content Credentials Manifest Service',
      category: 'Cryptographic Media Provenance',
      status: 'Active Validator',
      coverage: 'JUMBF Box Verification & SynthID',
      lastSync: 'Real-time Telemetry',
      desc: 'Inspects tamper-evident digital signatures in advertising stills and videos to identify camera sensors, generation tools, and edit history.'
    },
    {
      name: 'Google Merchant API & Retail Feeds',
      category: 'Price & Inventory Freshness',
      status: 'Active Feed Listener',
      coverage: 'Amazon, Flipkart, Direct-to-Consumer',
      lastSync: 'Hourly Poll',
      desc: 'Live retail pricing observations and seller listing text to identify stale price promotions and copied claims.'
    }
  ];

  return (
    <div className="datasources-page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Connected Empirical Data Sources</h1>
          <p className="page-subtitle">
            Authoritative registry integrations, homologation databases, lab benchmarking directories, and C2PA provenance validators.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm">
          <RefreshCw size={14} />
          <span>Sync All Connectors</span>
        </button>
      </div>

      <div className="datasources-grid">
        {sources.map((src, idx) => (
          <div key={idx} className="source-connector-card card">
            <div className="connector-top-row">
              <span className="connector-cat-pill mono">{src.category.toUpperCase()}</span>
              <span className="connector-status-badge">
                <CheckCircle2 size={13} color="#3D5AFE" />
                <span>{src.status}</span>
              </span>
            </div>

            <h3 className="connector-title">{src.name}</h3>
            <p className="connector-desc">{src.desc}</p>

            <div className="connector-meta-row mono">
              <div><strong>Scope:</strong> {src.coverage}</div>
              <div><strong>Last Sync:</strong> {src.lastSync}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
