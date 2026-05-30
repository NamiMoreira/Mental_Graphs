import React, { useState } from 'react';
import { NODE_RADIUS } from '../constants';

export function Node({ node, isSelected, isEdgeSource, isRouteNode, mode, onPointerDown, onLabelChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(node.label);

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setDraft(node.label);
    setEditing(true);
  };

  const commitEdit = () => {
    setEditing(false);
    if (draft.trim() && draft !== node.label) onLabelChange(node.id, draft.trim());
  };

  const ringColor = isRouteNode ? '#2ECC71' : isEdgeSource ? '#F39C12' : isSelected ? '#fff' : 'transparent';
  const ringWidth = isSelected || isEdgeSource || isRouteNode ? 3 : 0;

  // Wrap label into lines of ~12 chars
  const words = node.label.split(' ');
  const lines = [];
  let current = '';
  for (const w of words) {
    if ((current + ' ' + w).trim().length > 13) {
      if (current) lines.push(current.trim());
      current = w;
    } else {
      current = (current + ' ' + w).trim();
    }
  }
  if (current) lines.push(current.trim());
  const lineHeight = 14;
  const startY = -(lines.length - 1) * lineHeight / 2;

  const cursor = mode === 'delete' ? 'not-allowed' : mode === 'add_edge' || mode === 'route' ? 'crosshair' : 'grab';

  return (
    <g
      transform={`translate(${node.x},${node.y})`}
      style={{ cursor }}
      onPointerDown={(e) => onPointerDown(e, node.id)}
      onDoubleClick={handleDoubleClick}
    >
      {/* Shadow */}
      <ellipse cx={3} cy={NODE_RADIUS - 4} rx={NODE_RADIUS} ry={12} fill="rgba(0,0,0,0.3)" />

      {/* Body */}
      <circle
        r={NODE_RADIUS}
        fill={node.color || '#4A90D9'}
        stroke={ringColor}
        strokeWidth={ringWidth}
        style={{ filter: isSelected ? 'brightness(1.2)' : 'none', transition: 'all 0.15s' }}
      />

      {/* Tail */}
      <path
        d={`M -10 ${NODE_RADIUS - 8} Q 0 ${NODE_RADIUS + 20} 10 ${NODE_RADIUS - 8}`}
        fill={node.color || '#4A90D9'}
      />

      {/* Label */}
      {!editing ? (
        <text
          textAnchor="middle"
          fill="#fff"
          fontSize="12"
          fontFamily="'Syne', sans-serif"
          fontWeight="700"
          pointerEvents="none"
          style={{ userSelect: 'none' }}
        >
          {lines.map((line, i) => (
            <tspan key={i} x={0} y={startY + i * lineHeight} dominantBaseline="middle">{line}</tspan>
          ))}
        </text>
      ) : (
        <foreignObject x={-(NODE_RADIUS - 6)} y={-16} width={(NODE_RADIUS - 6) * 2} height={32}>
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); e.stopPropagation(); }}
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', textAlign: 'center', fontSize: 12,
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
            }}
          />
        </foreignObject>
      )}

      {/* Route order badge */}
      {isRouteNode && (
        <circle cx={NODE_RADIUS - 8} cy={-(NODE_RADIUS - 8)} r={10} fill="#2ECC71" />
      )}
    </g>
  );
}
