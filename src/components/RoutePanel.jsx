import React, { useState } from 'react';
import { RouteModal } from './RouteModal';

export function RoutePanel({ nodes, edges, routes, routeSequence, onRemoveRoute, onClearRoute, onSaveRoute, onUpdateRoute }) {
  const [routeName, setRouteName] = useState('');
  const [open, setOpen] = useState(true);
  const [editingRoute, setEditingRoute] = useState(null);

  const nodeLabel = (id) => nodes.find((n) => n.id === id)?.label || '?';

  const buildPreview = () => {
    if (routeSequence.length === 0) return '';
    const parts = [];
    for (let i = 0; i < routeSequence.length; i++) {
      parts.push(nodeLabel(routeSequence[i]));
      if (i < routeSequence.length - 1) {
        const edge = edges.find(
          (e) => e.source_id === routeSequence[i] && e.target_id === routeSequence[i + 1]
        );
        parts.push(`--[${edge?.label || 'conecta'}(${edge?.weight?.toFixed(2) ?? '0.50'})]-->`);
      }
    }
    return parts.join(' ');
  };

  const handleSave = () => {
    if (routeSequence.length < 2) return;
    const name = routeName.trim() || `Rota ${routes.length + 1}`;
    onSaveRoute(name, routeSequence);
    setRouteName('');
  };

  return (
    <div style={{ ...styles.panel, width: open ? 340 : 48 }}>
      <button style={styles.toggle} onClick={() => setOpen((o) => !o)}>
        <span style={styles.toggleIcon}>⇄</span>
        {open && <span style={styles.toggleLabel}>Rotas</span>}
      </button>

      {open && (
        <div style={styles.body}>

          {/* BUILD ROUTE */}
          <div style={styles.section}>
            <p style={styles.sectionTitle}>🔗 Construir Rota</p>
            <p style={styles.hint}>
              Ative o modo <strong style={{ color: '#2ECC71' }}>Rota</strong> na toolbar e clique nos objetos em sequência.
            </p>

            {routeSequence.length > 0 && (
              <>
                <div style={styles.sequenceBox}>
                  {routeSequence.map((id, i) => (
                    <React.Fragment key={id}>
                      <span style={styles.seqNode}>{nodeLabel(id)}</span>
                      {i < routeSequence.length - 1 && <span style={styles.seqArrow}>→</span>}
                    </React.Fragment>
                  ))}
                </div>

                <div style={styles.previewBox}>{buildPreview()}</div>

                <input
                  style={styles.input}
                  placeholder="Nome da rota (opcional)"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />

                <div style={styles.btnRow}>
                  <button style={styles.btnClear} onClick={onClearRoute}>Limpar</button>
                  <button style={styles.btnSave} onClick={handleSave}>Salvar Rota</button>
                </div>
              </>
            )}
          </div>

          {/* SAVED ROUTES */}
          <div style={styles.section}>
            <p style={styles.sectionTitle}>📋 Rotas Salvas ({routes.length})</p>
            {routes.length === 0 && <p style={styles.empty}>Nenhuma rota salva.</p>}
            <div style={styles.routeList}>
              {routes.map((r) => (
                <div key={r.id} style={styles.routeItem}>
                  <div style={{ flex: 1, minWidth: 0 }} onClick={() => setEditingRoute(r)}>
                    <p style={styles.routeName}>{r.name}</p>
                    <p style={styles.routeDesc}>{r.descricao}</p>
                    <p style={styles.routeMeta}>Peso total: {r.total_weight}</p>
                  </div>
                  <button style={styles.btnDel} onClick={() => onRemoveRoute(r.id)}>✕</button>
                </div>
              ))}
            </div>
            <RouteModal open={!!editingRoute} route={editingRoute} nodes={nodes} onClose={() => setEditingRoute(null)} onSave={(r) => { onUpdateRoute(r.id, { name: r.name }); setEditingRoute(null); }} />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  panel: {
    position: 'fixed', right: 16, top: 72, bottom: 16, zIndex: 90,
    background: 'rgba(10,14,28,0.94)',
    backdropFilter: 'blur(14px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14, overflow: 'hidden',
    transition: 'width 0.25s ease',
    display: 'flex', flexDirection: 'column',
  },
  toggle: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '12px 14px', background: 'none', border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    color: '#4A90D9', cursor: 'pointer',
    fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700,
    whiteSpace: 'nowrap', flexShrink: 0,
  },
  toggleIcon: { fontSize: 16 },
  toggleLabel: { fontSize: 12 },
  body: { flex: 1, overflowY: 'auto', padding: '12px 14px 16px' },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
    margin: '0 0 10px', fontFamily: "'Syne', sans-serif",
  },
  hint: {
    fontSize: 11, color: 'rgba(255,255,255,0.35)',
    margin: '0 0 10px', lineHeight: 1.5,
    fontFamily: "'Syne', sans-serif",
  },
  sequenceBox: {
    display: 'flex', flexWrap: 'wrap', gap: 4,
    background: 'rgba(255,255,255,0.04)', borderRadius: 8,
    padding: 10, marginBottom: 10, alignItems: 'center',
  },
  seqNode: {
    background: 'rgba(74,144,217,0.2)', color: '#4A90D9',
    padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
  },
  seqArrow: { color: 'rgba(255,255,255,0.3)', fontSize: 14 },
  previewBox: {
    fontSize: 10, color: '#F39C12', fontFamily: 'monospace',
    background: 'rgba(243,156,18,0.07)', borderRadius: 6,
    padding: '7px 10px', marginBottom: 10,
    wordBreak: 'break-all', lineHeight: 1.6,
  },
  input: {
    display: 'block', width: '100%', marginBottom: 10,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#fff', padding: '7px 10px', fontSize: 12,
    fontFamily: "'Syne', sans-serif", boxSizing: 'border-box', outline: 'none',
  },
  btnRow: { display: 'flex', gap: 8 },
  btnClear: {
    flex: 1, padding: '7px', borderRadius: 8,
    background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)',
    color: '#E74C3C', cursor: 'pointer', fontSize: 11,
    fontFamily: "'Syne', sans-serif",
  },
  btnSave: {
    flex: 2, padding: '7px', borderRadius: 8,
    background: 'rgba(46,204,113,0.15)', border: '1px solid #2ECC71',
    color: '#2ECC71', cursor: 'pointer', fontSize: 11, fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
  },
  routeList: { display: 'flex', flexDirection: 'column', gap: 8 },
  routeItem: {
    display: 'flex', gap: 8, alignItems: 'flex-start',
    background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 10,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  routeName: {
    fontSize: 12, color: '#fff', fontWeight: 700, margin: '0 0 4px',
    fontFamily: "'Syne', sans-serif",
  },
  routeDesc: {
    fontSize: 10, color: '#F39C12', fontFamily: 'monospace',
    margin: '0 0 4px', wordBreak: 'break-all', lineHeight: 1.5,
  },
  routeMeta: { fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0 },
  btnDel: {
    background: 'none', border: 'none',
    color: 'rgba(231,76,60,0.5)', cursor: 'pointer', fontSize: 14,
    padding: '0 2px', flexShrink: 0,
  },
  empty: { fontSize: 11, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' },
};
