import React, { useEffect } from 'react';
import { Node } from './Node';
import { Edge, GhostLine, ArrowHead } from './Edge';

export function Canvas({
  nodes, edges,
  svgRef, mode, selected, edgeSource, ghostLine, routeSequence,
  onCanvasPointerDown, onNodePointerDown,
  onPointerMove, onPointerUp, onKeyDown,
  onEdgeClick, onLabelChange, onEdgeLabelChange, onEdgeWeightChange,
  scale = 1, pan = { x: 0, y: 0 }, onWheel = () => {},
}) {
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  const nodeById = (id) => nodes.find((n) => n.id === id);

  const cursorMap = {
    add_node: 'crosshair', delete: 'not-allowed',
    add_edge: 'crosshair', route: 'crosshair', select: 'default',
  };

  // Fires for any click on SVG that is NOT a node or edge
  const handleSVGPointerDown = (e) => {
    // Treat clicks on background shapes (rect, pattern, etc.) as canvas pointer down,
    // but ignore clicks on interactive elements like nodes/edges/text/inputs.
    const tag = e.target.tagName && e.target.tagName.toLowerCase();
    const ignore = ['circle', 'text', 'tspan', 'path', 'ellipse', 'foreignobject', 'input', 'polygon'];
    if (ignore.includes(tag)) return;
    onCanvasPointerDown(e);
  };

  return (
    <svg
      ref={svgRef}
      style={{ ...styles.svg, cursor: cursorMap[mode] || 'default' }}
      onPointerDown={handleSVGPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
    >
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.6)" />
        </marker>
        <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        </pattern>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#0F1A2E" />
          <stop offset="100%" stopColor="#060B16" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#bgGrad)" />
      <rect width="100%" height="100%" fill="url(#grid)" />

      <g transform={`translate(${pan.x},${pan.y}) scale(${scale})`}>
        {edges.map((edge) => (
          <Edge
            key={edge.id}
            edge={edge}
            source={nodeById(edge.source_id)}
            target={nodeById(edge.target_id)}
            isSelected={selected?.type === 'edge' && selected.id === edge.id}
            onEdgeClick={onEdgeClick}
            onLabelChange={onEdgeLabelChange}
            onWeightChange={onEdgeWeightChange}
          />
        ))}

        <GhostLine ghostLine={ghostLine} />

        {nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            mode={mode}
            isSelected={selected?.type === 'node' && selected.id === node.id}
            isEdgeSource={edgeSource === node.id}
            isRouteNode={routeSequence?.includes(node.id)}
            onPointerDown={onNodePointerDown}
            onLabelChange={onLabelChange}
          />
        ))}
      </g>
      {/* Draw arrowheads above nodes so they remain visible */}
      <g transform={`translate(${pan.x},${pan.y}) scale(${scale})`} pointerEvents="none">
        {edges.map((edge) => (
          <ArrowHead key={edge.id + '-arrow'} source={nodeById(edge.source_id)} target={nodeById(edge.target_id)} color={selected?.type === 'edge' && selected.id === edge.id ? '#F39C12' : 'rgba(255,255,255,0.6)'} />
        ))}
      </g>
    </svg>
  );
}

const styles = {
  svg: {
    position: 'fixed', inset: 0, width: '100vw', height: '100vh', touchAction: 'none',
  },
};
