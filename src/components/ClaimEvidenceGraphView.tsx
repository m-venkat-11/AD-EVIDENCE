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
import type { GraphNode, GraphEdge, ClaimPassport, Product } from '../types';

interface ClaimEvidenceGraphViewProps {
  claims: ClaimPassport[];
  product?: Product;
  onSelectClaim: (claimId: string) => void;
}

export const ClaimEvidenceGraphView: React.FC<ClaimEvidenceGraphViewProps> = ({
  claims,
  product,
  onSelectClaim
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Dynamically compute nodes and edges from claims and product
  const { nodes: dynamicNodes, edges: dynamicEdges } = React.useMemo(() => {
    if (!claims || claims.length === 0) {
      return { nodes: [], edges: [] };
    }

    const brandName = product?.brandName || claims[0]?.brandName || 'Brand';
    const productName = product?.productName || claims[0]?.productName || 'Audited Product';

    const nodesList: GraphNode[] = [
      {
        id: 'brand-main',
        label: brandName,
        subLabel: 'Manufacturer / Brand',
        type: 'brand',
        color: '#00E5FF',
        val: 26
      },
      {
        id: 'prod-main',
        label: productName.length > 28 ? productName.slice(0, 26) + '...' : productName,
        subLabel: product?.modelNumber || 'Product Entity',
        type: 'product',
        color: '#3D5AFE',
        val: 28
      }
    ];

    const edgesList: GraphEdge[] = [
      {
        id: 'edge-brand-prod',
        source: 'brand-main',
        target: 'prod-main',
        label: 'Manufactures',
        status: 'normal'
      }
    ];

    claims.slice(0, 6).forEach((claim) => {
      nodesList.push({
        id: claim.id,
        label: claim.advertisedWording.length > 28 ? claim.advertisedWording.slice(0, 26) + '...' : claim.advertisedWording,
        subLabel: `${claim.id} • ${claim.status}`,
        type: 'claim',
        color: claim.status === 'CONTRADICTED' ? '#FF2FA3' : claim.status === 'SUPPORTED' ? '#00FF87' : '#FF8A1E',
        status: claim.status,
        val: 22
      });

      edgesList.push({
        id: `edge-prod-${claim.id}`,
        source: 'prod-main',
        target: claim.id,
        label: 'Asserts Claim',
        status: claim.status === 'CONTRADICTED' ? 'conflict' : 'normal'
      });

      claim.sources.slice(0, 2).forEach((src, sIdx) => {
        const srcId = `src-${claim.id}-${sIdx}`;
        const isConflict = src.conflictFlag || claim.status === 'CONTRADICTED';
        nodesList.push({
          id: srcId,
          label: src.sourceName.length > 26 ? src.sourceName.slice(0, 24) + '...' : src.sourceName,
          subLabel: `${src.observedValue} (${src.sourceType})`,
          type: src.sourceType === 'OFFICIAL_BRAND' ? 'official' : src.sourceType === 'INDEPENDENT_LAB' ? 'lab' : 'retailer',
          color: isConflict ? '#FF2FA3' : '#00E5FF',
          val: 16
        });

        edgesList.push({
          id: `edge-${claim.id}-${srcId}`,
          source: claim.id,
          target: srcId,
          label: isConflict ? 'Contradicts' : 'Evidence Grounding',
          status: isConflict ? 'conflict' : 'normal'
        });
      });
    });

    return { nodes: nodesList, edges: edgesList };
  }, [claims, product]);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  React.useEffect(() => {
    if (dynamicNodes.length > 2) {
      setSelectedNode(dynamicNodes[2]); // Default to first claim node
    } else if (dynamicNodes.length > 0) {
      setSelectedNode(dynamicNodes[0]);
    } else {
      setSelectedNode(null);
    }
  }, [dynamicNodes]);

  // Filter nodes
  const filteredNodes = dynamicNodes.filter((node) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'claims') return node.type === 'claim';
    if (activeFilter === 'evidence') return ['official', 'lab', 'provenance'].includes(node.type);
    if (activeFilter === 'sources') return ['official', 'retailer', 'lab'].includes(node.type);
    if (activeFilter === 'ads') return node.type === 'ad';
    if (activeFilter === 'consumers') return node.type === 'consumer';
    if (activeFilter === 'brands') return ['brand', 'product'].includes(node.type);
    return true;
  });

  // Calculate coordinates for graph nodes on canvas (920x600)
  const getNodeCoordinates = (nodeId: string, index: number, total: number) => {
    if (nodeId === 'brand-main') return { x: 90, y: 300 };
    if (nodeId === 'prod-main') return { x: 270, y: 300 };

    // Claims column at x = 510
    const claimNodes = dynamicNodes.filter(n => n.type === 'claim');
    const claimIndex = claimNodes.findIndex(n => n.id === nodeId);
    if (claimIndex !== -1) {
      const spacing = Math.min(85, 480 / (claimNodes.length || 1));
      return {
        x: 510,
        y: 120 + claimIndex * spacing
      };
    }

    // Sources column at x = 750
    const srcNodes = dynamicNodes.filter(n => ['official', 'lab', 'retailer', 'consumer'].includes(n.type));
    const srcIndex = srcNodes.findIndex(n => n.id === nodeId);
    if (srcIndex !== -1) {
      const spacing = Math.min(65, 500 / (srcNodes.length || 1));
      return {
        x: 750,
        y: 80 + srcIndex * spacing
      };
    }

    const angle = (index / (total || 1)) * 2 * Math.PI;
    return {
      x: 460 + 240 * Math.cos(angle),
      y: 300 + 170 * Math.sin(angle)
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

            {/* Zero State if no nodes exist */}
            {dynamicNodes.length === 0 && (
              <g>
                <text x="460" y="280" textAnchor="middle" fill="#F5F7FF" fontSize="16" fontWeight="700">
                  No Active Graph Data
                </text>
                <text x="460" y="310" textAnchor="middle" fill="#AEB6C2" fontSize="13">
                  Verify an advertisement in the Verification Studio to generate an interactive Claim-Evidence graph.
                </text>
              </g>
            )}

            {/* Edge Connections */}
            <g className="edges-layer">
              {dynamicEdges.map((edge) => {
                const srcNode = dynamicNodes.find(n => n.id === edge.source);
                const tgtNode = dynamicNodes.find(n => n.id === edge.target);
                if (!srcNode || !tgtNode) return null;

                const p1 = getNodeCoordinates(edge.source, 0, dynamicNodes.length);
                const p2 = getNodeCoordinates(edge.target, 0, dynamicNodes.length);

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
                    {dynamicEdges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map(e => (
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
