import React, { useState } from 'react';

export function EdgeWeightModal({ sourceLabel, targetLabel, onConfirm, onCancel }) {
  const [label, setLabel] = useState('');
  const [weight, setWeight] = useState('0.50');

  const handleConfirm = () => {
    const w = Math.min(1, Math.max(0, parseFloat(weight) || 0.5));
    onConfirm(label.trim(), w);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p style={styles.title}>Nova Conexão</p>
        <p style={styles.subtitle}>
          <span style={styles.node}>{sourceLabel}</span>
          <span style={styles.arrow}> ──→ </span>
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
          {sourceLabel} --[{label || 'aresta'}({parseFloat(weight || 0).toFixed(2)})]→ {targetLabel}
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
};
