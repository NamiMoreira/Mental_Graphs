import React, { useState, useEffect } from 'react';

export function RouteModal({ open, route, nodes, onClose, onSave }) {
  const [name, setName] = useState(route?.name || '');

  useEffect(() => { setName(route?.name || ''); }, [route]);

  if (!open || !route) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p style={styles.title}>Editar Rota</p>
        <p style={styles.subtitle}>{route.descricao}</p>

        <label style={styles.label}>Nome da rota</label>
        <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} />

        <div style={styles.btns}>
          <button style={styles.btnCancel} onClick={onClose}>Cancelar</button>
          <button style={styles.btnOk} onClick={() => onSave({ ...route, name })}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { background: '#0F1423', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 20, width: 420 },
  title: { color: '#fff', fontSize: 16, fontWeight: 800, margin: '0 0 8px', fontFamily: "'Syne', sans-serif" },
  subtitle: { color: '#F39C12', margin: '0 0 12px' },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 6 },
  input: { width: '100%', padding: 8, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fff' },
  btns: { display: 'flex', gap: 8, marginTop: 12 },
  btnCancel: { flex: 1, padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', border: 'none' },
  btnOk: { flex: 2, padding: 8, borderRadius: 8, background: 'rgba(74,144,217,0.25)', color: '#4A90D9', border: 'none', fontWeight: 700 },
};
