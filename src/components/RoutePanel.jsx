import React, { useState } from 'react';

export function RoutePanel({ nodes, routes, onAddRoute, onRemoveRoute, onCalcRoute }) {
  const [open, setOpen] = useState(false);
  const [srcId, setSrcId] = useState('');
  const [tgtId, setTgtId] = useState('');
  const [routeName, setRouteName] = useState('');
  const [calcResult, setCalcResult] = useState(null);

  const nodeLabel = (id) => nodes.find((n) => n.id === id)?.label || id;

  const handleCalc = async () => {
    if (!srcId || !tgtId) return;
    const result = await onCalcRoute(srcId, tgtId);
    setCalcResult(result);
  };

  const handleSaveRoute = async () => {
    if (!calcResult) return;
    await onAddRoute({
      name: routeName || `Rota ${srcId.slice(0, 4)}→${tgtId.slice(0, 4)}`,
      source_id: srcId,
      target_id: tgtId,
      node_sequence: calcResult.node_sequence,
      total_weight: calcResult.total_weight,
    });
    setCalcResult(null);
    setRouteName('');
  };

  return (
    <div style={{ ...styles.panel, ...(open ? styles.panelOpen : {}) }}>
      <button style={styles.toggle} onClick={() => setOpen((o) => !o)}>
        {open ? '✕' : '⇄'} <span style={styles.toggleLabel}>{open ? 'Fechar' : 'Rotas'}</span>
      </button>

      {open && (
        <div style={styles.body}>
          <div style={styles.section}>
            <p style={styles.sectionTitle}>Calcular Rota (Dijkstra)</p>
            <select style={styles.select} value={srcId} onChange={(e) => setSrcId(e.target.value)}>
              <option value="">Origem</option>
              {nodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
            <select style={styles.select} value={tgtId} onChange={(e) => setTgtId(e.target.value)}>
              <option value="">Destino</option>
              {nodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
            <button style={styles.btn} onClick={handleCalc}>Calcular</button>
          </div>

          {calcResult && (
            <div style={styles.result}>
              <p style={styles.resultPath}>
                {calcResult.node_sequence?.map(nodeLabel).join(' → ')}
              </p>
              <p style={styles.resultWeight}>Peso total: <strong>{calcResult.total_weight}</strong></p>
              <input
                style={styles.input}
                placeholder="Nome da rota"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
              />
              <button style={styles.btnSave} onClick={handleSaveRoute}>Salvar Rota</button>
            </div>
          )}

          <div style={styles.section}>
            <p style={styles.sectionTitle}>Rotas Salvas ({routes.length})</p>
            {routes.length === 0 && <p style={styles.empty}>Nenhuma rota salva.</p>}
            {routes.map((r) => (
              <div key={r.id} style={styles.routeItem}>
                <div>
                  <span style={styles.routeName}>{r.name}</span>
                  <span style={styles.routeMeta}> {nodeLabel(r.source_id)} → {nodeLabel(r.target_id)} | peso {r.total_weight}</span>
                </div>
                <button style={styles.btnDel} onClick={() => onRemoveRoute(r.id)}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  panel: {
    position: 'fixed', right: 16, top: 72, zIndex: 90,
    background: 'rgba(10,14,28,0.92)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12, overflow: 'hidden',
    width: 44, transition: 'width 0.25s ease',
  },
  panelOpen: { width: 300 },
  toggle: {
    display: 'flex', alignItems: 'center', gap: 6,
    width: '100%', padding: '10px 14px',
    background: 'none', border: 'none',
    color: '#4A90D9', cursor: 'pointer',
    fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  toggleLabel: { fontSize: 11 },
  body: { padding: '0 14px 14px' },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
    margin: '0 0 8px', fontFamily: "'Syne', sans-serif",
  },
  select: {
    display: 'block', width: '100%', marginBottom: 6,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6, color: '#fff', padding: '5px 8px', fontSize: 11,
    fontFamily: "'Syne', sans-serif",
  },
  input: {
    display: 'block', width: '100%', marginBottom: 6,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6, color: '#fff', padding: '5px 8px', fontSize: 11,
    fontFamily: "'Syne', sans-serif", boxSizing: 'border-box',
  },
  btn: {
    width: '100%', padding: '6px', borderRadius: 6,
    background: 'rgba(74,144,217,0.2)', border: '1px solid #4A90D9',
    color: '#4A90D9', cursor: 'pointer', fontSize: 11,
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
  },
  btnSave: {
    width: '100%', padding: '6px', borderRadius: 6,
    background: 'rgba(46,204,113,0.15)', border: '1px solid #2ECC71',
    color: '#2ECC71', cursor: 'pointer', fontSize: 11,
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
  },
  result: {
    background: 'rgba(74,144,217,0.08)', borderRadius: 8,
    padding: 10, marginBottom: 12,
  },
  resultPath: { fontSize: 11, color: '#4A90D9', margin: '0 0 4px', wordBreak: 'break-all' },
  resultWeight: { fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px' },
  routeItem: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  routeName: { fontSize: 11, color: '#fff', fontWeight: 700, fontFamily: "'Syne', sans-serif" },
  routeMeta: { fontSize: 10, color: 'rgba(255,255,255,0.35)' },
  btnDel: {
    background: 'none', border: 'none', color: 'rgba(231,76,60,0.6)',
    cursor: 'pointer', fontSize: 13, padding: '0 4px',
  },
  empty: { fontSize: 10, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' },
};
