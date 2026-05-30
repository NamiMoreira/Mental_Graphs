import { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { DEFAULT_NODE_COLOR, DEFAULT_EDGE_WEIGHT } from '../constants';
import * as api from '../services/api';

const OFFLINE = true; // true = sem backend, tudo em memória

const tryApi = async (fn) => {
  if (OFFLINE) return null;
  try { return await fn(); } catch (e) { console.warn('API offline:', e.message); return null; }
};

export function useGraph(graphId) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadGraph = useCallback(async () => {
    if (OFFLINE) return;
    setLoading(true);
    try {
      const [n, e, r] = await Promise.all([
        api.getNodes(graphId),
        api.getEdges(graphId),
        api.getRoutes(graphId),
      ]);
      setNodes(n || []);
      setEdges(e || []);
      setRoutes(r || []);
    } catch (err) {
      console.warn('Backend indisponível, modo offline ativo.');
    } finally {
      setLoading(false);
    }
  }, [graphId]);

  // --- Nodes ---
  const addNode = useCallback(async (x, y, label = 'Objeto') => {
    const node = { id: uuid(), label, x, y, color: DEFAULT_NODE_COLOR };
    setNodes((prev) => [...prev, node]);
    await tryApi(() => api.createNode(graphId, { label, x, y, color: DEFAULT_NODE_COLOR }));
    return node;
  }, [graphId]);

  const moveNode = useCallback((nodeId, x, y) => {
    setNodes((prev) => prev.map((n) => n.id === nodeId ? { ...n, x, y } : n));
  }, []);

  const commitNodeMove = useCallback(async (nodeId, x, y) => {
    await tryApi(() => api.updateNode(graphId, nodeId, { x, y }));
  }, [graphId]);

  const updateNodeLabel = useCallback(async (nodeId, label) => {
    setNodes((prev) => prev.map((n) => n.id === nodeId ? { ...n, label } : n));
    await tryApi(() => api.updateNode(graphId, nodeId, { label }));
  }, [graphId]);

  const removeNode = useCallback(async (nodeId) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) => prev.filter((e) => e.source_id !== nodeId && e.target_id !== nodeId));
    await tryApi(() => api.deleteNode(graphId, nodeId));
  }, [graphId]);

  // --- Edges ---
  // descricao = "ObjetoA --[label]--> ObjetoB"
  const buildEdgeDescricao = useCallback((sourceLabel, targetLabel, label, weight) => {
    return `${sourceLabel} --[${label || 'conecta'}(${weight})]-> ${targetLabel}`;
  }, []);

  const addEdge = useCallback(async (sourceId, targetId, label = '', weight = DEFAULT_EDGE_WEIGHT, nodes_ref) => {
    if (sourceId === targetId) return;
    const sourceLabel = nodes_ref?.find((n) => n.id === sourceId)?.label || sourceId;
    const targetLabel = nodes_ref?.find((n) => n.id === targetId)?.label || targetId;
    const descricao = `${sourceLabel} --[${label || 'conecta'}(${weight})]-> ${targetLabel}`;

    const edge = {
      id: uuid(),
      source_id: sourceId,
      target_id: targetId,
      label,
      weight,
      directed: true,
      descricao,
    };
    setEdges((prev) => [...prev, edge]);
    await tryApi(() => api.createEdge(graphId, edge));
    return edge;
  }, [graphId]);

  const updateEdgeLabel = useCallback(async (edgeId, label, nodes_ref) => {
    setEdges((prev) => prev.map((e) => {
      if (e.id !== edgeId) return e;
      const sourceLabel = nodes_ref?.find((n) => n.id === e.source_id)?.label || e.source_id;
      const targetLabel = nodes_ref?.find((n) => n.id === e.target_id)?.label || e.target_id;
      const descricao = `${sourceLabel} --[${label || 'conecta'}(${e.weight})]-> ${targetLabel}`;
      return { ...e, label, descricao };
    }));
    await tryApi(() => api.updateEdge(graphId, edgeId, { label }));
  }, [graphId]);

  const updateEdgeWeight = useCallback(async (edgeId, weight, nodes_ref) => {
    setEdges((prev) => prev.map((e) => {
      if (e.id !== edgeId) return e;
      const sourceLabel = nodes_ref?.find((n) => n.id === e.source_id)?.label || e.source_id;
      const targetLabel = nodes_ref?.find((n) => n.id === e.target_id)?.label || e.target_id;
      const descricao = `${sourceLabel} --[${e.label || 'conecta'}(${weight})]-> ${targetLabel}`;
      return { ...e, weight, descricao };
    }));
    await tryApi(() => api.updateEdge(graphId, edgeId, { weight }));
  }, [graphId]);

  const removeEdge = useCallback(async (edgeId) => {
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
    await tryApi(() => api.deleteEdge(graphId, edgeId));
  }, [graphId]);

  // --- Routes ---
  // descricao = frase montada: "ObjA --[aresta(0.8)]--> ObjB --[aresta2(0.5)]--> ObjC"
  const buildRouteDescricao = useCallback((nodeSequenceIds, nodes_ref, edges_ref) => {
    const parts = [];
    for (let i = 0; i < nodeSequenceIds.length; i++) {
      const nodeLabel = nodes_ref.find((n) => n.id === nodeSequenceIds[i])?.label || nodeSequenceIds[i];
      parts.push(nodeLabel);
      if (i < nodeSequenceIds.length - 1) {
        const edge = edges_ref.find(
          (e) => e.source_id === nodeSequenceIds[i] && e.target_id === nodeSequenceIds[i + 1]
        );
        const edgeLabel = edge?.label || 'conecta';
        const edgeWeight = edge?.weight ?? DEFAULT_EDGE_WEIGHT;
        parts.push(`--[${edgeLabel}(${edgeWeight})]-->`);
      }
    }
    return parts.join(' ');
  }, []);

  const addRoute = useCallback(async (name, nodeSequence, nodes_ref, edges_ref) => {
    const descricao = buildRouteDescricao(nodeSequence, nodes_ref, edges_ref);
    const totalWeight = nodeSequence.reduce((acc, nodeId, i) => {
      if (i === 0) return acc;
      const edge = edges_ref.find(
        (e) => e.source_id === nodeSequence[i - 1] && e.target_id === nodeId
      );
      return acc + (edge?.weight ?? DEFAULT_EDGE_WEIGHT);
    }, 0);

    const route = {
      id: uuid(),
      name,
      source_id: nodeSequence[0],
      target_id: nodeSequence[nodeSequence.length - 1],
      node_sequence: nodeSequence,
      total_weight: Math.round(totalWeight * 1000) / 1000,
      descricao,
    };
    setRoutes((prev) => [...prev, route]);
    await tryApi(() => api.createRoute(graphId, route));
    return route;
  }, [graphId, buildRouteDescricao]);

  const removeRoute = useCallback(async (routeId) => {
    setRoutes((prev) => prev.filter((r) => r.id !== routeId));
    await tryApi(() => api.deleteRoute(graphId, routeId));
  }, [graphId]);

  return {
    nodes, edges, routes, loading,
    loadGraph,
    addNode, moveNode, commitNodeMove, updateNodeLabel, removeNode,
    addEdge, updateEdgeLabel, updateEdgeWeight, removeEdge,
    addRoute, removeRoute,
    buildRouteDescricao,
  };
}
