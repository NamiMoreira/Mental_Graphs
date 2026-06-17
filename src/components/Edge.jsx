import React, { useState } from 'react';
import { NODE_RADIUS } from '../constants';

export function Edge({ edge, source, target, geom, isSelected, onEdgeClick, onLabelChange, onWeightChange }) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [editingWeight, setEditingWeight] = useState(false);
  const [draftLabel, setDraftLabel] = useState(edge.label || '');
  const [draftWeight, setDraftWeight] = useState(String(edge.weight ?? 0.5));
  if (!source || !target || !geom) return null;

  const { x1, y1, x2, y2, mx, my, angle, cx, cy, d, offset = 0, labelT = 0.5 } = geom;
  const normalAngle = angle > 90 || angle < -90 ? angle + 180 : angle;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const px = -uy;
  const py = ux;
  const side = offset === 0 ? 1 : Math.sign(offset);
  const labelPadBase = 12;
  const labelPad = labelPadBase + Math.abs(offset) * 0.6;
  // compute point along quadratic Bezier at t = labelT
  const t = labelT;
  const mt = 1 - t;
  const bx = mt * mt * x1 + 2 * mt * t * cx + t * t * x2;
  const by = mt * mt * y1 + 2 * mt * t * cy + t * t * y2;
  // derivative for tangent
  const dxdt = 2 * mt * (cx - x1) + 2 * t * (x2 - cx);
  const dydt = 2 * mt * (cy - y1) + 2 * t * (y2 - cy);
  const dlen = Math.hypot(dxdt, dydt) || 1;
  const nx = -dydt / dlen; // normal vector
  const ny = dxdt / dlen;
  const lx = bx + nx * labelPad * side;
  const ly = by + ny * labelPad * side;
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
      <path d={d} stroke="transparent" strokeWidth={22} fill="none" />
      <path d={d} stroke={lineColor} strokeWidth={isSelected ? 2.5 : 1.5} fill="none" style={{ transition: 'stroke 0.15s' }} />

      {/* Label */}
      <g transform={`translate(${lx},${ly})`}>
        <rect x={-48} y={-14} width={96} height={28} rx={12} fill="rgba(15,20,35,0.88)" stroke={lineColor} strokeWidth={1} />
        {!editingLabel ? (
          <text
            textAnchor="middle" dominantBaseline="middle"
            fill="#E8E8F0" fontSize="11" fontFamily="'Syne', sans-serif"
            onDoubleClick={(e) => { e.stopPropagation(); setDraftLabel(edge.label || ''); setEditingLabel(true); }}
            style={{ userSelect: 'none' }}
          >
            {(edge.label || 'aresta').slice(0, 16)}
          </text>
        ) : (
          <foreignObject x={-44} y={-12} width={88} height={24}>
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

      {/* Weight badge placed to the side based on edge side */}
      <g transform={`translate(${lx + (side * 56)},${ly - 6})`}>
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

export function ArrowHead({ source, target, ctrl, color = 'rgba(255,255,255,0.6)' }) {
  if (!source || !target || !ctrl) return null;
  const dx = target.x - ctrl.cx;
  const dy = target.y - ctrl.cy;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const ARROW_LEN = 14;
  const ARROW_WIDTH = 12;
  const TIP_OFFSET = 8;
  const tipX = target.x - ux * (NODE_RADIUS + TIP_OFFSET);
  const tipY = target.y - uy * (NODE_RADIUS + TIP_OFFSET);
  const baseX = tipX - ux * ARROW_LEN;
  const baseY = tipY - uy * ARROW_LEN;
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
