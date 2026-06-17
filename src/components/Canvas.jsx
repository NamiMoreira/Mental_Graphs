import React, { useEffect } from 'react';
import { Node } from './Node';
import { Edge, GhostLine, ArrowHead } from './Edge';
import { NODE_RADIUS } from '../constants';

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

  const { edgeGeoms, edgeOffsetMap } = React.useMemo(() => {
    const pairMap = new Map();
    edges.forEach((edge) => {
      const a = edge.source_id;
      const b = edge.target_id;
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      if (!pairMap.has(key)) pairMap.set(key, []);
      pairMap.get(key).push(edge);
    });

    const edgeGeomsLocal = [];
    const edgeOffsetMapLocal = new Map();

    const computeGeom = (source, target, offset) => {
      if (!source || !target) return null;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const ARROW_LEN_LINE = 14;
      const END_GAP = NODE_RADIUS + ARROW_LEN_LINE + 6;
      const x1 = source.x + ux * NODE_RADIUS;
      const y1 = source.y + uy * NODE_RADIUS;
      const x2 = target.x - ux * END_GAP;
      const y2 = target.y - uy * END_GAP;
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const px = -uy;
      const py = ux;
      const cx = midX + px * offset;
      const cy = midY + py * offset;
      const mx = 0.25 * x1 + 0.5 * cx + 0.25 * x2;
      const my = 0.25 * y1 + 0.5 * cy + 0.25 * y2;
      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
      const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
      return { x1, y1, x2, y2, cx, cy, mx, my, angle, d, offset };
    };

    const generateOffsets = (n, spacing = 18) => {
      if (n <= 0) return [];
      if (n === 1) return [0];
      const out = [];
      const base = (n % 2 === 0) ? (-(n - 1) / 2) : (-(n - 1) / 2);
      for (let i = 0; i < n; i++) out.push((i + base) * spacing);
      return out;
    };

    pairMap.forEach((group) => {
      // group contains all edges between two nodes (both directions possible)
      const a = group[0].source_id < group[0].target_id ? group[0].source_id : group[0].target_id;
      const b = group[0].source_id < group[0].target_id ? group[0].target_id : group[0].source_id;
      const forward = group.filter((e) => e.source_id === a && e.target_id === b);
      const backward = group.filter((e) => e.source_id === b && e.target_id === a);
      const spacing = 18;

      const makeLabelTs = (n) => {
        const out = [];
        if (n === 1) return [0.5];
        for (let i = 0; i < n; i++) {
          // spread t around 0.5
          const v = 0.5 + (i - (n - 1) / 2) * 0.12;
          out.push(Math.max(0.2, Math.min(0.8, v)));
        }
        return out;
      };

      if (forward.length > 0 && backward.length > 0) {
        // both directions: assign offsets away from center and label t positions
        const fLabelTs = makeLabelTs(forward.length);
        const bLabelTs = makeLabelTs(backward.length);
        forward.forEach((edge, i) => {
          const offset = spacing * (i + 1);
          const src = nodeById(edge.source_id);
          const dst = nodeById(edge.target_id);
          const labelT = fLabelTs[i] ?? 0.5;
          const geom = computeGeom(src, dst, offset);
          geom.labelT = labelT;
          edgeGeomsLocal.push({ edge, geom });
          edgeOffsetMapLocal.set(edge.id, offset);
        });
        backward.forEach((edge, i) => {
          const offset = -spacing * (i + 1);
          const src = nodeById(edge.source_id);
          const dst = nodeById(edge.target_id);
          const labelT = bLabelTs[i] ?? 0.5;
          const geom = computeGeom(src, dst, offset);
          geom.labelT = labelT;
          edgeGeomsLocal.push({ edge, geom });
          edgeOffsetMapLocal.set(edge.id, offset);
        });
      } else {
        // single direction list
        const list = forward.length > 0 ? forward : backward;
        const n = list.length;
        const labelTs = makeLabelTs(n);
        if (n === 1) {
          const edge = list[0];
          const src = nodeById(edge.source_id);
          const dst = nodeById(edge.target_id);
          const geom = computeGeom(src, dst, 0);
          geom.labelT = 0.5;
          edgeGeomsLocal.push({ edge, geom });
          edgeOffsetMapLocal.set(edge.id, 0);
        } else {
          for (let i = 0; i < n; i++) {
            const offset = ((i - (n - 1) / 2) * spacing);
            const edge = list[i];
            const src = nodeById(edge.source_id);
            const dst = nodeById(edge.target_id);
            const labelT = labelTs[i] ?? 0.5;
            const geom = computeGeom(src, dst, offset);
            geom.labelT = labelT;
            edgeGeomsLocal.push({ edge, geom });
            edgeOffsetMapLocal.set(edge.id, offset);
          }
        }
      }
    });

    return { edgeGeoms: edgeGeomsLocal, edgeOffsetMap: edgeOffsetMapLocal };
  }, [edges, nodes]);

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
        {edgeGeoms.map(({ edge, geom }) => (
          <Edge
            key={edge.id}
            edge={edge}
            source={nodeById(edge.source_id)}
            target={nodeById(edge.target_id)}
            geom={geom}
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
        {edgeGeoms.map(({ edge, geom }) => (
          <ArrowHead key={edge.id + '-arrow'} source={nodeById(edge.source_id)} target={nodeById(edge.target_id)} ctrl={geom} color={selected?.type === 'edge' && selected.id === edge.id ? '#F39C12' : 'rgba(255,255,255,0.6)'} />
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
