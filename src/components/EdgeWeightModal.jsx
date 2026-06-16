import React, { useState } from 'react';

export function EdgeWeightModal({ sourceLabel, targetLabel, onConfirm, onCancel }) {
  const [label, setLabel] = useState('');
  const [weight, setWeight] = useState('0.50');
  const [direction, setDirection] = useState('forward'); // 'forward' | 'backward' | 'both'

  const handleConfirm = () => {
    const w = Math.min(1, Math.max(0, parseFloat(weight) || 0.5));
    onConfirm(label.trim(), w, direction);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p style={styles.title}>Nova Conexão</p>
        <p style={styles.subtitle}>
          <span style={styles.node}>{sourceLabel}</span>
          <span style={styles.arrow}> ──{direction === 'forward' ? '→' : direction === 'backward' ? '←' : '↔'} </span>
          <span style={styles.node}>{targetLabel}</span>
        </p>

        <label style={styles.label}>Nome da aresta</label>
        <input
          autoFocus
          style={styles.input}
          placeholder="ex: possui, conecta, implica..."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
        />

        <label style={styles.label}>Peso (0.00 a 1.00)</label>
        <input
          style={styles.input}
          type="number" min="0" max="1" step="0.01"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
        />

        <div style={styles.preview}>
          {direction === 'forward' && (
            <>{sourceLabel} --[{label || 'aresta'}({parseFloat(weight || 0).toFixed(2)})]→ {targetLabel}</>
          )}
          {direction === 'backward' && (
            <>{targetLabel} --[{label || 'aresta'}({parseFloat(weight || 0).toFixed(2)})]→ {sourceLabel}</>
          )}
          {direction === 'both' && (
            <>{sourceLabel} ⇄ {targetLabel} --[{label || 'aresta'}({parseFloat(weight || 0).toFixed(2)})]</>
          )}
        </div>

        <div style={styles.directionGroupRow}>
          <button type="button" onClick={() => setDirection('forward')} style={{ ...styles.dirBtn, ...(direction === 'forward' ? styles.dirBtnActive : {}) }} aria-pressed={direction === 'forward'}>
            <svg width="100" height="64" viewBox="0 0 100 64" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="96" height="56" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
              <circle cx="26" cy="26" r="8" fill="#4A90D9" />
              <circle cx="74" cy="26" r="8" fill="#4A90D9" />
              <line x1="36" y1="26" x2="58" y2="26" stroke="#F39C12" strokeWidth="2" />
              <polygon points="64,26 58,22 58,30" fill="#F39C12" />
              <text x="50" y="50" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="11">A → B</text>
            </svg>
          </button>

          <button type="button" onClick={() => setDirection('backward')} style={{ ...styles.dirBtn, ...(direction === 'backward' ? styles.dirBtnActive : {}) }} aria-pressed={direction === 'backward'}>
            <svg width="100" height="64" viewBox="0 0 100 64" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="96" height="56" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
              <circle cx="26" cy="26" r="8" fill="#4A90D9" />
              <circle cx="74" cy="26" r="8" fill="#4A90D9" />
              <line x1="58" y1="26" x2="40" y2="26" stroke="#F39C12" strokeWidth="2" />
              <polygon points="36,26 42,22 42,30" fill="#F39C12" />
              <text x="50" y="50" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="11">B → A</text>
            </svg>
          </button>

          <button type="button" onClick={() => setDirection('both')} style={{ ...styles.dirBtn, ...(direction === 'both' ? styles.dirBtnActive : {}) }} aria-pressed={direction === 'both'}>
            <svg width="100" height="64" viewBox="0 0 100 64" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="96" height="56" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
              <circle cx="26" cy="22" r="8" fill="#4A90D9" />
              <circle cx="74" cy="22" r="8" fill="#4A90D9" />
              {/* both arrows on same horizontal line, spaced to avoid overlap */}
              <line x1="36" y1="22" x2="56" y2="22" stroke="#F39C12" strokeWidth="2" />
              <polygon points="62,22 56,18 56,26" fill="#F39C12" />
              <line x1="44" y1="22" x2="30" y2="22" stroke="#F39C12" strokeWidth="2" />
              <polygon points="30,22 36,18 36,26" fill="#F39C12" />
              <text x="50" y="52" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="11">A ↔ B</text>
            </svg>
          </button>
        </div>

        <div style={styles.btns}>
          <button style={styles.btnCancel} onClick={onCancel}>Cancelar</button>
          <button style={styles.btnOk} onClick={handleConfirm}>Criar Conexão</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 200,
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modal: {
    background: '#0F1423', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 16, padding: 28, width: 340,
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  },
  title: {
    margin: '0 0 8px', fontSize: 16, fontWeight: 800,
    color: '#fff', fontFamily: "'Syne', sans-serif",
  },
  subtitle: { margin: '0 0 20px', fontSize: 13 },
  node: {
    background: 'rgba(74,144,217,0.2)', color: '#4A90D9',
    padding: '2px 8px', borderRadius: 6, fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
  },
  arrow: { color: 'rgba(255,255,255,0.4)', fontSize: 16 },
  label: {
    display: 'block', fontSize: 10, fontWeight: 700,
    color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
    letterSpacing: '0.1em', marginBottom: 6,
    fontFamily: "'Syne', sans-serif",
  },
  input: {
    display: 'block', width: '100%', marginBottom: 14,
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8, color: '#fff', padding: '8px 12px', fontSize: 13,
    fontFamily: "'Syne', sans-serif", boxSizing: 'border-box', outline: 'none',
  },
  preview: {
    fontSize: 11, color: '#F39C12', fontFamily: 'monospace',
    background: 'rgba(243,156,18,0.08)', borderRadius: 6,
    padding: '6px 10px', marginBottom: 20, wordBreak: 'break-all',
  },
  btns: { display: 'flex', gap: 10 },
  btnCancel: {
    flex: 1, padding: '8px', borderRadius: 8,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 12,
    fontFamily: "'Syne', sans-serif",
  },
  btnOk: {
    flex: 2, padding: '8px', borderRadius: 8,
    background: 'rgba(74,144,217,0.25)', border: '1px solid #4A90D9',
    color: '#4A90D9', cursor: 'pointer', fontSize: 12, fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
  },
  directionGroup: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 },
  dirLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontFamily: "'Syne', sans-serif" },
  directionGroupRow: { display: 'flex', gap: 8, marginBottom: 12 },
  dirBtn: {
    padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 8,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
  },
  dirBtnActive: { outline: '2px solid rgba(243,156,18,0.18)', boxShadow: '0 6px 20px rgba(243,156,18,0.08)' },
};
