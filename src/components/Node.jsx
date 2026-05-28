import React, { useState } from 'react';
import { NODE_RADIUS } from '../constants';

export function Node({ node, isSelected, isEdgeSource, mode, onPointerDown, onLabelChange }) {
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

  const ringColor = isEdgeSource ? '#F39C12' : isSelected ? '#fff' : 'transparent';
  const ringWidth = isSelected || isEdgeSource ? 3 : 0;

  return (
    <g
      transform={`translate(${node.x},${node.y})`}
      style={{ cursor: mode === 'delete' ? 'not-allowed' : mode === 'add_edge' ? 'crosshair' : 'grab' }}
      onPointerDown={(e) => onPointerDown(e, node.id)}
      onDoubleClick={handleDoubleClick}
    >
      {/* Shadow */}
      <ellipse cx={2} cy={6} rx={NODE_RADIUS + 2} ry={14} fill="rgba(0,0,0,0.25)" />

      {/* Main balloon */}
      <circle
        r={NODE_RADIUS}
        fill={node.color || '#4A90D9'}
        stroke={ringColor}
        strokeWidth={ringWidth}
        style={{ filter: isSelected ? 'brightness(1.2)' : 'none', transition: 'all 0.15s' }}
      />

      {/* Balloon tail */}
      <path
        d={`M -8 ${NODE_RADIUS - 6} Q 0 ${NODE_RADIUS + 16} 8 ${NODE_RADIUS - 6}`}
        fill={node.color || '#4A90D9'}
      />

      {/* Label */}
      {!editing ? (
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="12"
          fontFamily="'Syne', sans-serif"
          fontWeight="700"
          pointerEvents="none"
          style={{ userSelect: 'none' }}
        >
          {node.label.length > 10 ? node.label.slice(0, 9) + '…' : node.label}
        </text>
      ) : (
        <foreignObject x={-NODE_RADIUS + 4} y={-14} width={(NODE_RADIUS - 4) * 2} height={28}>
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
    </g>
  );
}
