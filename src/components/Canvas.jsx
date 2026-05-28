import React, { useEffect } from 'react';
import { Node } from './Node';
import { Edge, GhostLine } from './Edge';

export function Canvas({
  nodes, edges,
  svgRef, mode, selected, edgeSource, ghostLine,
  onCanvasPointerDown, onNodePointerDown,
  onPointerMove, onPointerUp, onKeyDown,
  onEdgeClick, onLabelChange, onEdgeLabelChange, onEdgeWeightChange,
}) {
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  const nodeById = (id) => nodes.find((n) => n.id === id);

  const canvasCursor =
    mode === 'add_node' ? 'crosshair' :
    mode === 'delete' ? 'not-allowed' :
    mode === 'add_edge' ? 'crosshair' : 'default';

  return (
    <svg
      ref={svgRef}
      style={{ ...styles.svg, cursor: canvasCursor }}
      onPointerDown={onCanvasPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.55)" />
        </marker>
        <marker id="arrow-selected" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#F39C12" />
        </marker>

        {/* Grid pattern */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        </pattern>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#0F1A2E" />
          <stop offset="100%" stopColor="#070C18" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="100%" height="100%" fill="url(#bgGrad)" />
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Edges (rendered below nodes) */}
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

      {/* Ghost line while drawing an edge */}
      <GhostLine ghostLine={ghostLine} />

      {/* Nodes */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          mode={mode}
          isSelected={selected?.type === 'node' && selected.id === node.id}
          isEdgeSource={edgeSource === node.id}
          onPointerDown={onNodePointerDown}
          onLabelChange={onLabelChange}
        />
      ))}
    </svg>
  );
}

const styles = {
  svg: {
    position: 'fixed', inset: 0,
    width: '100vw', height: '100vh',
    touchAction: 'none',
  },
};
