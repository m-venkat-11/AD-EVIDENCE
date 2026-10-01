import React, { useState } from 'react';
import { 
  Share2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Filter, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Database,
  Building2,
  Package,
  Megaphone,
  UserCheck
} from 'lucide-react';
import { GRAPH_NODES, GRAPH_EDGES } from '../data/mockData';
import type { GraphNode, GraphEdge } from '../types';

interface ClaimEvidenceGraphViewProps {
  onSelectClaim: (claimId: string) => void;
}

export const ClaimEvidenceGraphView: React.FC<ClaimEvidenceGraphViewProps> = ({
  onSelectClaim
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(GRAPH_NODES[2]); // Default to claim node
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Filter nodes
  const filteredNodes = GRAPH_NODES.filter((node) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'claims') return node.type === 'claim';
    if (activeFilter === 'evidence') return ['official', 'lab', 'provenance'].includes(node.type);
    if (activeFilter === 'sources') return ['official', 'retailer', 'lab'].includes(node.type);
    if (activeFilter === 'ads') return node.type === 'ad';
    if (activeFilter === 'consumers') return node.type === 'consumer';
    if (activeFilter === 'brands') return ['brand', 'product'].includes(node.type);
    return true;
  });

  // Calculate coordinates for graph nodes on canvas (900x560)
  const getNodeCoordinates = (nodeId: string, index: number, total: number) => {
    const layoutMap: Record<string, { x: number; y: number }> = {
      'brand-soundcore': { x: 130, y: 130 },
      'prod-xyz-headset-pro': { x: 320, y: 150 },
      'CLM-82917': { x: 500, y: 240 },
      'ad-instagram-01': { x: 260, y: 340 },
      'ad-youtube-02': { x: 230, y: 440 },
      'ad-retailer-03': { x: 420, y: 450 },
      'src-official-xyz': { x: 740, y: 130 },
      'src-lab-xyz': { x: 770, y: 250 },
      'src-consumer-xyz': { x: 730, y: 380 },
      'src-provenance-xyz': { x: 120, y: 370 },

      // VoltDrive Cluster
      'prod-voltdrive-scooter': { x: 340, y: 550 },
      'CLM-90312': { x: 560, y: 550 },
      'src-official-price': { x: 770, y: 520 },
      'src-consumer-voltdrive': { x: 620, y: 640 },
    };

    if (layoutMap[nodeId]) {
      return layoutMap[nodeId];
    }

    const angle = (index / total) * 2 * Math.PI;
    return {
      x: 450 + 260 * Math.cos(angle),
      y: 280 + 180 * Math.sin(angle)
    };
  };

  return (
    <div className="graph-page-container">
      {/* Page Header */}
      <div className="graph-page-header">
        <div>
          <h1 className="page-title">Claim Evidence Graph</h1>
          <p className="page-subtitle">
            Section 10: Explore how commercial claims, physical products, marketing channels, and empirical evidence are connected.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="graph-toolbar-controls">
          {/* Node Category Filters */}
          <div className="graph-filter-chips">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'claims' ? 'active' : ''}`}
              onClick={() => setActiveFilter('claims')}
            >
              Claims
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'evidence' ? 'active' : ''}`}
              onClick={() => setActiveFilter('evidence')}
            >
              Evidence
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'sources' ? 'active' : ''}`}
              onClick={() => setActiveFilter('sources')}
            >
              Sources
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'ads' ? 'active' : ''}`}
              onClick={() => setActiveFilter('ads')}
            >
              Advertisements
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'consumers' ? 'active' : ''}`}
              onClick={() => setActiveFilter('consumers')}
            >
              Consumers
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'brands' ? 'active' : ''}`}
              onClick={() => setActiveFilter('brands')}
            >
              Brands
            </button>
          </div>

          {/* Zoom / Reset Buttons */}
          <div className="graph-zoom-group">
            <button 
              className="zoom-btn" 
              onClick={() => setZoomLevel(Math.min(zoomLevel + 0.15, 1.6))}
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button 
              className="zoom-btn" 
              onClick={() => setZoomLevel(Math.max(zoomLevel - 0.15, 0.75))}
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button 
              className="zoom-btn" 
              onClick={() => setZoomLevel(1)}
              title="Reset View"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph Canvas and Side Inspector Panel */}
      <div className="graph-viewport-grid">
        {/* SVG Canvas Box - Official #06070A Dark Graph Canvas */}
        <div className="graph-canvas-frame card" style={{ background: '#06070A', borderColor: 'rgba(174, 182, 194, 0.2)' }}>
          <svg 
            viewBox="0 0 920 600" 
            className="graph-svg"
            style={{ 
              transform: `scale(${zoomLevel})`, 
              transformOrigin: 'center center', 
              transition: 'transform 200ms ease',
              background: '#06070A'
            }}
          >
            <defs>
              <marker id="arrow-norm" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#AEB6C2" />
              </marker>
              <marker id="arrow-conf" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#FF2FA3" />
              </marker>
              {/* Subtle background grid pattern */}
              <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(174, 182, 194, 0.04)" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Grid overlay */}
            <rect width="100%" height="100%" fill="url(#graph-grid)" />

            {/* Edge Connections */}
            <g className="edges-layer">
              {GRAPH_EDGES.map((edge) => {
                const srcNode = GRAPH_NODES.find(n => n.id === edge.source);
                const tgtNode = GRAPH_NODES.find(n => n.id === edge.target);
                if (!srcNode || !tgtNode) return null;

                const p1 = getNodeCoordinates(edge.source, 0, GRAPH_NODES.length);
                const p2 = getNodeCoordinates(edge.target, 0, GRAPH_NODES.length);

                const isConf = edge.status === 'conflict';
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;

                return (
                  <g key={edge.id} className={`edge-group ${isConf ? 'conflict' : ''}`}>
                    <line 
                      x1={p1.x} 
                      y1={p1.y} 
                      x2={p2.x} 
                      y2={p2.y} 
                      stroke={isConf ? '#FF2FA3' : 'rgba(174, 182, 194, 0.45)'}
                      strokeWidth={isConf ? 2.5 : 1.5}
                      strokeDasharray={isConf ? '5,4' : 'none'}
                      markerEnd={isConf ? 'url(#arrow-conf)' : 'url(#arrow-norm)'}
                    />

                    {/* Edge Label Badge */}
                    <rect 
                      x={midX - 54} 
                      y={midY - 9} 
                      width="108" 
                      height="18" 
                      rx="4" 
                      fill="#06070A" 
                      stroke={isConf ? '#FF2FA3' : 'rgba(174, 182, 194, 0.3)'}
                    />
                    <text 
                      x={midX} 
                      y={midY + 3.5} 
                      textAnchor="middle" 
                      fontSize="9" 
                      fontWeight="600"
                      fill={isConf ? '#FF2FA3' : '#F5F7FF'}
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Nodes */}
            <g className="nodes-layer">
              {filteredNodes.map((node, idx) => {
                const pos = getNodeCoordinates(node.id, idx, filteredNodes.length);
                const isSelected = selectedNode?.id === node.id;
                const radius = node.val || 20;

                return (
                  <g 
                    key={node.id} 
                    className={`node-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedNode(node)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Selected Highlight Glow */}
                    {isSelected && (
                      <circle 
                        cx={pos.x} 
                        cy={pos.y} 
                        r={radius + 8} 
                        fill="none" 
                        stroke="#F5F7FF" 
                        strokeWidth="2.5" 
                        strokeDasharray="4,4"
                      />
                    )}

                    {/* Node Base Circle */}
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={radius} 
                      fill="#1A1B2E" 
                      stroke={node.color || '#3D5AFE'} 
                      strokeWidth={isSelected ? 3.5 : 2}
                    />

                    {/* Inner Colored Dot */}
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={radius - 6} 
                      fill={node.color || '#F5F7FF'} 
                      fillOpacity={0.85}
                    />

                    {/* Node Label Text on Dark Canvas */}
                    <text 
                      x={pos.x} 
                      y={pos.y + radius + 15} 
                      textAnchor="middle" 
                      fontSize="11" 
                      fontWeight="700" 
                      fill="#F5F7FF"
                      fontFamily="Inter, sans-serif"
                    >
                      {node.label}
                    </text>
                    <text 
                      x={pos.x} 
                      y={pos.y + radius + 27} 
                      textAnchor="middle" 
                      fontSize="9" 
                      fill="#AEB6C2"
                      fontFamily="Inter, sans-serif"
                    >
                      {node.subLabel || node.type}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Graph Legend - Styled with 6-Color Palette */}
          <div className="graph-bottom-legend" style={{ background: 'rgba(6, 7, 10, 0.95)', border: '1px solid rgba(174, 182, 194, 0.25)', color: '#F5F7FF' }}>
            <span className="legend-label" style={{ color: '#F5F7FF', fontWeight: 600 }}>Palette Taxonomy:</span>
            <div className="legend-pills">
              <span className="l-pill" style={{ color: '#F5F7FF' }}><span className="l-dot" style={{ background: '#06070A', border: '1px solid #F5F7FF' }}></span> Brand</span>
              <span className="l-pill" style={{ color: '#F5F7FF' }}><span className="l-dot" style={{ background: '#1A1B2E' }}></span> Product</span>
              <span className="l-pill" style={{ color: '#F5F7FF' }}><span className="l-dot" style={{ background: '#FF2FA3' }}></span> Claim (Contradicted)</span>
              <span className="l-pill" style={{ color: '#F5F7FF' }}><span className="l-dot" style={{ background: '#3D5AFE' }}></span> Official Evidence</span>
              <span className="l-pill" style={{ color: '#F5F7FF' }}><span className="l-dot" style={{ background: '#1A1B2E' }}></span> Independent Test</span>
              <span className="l-pill" style={{ color: '#F5F7FF' }}><span className="l-dot" style={{ background: '#AEB6C2' }}></span> Consumer Telemetry</span>
              <span className="l-pill" style={{ color: '#F5F7FF' }}><span className="l-dot" style={{ background: '#F5F7FF' }}></span> Provenance (C2PA)</span>
            </div>
          </div>
        </div>

        {/* Right Detail Inspector Panel */}
        <div className="graph-detail-panel card">
          <div className="panel-header">
            <span className="panel-title">Node Inspector</span>
            <span className="badge-meta">{selectedNode?.type.toUpperCase()}</span>
          </div>

          {selectedNode ? (
            <div className="panel-body">
              <div className="inspector-node-card">
                <span className="node-id-tag mono">{selectedNode.id}</span>
                <div className="inspector-node-title">{selectedNode.label}</div>
                <div className="inspector-node-sub">{selectedNode.subLabel}</div>
              </div>

              {selectedNode.status && (
                <div className="inspector-status-box">
                  <span className="status-label">Claim Status:</span>
                  <span className={`status-pill ${selectedNode.status}`}>
                    {selectedNode.status}
                  </span>
                </div>
              )}

              <div className="inspector-metadata-stack">
                <div className="meta-row">
                  <span className="meta-key">Entity Class:</span>
                  <span className="meta-val capitalize">{selectedNode.type}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Graph Database:</span>
                  <span className="meta-val mono">Neo4j Cypher Schema</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">Relationships:</span>
                  <div className="meta-val edges-list">
                    {GRAPH_EDGES.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map(e => (
                      <div key={e.id} className="edge-chip">
                        <span className="edge-name">{e.label}</span>
                        <span className="edge-dest mono">{e.source} ➔ {e.target}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedNode.type === 'claim' && (
                <div className="inspector-actions">
                  <button 
                    className="btn btn-primary btn-sm full-width"
                    onClick={() => onSelectClaim(selectedNode.id)}
                  >
                    <span>Open Claim Passport</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-panel">
              <p>Click any node in the graph to inspect connected evidence and claims.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
