import { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { DEFAULT_NODE_COLOR, DEFAULT_EDGE_WEIGHT } from '../constants';
import * as api from '../services/api';

export function useGraph(graphId) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadGraph = useCallback(async () => {
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
      console.error('loadGraph error:', err);
    } finally {
      setLoading(false);
    }
  }, [graphId]);

  // --- Node operations ---
  const addNode = useCallback(async (x, y, label = 'Nó') => {
    const optimistic = { id: uuid(), label, x, y, color: DEFAULT_NODE_COLOR };
    setNodes((prev) => [...prev, optimistic]);
    try {
      const saved = await api.createNode(graphId, { label, x, y, color: DEFAULT_NODE_COLOR });
      setNodes((prev) => prev.map((n) => (n.id === optimistic.id ? saved : n)));
      return saved;
    } catch (err) {
      setNodes((prev) => prev.filter((n) => n.id !== optimistic.id));
      console.error('addNode error:', err);
    }
  }, [graphId]);

  const moveNode = useCallback(async (nodeId, x, y) => {
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, x, y } : n)));
  }, []);

  const commitNodeMove = useCallback(async (nodeId, x, y) => {
    try {
      await api.updateNode(graphId, nodeId, { x, y });
    } catch (err) {
      console.error('commitNodeMove error:', err);
    }
  }, [graphId]);

  const updateNodeLabel = useCallback(async (nodeId, label) => {
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, label } : n)));
    try {
      await api.updateNode(graphId, nodeId, { label });
    } catch (err) {
      console.error('updateNodeLabel error:', err);
    }
  }, [graphId]);

  const removeNode = useCallback(async (nodeId) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) => prev.filter((e) => e.source_id !== nodeId && e.target_id !== nodeId));
    try {
      await api.deleteNode(graphId, nodeId);
    } catch (err) {
      console.error('removeNode error:', err);
    }
  }, [graphId]);

  // --- Edge operations ---
  const addEdge = useCallback(async (sourceId, targetId, label = '') => {
    if (sourceId === targetId) return;
    if (edges.find((e) => e.source_id === sourceId && e.target_id === targetId)) return;
    const optimistic = {
      id: uuid(), source_id: sourceId, target_id: targetId,
      label, weight: DEFAULT_EDGE_WEIGHT, directed: true,
    };
    setEdges((prev) => [...prev, optimistic]);
    try {
      const saved = await api.createEdge(graphId, {
        source_id: sourceId, target_id: targetId,
        label, weight: DEFAULT_EDGE_WEIGHT, directed: true,
      });
      setEdges((prev) => prev.map((e) => (e.id === optimistic.id ? saved : e)));
      return saved;
    } catch (err) {
      setEdges((prev) => prev.filter((e) => e.id !== optimistic.id));
      console.error('addEdge error:', err);
    }
  }, [graphId, edges]);

  const updateEdgeLabel = useCallback(async (edgeId, label) => {
    setEdges((prev) => prev.map((e) => (e.id === edgeId ? { ...e, label } : e)));
    try {
      await api.updateEdge(graphId, edgeId, { label });
    } catch (err) {
      console.error('updateEdgeLabel error:', err);
    }
  }, [graphId]);

  const updateEdgeWeight = useCallback(async (edgeId, weight) => {
    setEdges((prev) => prev.map((e) => (e.id === edgeId ? { ...e, weight } : e)));
    try {
      await api.updateEdge(graphId, edgeId, { weight });
    } catch (err) {
      console.error('updateEdgeWeight error:', err);
    }
  }, [graphId]);

  const removeEdge = useCallback(async (edgeId) => {
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
    try {
      await api.deleteEdge(graphId, edgeId);
    } catch (err) {
      console.error('removeEdge error:', err);
    }
  }, [graphId]);

  // --- Route operations ---
  const addRoute = useCallback(async (route) => {
    try {
      const saved = await api.createRoute(graphId, route);
      setRoutes((prev) => [...prev, saved]);
      return saved;
    } catch (err) {
      console.error('addRoute error:', err);
    }
  }, [graphId]);

  const removeRoute = useCallback(async (routeId) => {
    setRoutes((prev) => prev.filter((r) => r.id !== routeId));
    try {
      await api.deleteRoute(graphId, routeId);
    } catch (err) {
      console.error('removeRoute error:', err);
    }
  }, [graphId]);

  const calcRoute = useCallback(async (sourceId, targetId) => {
    try {
      return await api.calculateRoute(graphId, {
        source_id: sourceId, target_id: targetId, algorithm: 'dijkstra',
      });
    } catch (err) {
      console.error('calcRoute error:', err);
    }
  }, [graphId]);

  return {
    nodes, edges, routes, loading,
    loadGraph,
    addNode, moveNode, commitNodeMove, updateNodeLabel, removeNode,
    addEdge, updateEdgeLabel, updateEdgeWeight, removeEdge,
    addRoute, removeRoute, calcRoute,
  };
}
