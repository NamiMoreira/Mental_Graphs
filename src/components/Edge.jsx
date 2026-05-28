import React, { useState } from 'react';
import { NODE_RADIUS } from '../constants';

function getEdgePoints(source, target) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  return {
    x1: source.x + ux * NODE_RADIUS,
    y1: source.y + uy * NODE_RADIUS,
    x2: target.x - ux * (NODE_RADIUS + 10),
    y2: target.y - uy * (NODE_RADIUS + 10),
    mx: (source.x + target.x) / 2,
    my: (source.y + target.y) / 2,
    angle: Math.atan2(dy, dx) * (180 / Math.PI),
  };
}

export function Edge({ edge, source, target, isSelected, onEdgeClick, onLabelChange, onWeightChange }) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [editingWeight, setEditingWeight] = useState(false);
  const [draftLabel, setDraftLabel] = useState(edge.label || '');
  const [draftWeight, setDraftWeight] = useState(String(edge.weight ?? 1));

  if (!source || !target) return null;

  const { x1, y1, x2, y2, mx, my, angle } = getEdgePoints(source, target);

  const commitLabel = () => {
    setEditingLabel(false);
    if (draftLabel !== edge.label) onLabelChange(edge.id, draftLabel);
  };
  const commitWeight = () => {
    setEditingWeight(false);
    const w = parseFloat(draftWeight);
    if (!isNaN(w) && w !== edge.weight) onWeightChange(edge.id, w);
  };

  const lineColor = isSelected ? '#F39C12' : 'rgba(255,255,255,0.55)';

  return (
    <g onClick={(e) => onEdgeClick(e, edge.id)} style={{ cursor: 'pointer' }}>
      {/* Wider invisible hit area */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={20} />

      {/* Visible line */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={lineColor}
        strokeWidth={isSelected ? 2.5 : 1.5}
        markerEnd="url(#arrow)"
        style={{ transition: 'stroke 0.15s' }}
      />

      {/* Label pill */}
      <g transform={`translate(${mx},${my}) rotate(${angle > 90 || angle < -90 ? angle + 180 : angle})`}>
        <rect x={-32} y={-11} width={64} height={22} rx={11} fill="rgba(15,20,35,0.82)" stroke={lineColor} strokeWidth={1} />
        {!editingLabel ? (
          <text
            textAnchor="middle" dominantBaseline="middle"
            fill="#E8E8F0" fontSize="10" fontFamily="'Syne', sans-serif"
            onDoubleClick={(e) => { e.stopPropagation(); setDraftLabel(edge.label || ''); setEditingLabel(true); }}
            style={{ userSelect: 'none' }}
          >
            {edge.label || '—'}
          </text>
        ) : (
          <foreignObject x={-30} y={-9} width={60} height={18}>
            <input
              autoFocus value={draftLabel}
              onChange={(e) => setDraftLabel(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={(e) => { if (e.key === 'Enter') commitLabel(); e.stopPropagation(); }}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', textAlign: 'center', fontSize: 10, fontFamily: "'Syne', sans-serif",
              }}
            />
          </foreignObject>
        )}
      </g>

      {/* Weight badge */}
      <g transform={`translate(${mx + 20},${my - 20})`}>
        <rect x={-14} y={-9} width={28} height={18} rx={9} fill="#F39C12" />
        {!editingWeight ? (
          <text
            textAnchor="middle" dominantBaseline="middle"
            fill="#0F1423" fontSize="9" fontFamily="'Syne', sans-serif" fontWeight="700"
            onDoubleClick={(e) => { e.stopPropagation(); setDraftWeight(String(edge.weight ?? 1)); setEditingWeight(true); }}
            style={{ userSelect: 'none' }}
          >
            {edge.weight ?? 1}
          </text>
        ) : (
          <foreignObject x={-12} y={-8} width={24} height={16}>
            <input
              autoFocus value={draftWeight}
              onChange={(e) => setDraftWeight(e.target.value)}
              onBlur={commitWeight}
              onKeyDown={(e) => { if (e.key === 'Enter') commitWeight(); e.stopPropagation(); }}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                color: '#0F1423', textAlign: 'center', fontSize: 9, fontFamily: "'Syne', sans-serif", fontWeight: 700,
              }}
            />
          </foreignObject>
        )}
      </g>
    </g>
  );
}

export function GhostLine({ ghostLine }) {
  if (!ghostLine) return null;
  return (
    <line
      x1={ghostLine.x1} y1={ghostLine.y1}
      x2={ghostLine.x2} y2={ghostLine.y2}
      stroke="#F39C12" strokeWidth={2} strokeDasharray="6 4"
      pointerEvents="none"
    />
  );
}
