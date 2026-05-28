import React from 'react';
import { MODES } from '../constants';

const tools = [
  { mode: MODES.SELECT, icon: '↖', label: 'Selecionar', key: 'V' },
  { mode: MODES.ADD_NODE, icon: '◎', label: 'Adicionar Nó', key: 'N' },
  { mode: MODES.ADD_EDGE, icon: '→', label: 'Conectar', key: 'E' },
  { mode: MODES.DELETE, icon: '✕', label: 'Deletar', key: 'D' },
];

export function Toolbar({ mode, setMode }) {
  return (
    <div style={styles.toolbar}>
      <div style={styles.brand}>GRAFO<span style={styles.brandAccent}>EDITOR</span></div>
      <div style={styles.tools}>
        {tools.map((t) => (
          <button
            key={t.mode}
            title={`${t.label} [${t.key}]`}
            onClick={() => setMode(t.mode)}
            style={{ ...styles.btn, ...(mode === t.mode ? styles.btnActive : {}) }}
          >
            <span style={styles.icon}>{t.icon}</span>
            <span style={styles.label}>{t.label}</span>
            <kbd style={styles.kbd}>{t.key}</kbd>
          </button>
        ))}
      </div>
      <div style={styles.hint}>
        Duplo clique no nó/aresta para editar
      </div>
    </div>
  );
}

const styles = {
  toolbar: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'rgba(10,14,28,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', gap: 24,
    padding: '0 24px', height: 56,
  },
  brand: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15,
    letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)',
  },
  brandAccent: { color: '#4A90D9', marginLeft: 2 },
  tools: { display: 'flex', gap: 6 },
  btn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '5px 12px', borderRadius: 8,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer', fontSize: 12,
    fontFamily: "'Syne', sans-serif",
    transition: 'all 0.15s',
  },
  btnActive: {
    background: 'rgba(74,144,217,0.2)',
    border: '1px solid #4A90D9',
    color: '#fff',
  },
  icon: { fontSize: 14 },
  label: { fontSize: 11, fontWeight: 600 },
  kbd: {
    padding: '1px 5px', borderRadius: 4,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    fontSize: 9, color: 'rgba(255,255,255,0.4)',
    fontFamily: 'monospace',
  },
  hint: {
    marginLeft: 'auto', fontSize: 10,
    color: 'rgba(255,255,255,0.25)',
    fontFamily: "'Syne', sans-serif",
  },
};
