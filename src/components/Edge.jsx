import React, { useState } from 'react';
import { NODE_RADIUS } from '../constants';

function getEdgePoints(source, target) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const ARROW_LEN_LINE = 14; // length reserved for arrow shape
  const END_GAP = NODE_RADIUS + ARROW_LEN_LINE + 6; // leave more space so arrow is outside node
  return {
    x1: source.x + ux * NODE_RADIUS,
    y1: source.y + uy * NODE_RADIUS,
    x2: target.x - ux * END_GAP,
    y2: target.y - uy * END_GAP,
    mx: (source.x + target.x) / 2,
    my: (source.y + target.y) / 2,
    angle: Math.atan2(dy, dx) * (180 / Math.PI),
  };
}

export function Edge({ edge, source, target, isSelected, onEdgeClick, onLabelChange, onWeightChange }) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [editingWeight, setEditingWeight] = useState(false);
  const [draftLabel, setDraftLabel] = useState(edge.label || '');
  const [draftWeight, setDraftWeight] = useState(String(edge.weight ?? 0.5));

  if (!source || !target) return null;

  const { x1, y1, x2, y2, mx, my, angle } = getEdgePoints(source, target);
  const normalAngle = angle > 90 || angle < -90 ? angle + 180 : angle;
  const lineColor = isSelected ? '#F39C12' : 'rgba(255,255,255,0.6)';

  const commitLabel = () => {
    setEditingLabel(false);
    if (draftLabel !== edge.label) onLabelChange(edge.id, draftLabel);
  };
  const commitWeight = () => {
    setEditingWeight(false);
    const w = Math.min(1, Math.max(0, parseFloat(draftWeight)));
    if (!isNaN(w) && w !== edge.weight) onWeightChange(edge.id, w);
  };

  return (
    <g onClick={(e) => onEdgeClick(e, edge.id)} style={{ cursor: 'pointer' }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={22} />
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={lineColor} strokeWidth={isSelected ? 2.5 : 1.5}
        style={{ transition: 'stroke 0.15s' }}
      />

      {/* Label */}
      <g transform={`translate(${mx},${my}) rotate(${normalAngle})`}>
        <rect x={-38} y={-12} width={76} height={24} rx={12} fill="rgba(15,20,35,0.88)" stroke={lineColor} strokeWidth={1} />
        {!editingLabel ? (
          <text
            textAnchor="middle" dominantBaseline="middle"
            fill="#E8E8F0" fontSize="11" fontFamily="'Syne', sans-serif"
            onDoubleClick={(e) => { e.stopPropagation(); setDraftLabel(edge.label || ''); setEditingLabel(true); }}
            style={{ userSelect: 'none' }}
          >
            {(edge.label || 'aresta').slice(0, 10)}
          </text>
        ) : (
          <foreignObject x={-36} y={-10} width={72} height={20}>
            <input
              autoFocus value={draftLabel}
              onChange={(e) => setDraftLabel(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={(e) => { if (e.key === 'Enter') commitLabel(); e.stopPropagation(); }}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', textAlign: 'center', fontSize: 11,
                fontFamily: "'Syne', sans-serif",
              }}
            />
          </foreignObject>
        )}
      </g>

      {/* Weight badge */}
      <g transform={`translate(${mx + 42},${my - 18})`}>
        <rect x={-18} y={-10} width={36} height={20} rx={10} fill="#F39C12" />
        {!editingWeight ? (
          <text
            textAnchor="middle" dominantBaseline="middle"
            fill="#0F1423" fontSize="10" fontFamily="'Syne', sans-serif" fontWeight="700"
            onDoubleClick={(e) => { e.stopPropagation(); setDraftWeight(String(edge.weight ?? 0.5)); setEditingWeight(true); }}
            style={{ userSelect: 'none' }}
          >
            {typeof edge.weight === 'number' ? edge.weight.toFixed(2) : '0.50'}
          </text>
        ) : (
          <foreignObject x={-16} y={-9} width={32} height={18}>
            <input
              autoFocus value={draftWeight}
              onChange={(e) => setDraftWeight(e.target.value)}
              onBlur={commitWeight}
              onKeyDown={(e) => { if (e.key === 'Enter') commitWeight(); e.stopPropagation(); }}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                color: '#0F1423', textAlign: 'center', fontSize: 10,
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
              }}
            />
          </foreignObject>
        )}
      </g>
    </g>
  );
}

export function ArrowHead({ source, target, color = 'rgba(255,255,255,0.6)' }) {
  if (!source || !target) return null;
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const ARROW_LEN = 14;
  const ARROW_WIDTH = 12;
  // place tip further outside node border so it's fully visible
  const TIP_OFFSET = 8;
  const tipX = target.x - ux * (NODE_RADIUS + TIP_OFFSET);
  const tipY = target.y - uy * (NODE_RADIUS + TIP_OFFSET);
  const baseX = tipX - ux * ARROW_LEN;
  const baseY = tipY - uy * ARROW_LEN;
  // perpendicular
  const px = -uy;
  const py = ux;
  const p1x = baseX + (px * ARROW_WIDTH) / 2;
  const p1y = baseY + (py * ARROW_WIDTH) / 2;
  const p2x = baseX - (px * ARROW_WIDTH) / 2;
  const p2y = baseY - (py * ARROW_WIDTH) / 2;
  const points = `${tipX},${tipY} ${p1x},${p1y} ${p2x},${p2y}`;
  return <polygon points={points} fill={color} pointerEvents="none" />;
}

export function GhostLine({ ghostLine }) {
  if (!ghostLine) return null;
  return (
    <line
      x1={ghostLine.x1} y1={ghostLine.y1} x2={ghostLine.x2} y2={ghostLine.y2}
      stroke="#F39C12" strokeWidth={2} strokeDasharray="6 4" pointerEvents="none"
    />
  );
}
