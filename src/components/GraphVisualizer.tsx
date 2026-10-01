import React, { useState } from 'react';
import { 
  Share2, 
  ZoomIn, 
  ZoomOut, 
  RefreshCcw, 
  Filter, 
  Info, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { GRAPH_NODES, GRAPH_EDGES } from '../data/mockData';
import type { GraphNode, GraphEdge } from '../types';

export const GraphVisualizer: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(GRAPH_NODES[2]); // Default to claim node
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Filter nodes based on selected filter
  const filteredNodes = GRAPH_NODES.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'claims') return n.type === 'claim';
    if (filterType === 'conflicts') return n.status === 'CONTRADICTED' || n.status === 'OUTDATED';
    if (filterType === 'sources') return ['official', 'lab', 'retailer', 'consumer'].includes(n.type);
    if (filterType === 'ads') return n.type === 'ad';
    return true;
  });

  // Calculate layout coordinates dynamically for clean visualization
  // SVG Canvas dimensions: 900 x 580
  const getNodeCoordinates = (nodeId: string, index: number, total: number) => {
    // Custom predefined aesthetic positions for key nodes:
    const positions: Record<string, { x: number; y: number }> = {
      'brand-soundcore': { x: 140, y: 120 },
      'prod-xyz-headset-pro': { x: 330, y: 150 },
      'CLM-82917': { x: 500, y: 250 },
      'ad-instagram-01': { x: 260, y: 340 },
      'ad-youtube-02': { x: 220, y: 440 },
      'ad-retailer-03': { x: 420, y: 460 },
      'src-official-xyz': { x: 740, y: 140 },
      'src-lab-xyz': { x: 780, y: 260 },
      'src-consumer-xyz': { x: 740, y: 390 },
      'src-provenance-xyz': { x: 120, y: 380 },
      'src-policy-xyz': { x: 520, y: 100 },

      // VoltDrive Scooter cluster
      'prod-voltdrive-scooter': { x: 350, y: 550 },
      'CLM-90312': { x: 580, y: 560 },
      'src-official-price': { x: 780, y: 520 },
      'src-homologation': { x: 800, y: 620 },
      'src-consumer-voltdrive': { x: 620, y: 650 },
    };

    if (positions[nodeId]) {
      return positions[nodeId];
    }

    // Fallback radial layout
    const angle = (index / total) * 2 * Math.PI;
    return {
      x: 450 + 260 * Math.cos(angle),
      y: 300 + 190 * Math.sin(angle)
    };
  };

  return (
    <div className="graph-view-container glass-panel">
      {/* Graph Toolbar */}
      <div className="graph-toolbar">
        <div className="toolbar-left">
          <div className="graph-title-group">
            <Share2 size={20} color="#3D5AFE" />
            <h3 className="card-title">Living Claim Evidence Graph</h3>
          </div>
          <span className="graph-meta-pill">Section 5 & 15: Neo4j GraphRAG Data Structure</span>
        </div>

        <div className="toolbar-controls">
          {/* Filters */}
          <div className="filter-pill-group">
            <button 
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All Entities ({GRAPH_NODES.length})
            </button>
            <button 
              className={`filter-btn ${filterType === 'claims' ? 'active' : ''}`}
              onClick={() => setFilterType('claims')}
            >
              Claims
            </button>
            <button 
              className={`filter-btn ${filterType === 'conflicts' ? 'active' : ''}`}
              onClick={() => setFilterType('conflicts')}
            >
              Conflicts Only
            </button>
            <button 
              className={`filter-btn ${filterType === 'sources' ? 'active' : ''}`}
              onClick={() => setFilterType('sources')}
            >
              Sources
            </button>
          </div>

          {/* Zoom buttons */}
          <div className="zoom-btn-group">
            <button 
              className="btn-icon" 
              onClick={() => setZoomLevel(Math.min(zoomLevel + 0.15, 1.6))}
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button 
              className="btn-icon" 
              onClick={() => setZoomLevel(Math.max(zoomLevel - 0.15, 0.7))}
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button 
              className="btn-icon" 
              onClick={() => setZoomLevel(1)}
              title="Reset Zoom"
            >
              <RefreshCcw size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas & Inspector Layout */}
      <div className="graph-canvas-layout">
        {/* SVG Interactive Canvas */}
        <div className="svg-canvas-wrapper">
          <svg 
            viewBox="0 0 920 620" 
            className="graph-svg-element"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 200ms ease' }}
          >
            <defs>
              {/* Arrowhead markers */}
              <marker id="arrow-normal" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#AEB6C2" />
              </marker>
              <marker id="arrow-conflict" viewBox="0 0 10 10" refX="26" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#FF2FA3" />
              </marker>
              <marker id="arrow-verified" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#3D5AFE" />
              </marker>

              {/* Glow filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Render Edges */}
            <g className="edges-group">
              {GRAPH_EDGES.map((edge) => {
                const sourceNode = GRAPH_NODES.find(n => n.id === edge.source);
                const targetNode = GRAPH_NODES.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const srcPos = getNodeCoordinates(edge.source, 0, GRAPH_NODES.length);
                const tgtPos = getNodeCoordinates(edge.target, 0, GRAPH_NODES.length);

                const isConflict = edge.status === 'conflict';
                const isVerified = edge.status === 'verified';
                const markerUrl = isConflict ? 'url(#arrow-conflict)' : isVerified ? 'url(#arrow-verified)' : 'url(#arrow-normal)';

                const midX = (srcPos.x + tgtPos.x) / 2;
                const midY = (srcPos.y + tgtPos.y) / 2;

                return (
                  <g key={edge.id} className={`edge-group ${isConflict ? 'edge-conflict' : ''}`}>
                    <line 
                      x1={srcPos.x} 
                      y1={srcPos.y} 
                      x2={tgtPos.x} 
                      y2={tgtPos.y} 
                      stroke={isConflict ? '#FF2FA3' : isVerified ? '#3D5AFE' : '#1A1B2E'}
                      strokeWidth={isConflict ? 2.5 : 1.5}
                      strokeDasharray={isConflict ? '5,4' : 'none'}
                      markerEnd={markerUrl}
                    />
                    {/* Edge Label Badge */}
                    <rect 
                      x={midX - 55} 
                      y={midY - 10} 
                      width="110" 
                      height="18" 
                      rx="4" 
                      fill="#06070A" 
                      stroke={isConflict ? 'rgba(255, 47, 163, 0.4)' : '#12131A'}
                    />
                    <text 
                      x={midX} 
                      y={midY + 3} 
                      textAnchor="middle" 
                      fontSize="9" 
                      fontWeight="600"
                      fill={isConflict ? '#FF2FA3' : '#AEB6C2'}
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Render Nodes */}
            <g className="nodes-group">
              {filteredNodes.map((node, idx) => {
                const pos = getNodeCoordinates(node.id, idx, filteredNodes.length);
                const isSelected = selectedNode?.id === node.id;
                const nodeRadius = node.val || 20;

                return (
                  <g 
                    key={node.id} 
                    className={`node-group ${isSelected ? 'selected-node' : ''}`}
                    onClick={() => setSelectedNode(node)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Glow circle for selected or conflict node */}
                    {(isSelected || node.status === 'CONTRADICTED') && (
                      <circle 
                        cx={pos.x} 
                        cy={pos.y} 
                        r={nodeRadius + 9} 
                        fill="none" 
                        stroke={node.color || '#3D5AFE'} 
                        strokeWidth="2.5" 
                        strokeOpacity="0.7"
                        filter="url(#glow)"
                        className="pulsing-circle"
                      />
                    )}

                    {/* Base Node Circle */}
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={nodeRadius} 
                      fill="#06070A" 
                      stroke={node.color || '#3D5AFE'} 
                      strokeWidth={isSelected ? 3.5 : 2}
                    />

                    {/* Node Type Indicator Inner Ring */}
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={nodeRadius - 5} 
                      fill={node.color || '#3D5AFE'} 
                      fillOpacity={isSelected ? 0.35 : 0.15}
                    />

                    {/* Node Label Text */}
                    <text 
                      x={pos.x} 
                      y={pos.y + nodeRadius + 14} 
                      textAnchor="middle" 
                      fontSize="11" 
                      fontWeight="700" 
                      fill="#f8fafc"
                      fontFamily="Outfit, sans-serif"
                    >
                      {node.label}
                    </text>
                    <text 
                      x={pos.x} 
                      y={pos.y + nodeRadius + 26} 
                      textAnchor="middle" 
                      fontSize="9" 
                      fill="#AEB6C2"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {node.subLabel || node.type}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Graph Legend Overlay */}
          <div className="graph-legend-box">
            <span className="legend-title">Graph Node Types:</span>
            <div className="legend-items">
              <span className="legend-item"><span className="legend-dot" style={{ background: '#3D5AFE' }}></span> Brand</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#818cf8' }}></span> Product</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#FF2FA3' }}></span> Claim (Contradicted)</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#3D5AFE' }}></span> Official Source</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#FF2FA3' }}></span> Lab Test</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#06b6d4' }}></span> Consumer Reports</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#fb923c' }}></span> Advertisement</span>
            </div>
          </div>
        </div>

        {/* Node Inspector Side Panel */}
        <div className="graph-inspector-panel">
          <div className="inspector-header">
            <span className="title-bold">Claim Graph Node Inspector</span>
            <span className="badge-meta">{selectedNode?.type.toUpperCase()}</span>
          </div>

          {selectedNode ? (
            <div className="inspector-content">
              <div className="node-hero-card">
                <div className="node-id-mono">ID: {selectedNode.id}</div>
                <div className="node-title-lg">{selectedNode.label}</div>
                <div className="node-subtitle-desc">{selectedNode.subLabel}</div>
              </div>

              {selectedNode.status && (
                <div className="inspector-status-row">
                  <span className="insp-lbl">Claim Verification Status:</span>
                  <span className={`status-badge ${selectedNode.status}`}>
                    {selectedNode.status}
                  </span>
                </div>
              )}

              <div className="inspector-details-stack">
                <div className="detail-item">
                  <span className="d-label">Graph Role:</span>
                  <span className="d-value">
                    {selectedNode.type === 'claim' && 'Persistent Commercial Claim (Claim Passport #CLM-82917)'}
                    {selectedNode.type === 'product' && 'Canonical GS1-Indexed Physical Product'}
                    {selectedNode.type === 'brand' && 'Manufacturer Organization & Policy Authority'}
                    {selectedNode.type === 'official' && 'Authoritative Engineering Spec Sheet (Ground Truth)'}
                    {selectedNode.type === 'lab' && 'Independent 3rd-Party IEC Acoustic Test (Corroboration)'}
                    {selectedNode.type === 'consumer' && 'Real-World Aggregated Telemetry (n=127 Samples)'}
                    {selectedNode.type === 'ad' && 'Marketing Asset Ingestion (Instagram Creative)'}
                    {selectedNode.type === 'policy' && 'India CCPA Misleading Ads Guidelines (2022)'}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="d-label">Storage Engine:</span>
                  <span className="d-value mono">Neo4j Cypher Graph Database (Section 14 & 15)</span>
                </div>

                <div className="detail-item">
                  <span className="d-label">Related Connected Edges:</span>
                  <div className="connected-edges-list">
                    {GRAPH_EDGES.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map(e => (
                      <div key={e.id} className="edge-link-row">
                        <span className="edge-rel-tag">{e.label}</span>
                        <span className="edge-endpoints">{e.source} ➔ {e.target}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="inspector-tip-box">
                <Info size={15} color="#3D5AFE" />
                <span>
                  Section 5 Insight: <em>“A product has many ads. A persistent claim graph allows one verification event to inform many downstream reports without repeating work.”</em>
                </span>
              </div>
            </div>
          ) : (
            <div className="empty-inspector">
              <p>Click any node or relationship on the canvas to inspect its schema and evidence anchors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
