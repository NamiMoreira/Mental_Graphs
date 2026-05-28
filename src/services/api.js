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

// --- Nodes ---
export const getNodes = (graphId) => request('GET', `/graphs/${graphId}/nodes`);
export const createNode = (graphId, node) => request('POST', `/graphs/${graphId}/nodes`, node);
export const updateNode = (graphId, nodeId, patch) => request('PUT', `/graphs/${graphId}/nodes/${nodeId}`, patch);
export const deleteNode = (graphId, nodeId) => request('DELETE', `/graphs/${graphId}/nodes/${nodeId}`);

// --- Edges ---
export const getEdges = (graphId) => request('GET', `/graphs/${graphId}/edges`);
export const createEdge = (graphId, edge) => request('POST', `/graphs/${graphId}/edges`, edge);
export const updateEdge = (graphId, edgeId, patch) => request('PUT', `/graphs/${graphId}/edges/${edgeId}`, patch);
export const deleteEdge = (graphId, edgeId) => request('DELETE', `/graphs/${graphId}/edges/${edgeId}`);

// --- Routes ---
export const getRoutes = (graphId) => request('GET', `/graphs/${graphId}/routes`);
export const createRoute = (graphId, route) => request('POST', `/graphs/${graphId}/routes`, route);
export const calculateRoute = (graphId, body) => request('POST', `/graphs/${graphId}/routes/calculate`, body);
export const updateRoute = (graphId, routeId, patch) => request('PUT', `/graphs/${graphId}/routes/${routeId}`, patch);
export const deleteRoute = (graphId, routeId) => request('DELETE', `/graphs/${graphId}/routes/${routeId}`);

// --- Snapshot ---
export const saveSnapshot = (graphId, snapshot) => request('PUT', `/graphs/${graphId}/snapshot`, snapshot);
