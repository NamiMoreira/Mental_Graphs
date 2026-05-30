import { API_BASE } from '../constants';

const headers = () => ({
  'Content-Type': 'application/json',
  // Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const request = async (method, path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
};

// --- Objetos (nodes) ---
// No backend, nodes e edges são ambos "objetos"
export const getNodes   = (gId) => request('GET',    `/graphs/${gId}/nodes`);
export const createNode = (gId, node) => request('POST', `/graphs/${gId}/nodes`, node);
export const updateNode = (gId, nId, p) => request('PUT', `/graphs/${gId}/nodes/${nId}`, p);
export const deleteNode = (gId, nId) => request('DELETE', `/graphs/${gId}/nodes/${nId}`);

// --- Conexões (edges) ---
// Enviamos: { source_id, target_id, label, weight, directed, descricao }
export const getEdges   = (gId) => request('GET',    `/graphs/${gId}/edges`);
export const createEdge = (gId, edge) => request('POST', `/graphs/${gId}/edges`, edge);
export const updateEdge = (gId, eId, p) => request('PUT', `/graphs/${gId}/edges/${eId}`, p);
export const deleteEdge = (gId, eId) => request('DELETE', `/graphs/${gId}/edges/${eId}`);

// --- Rotas ---
// Enviamos: { name, node_sequence, descricao: "frase montada", total_weight }
export const getRoutes    = (gId) => request('GET',    `/graphs/${gId}/routes`);
export const createRoute  = (gId, r) => request('POST', `/graphs/${gId}/routes`, r);
export const updateRoute  = (gId, rId, p) => request('PUT', `/graphs/${gId}/routes/${rId}`, p);
export const deleteRoute  = (gId, rId) => request('DELETE', `/graphs/${gId}/routes/${rId}`);
export const calculateRoute = (gId, b) => request('POST', `/graphs/${gId}/routes/calculate`, b);

// --- Snapshot ---
export const saveSnapshot = (gId, snap) => request('PUT', `/graphs/${gId}/snapshot`, snap);
