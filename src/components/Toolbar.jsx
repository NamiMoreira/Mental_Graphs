import React from 'react';
import { MODES } from '../constants';

const tools = [
  { mode: MODES.SELECT,   icon: '↖', label: 'Selecionar', shortcut: 'V', color: '#4A90D9' },
  { mode: MODES.ADD_NODE, icon: '◎', label: 'Objeto',     shortcut: 'N', color: '#9B59B6' },
  { mode: MODES.ADD_EDGE, icon: '→', label: 'Conectar',   shortcut: 'E', color: '#F39C12' },
  { mode: MODES.ROUTE,    icon: '⇢', label: 'Rota',       shortcut: 'R', color: '#2ECC71' },
  { mode: MODES.DELETE,   icon: '✕', label: 'Deletar',    shortcut: 'D', color: '#E74C3C' },
];

export function Toolbar({ mode, setMode }) {
  return (
    <div style={styles.toolbar}>
      <div style={styles.brand}>MENTAL<span style={styles.brandAccent}>GRAPHS</span></div>
      <div style={styles.tools}>
        {tools.map((t) => {
          const isActive = mode === t.mode;
          const btnStyle = isActive
            ? {
                ...styles.btn,
                fontWeight: 700,
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: t.color,
                color: t.color,
                background: `${t.color}22`,
              }
            : styles.btn;

          return (
            <button
              key={t.mode}
              title={`${t.label} [${t.shortcut}]`}
              onClick={() => setMode(t.mode)}
              style={btnStyle}
            >
              <span style={styles.icon}>{t.icon}</span>
              <span style={styles.label}>{t.label}</span>
              <kbd style={styles.kbd}>{t.shortcut}</kbd>
            </button>
          );
        })}
      </div>
      <div style={styles.hint}>Duplo clique para editar • Delete para remover selecionado</div>
    </div>
  );
}

const styles = {
  toolbar: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'rgba(10,14,28,0.95)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', gap: 20,
    padding: '0 24px', height: 58,
  },
  brand: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14,
    letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap',
  },
  brandAccent: { color: '#4A90D9' },
  tools: { display: 'flex', gap: 6 },
  btn: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '5px 13px',
    borderRadius: 8, background: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: 12,
    fontFamily: "'Syne', sans-serif", transition: 'all 0.15s', whiteSpace: 'nowrap',
  },
  icon: { fontSize: 15 },
  label: { fontSize: 11, fontWeight: 600 },
  kbd: {
    padding: '1px 5px', borderRadius: 4,
    background: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.1)',
    fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace',
  },
  hint: {
    marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.2)',
    fontFamily: "'Syne', sans-serif", whiteSpace: 'nowrap',
  },
};
