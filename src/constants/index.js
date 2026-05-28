export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';
export const GRAPH_ID = process.env.REACT_APP_GRAPH_ID || 'default-graph';
export const NODE_RADIUS = 40;
export const NODE_COLORS = ['#4A90D9', '#E74C3C', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C'];
export const DEFAULT_NODE_COLOR = '#4A90D9';
export const DEFAULT_EDGE_WEIGHT = 1;

export const MODES = {
  SELECT: 'select',
  ADD_NODE: 'add_node',
  ADD_EDGE: 'add_edge',
  DELETE: 'delete',
};

export const KEYS = {
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
  ESCAPE: 'Escape',
};