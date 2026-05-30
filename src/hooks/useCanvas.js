import { useState, useCallback, useRef } from 'react';
import { MODES, KEYS, NODE_RADIUS } from '../constants';

export function useCanvas({ nodes, addNode, moveNode, commitNodeMove, removeNode, addEdge, removeEdge }) {
  const [mode, setMode] = useState(MODES.SELECT);
  const [selected, setSelected] = useState(null);
  const [edgeSource, setEdgeSource] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [ghostLine, setGhostLine] = useState(null);
  const [pendingEdge, setPendingEdge] = useState(null); // { sourceId, weight, label }
  const svgRef = useRef(null);

  const getSVGPoint = useCallback((e) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const onCanvasPointerDown = useCallback((e) => {
    
    const { x, y } = getSVGPoint(e);
    if (mode === MODES.ADD_NODE) {
      addNode(x, y);
    } else if (mode === MODES.SELECT) {
      setSelected(null);
    } else if (mode === MODES.ADD_EDGE) {
      setEdgeSource(null);
      setGhostLine(null);
      setPendingEdge(null);
    }
  }, [mode, getSVGPoint, addNode]);

  const onNodePointerDown = useCallback((e, nodeId) => {
    e.stopPropagation();
    const { x, y } = getSVGPoint(e);
    const node = nodes.find((n) => n.id === nodeId);

    if (mode === MODES.DELETE) {
      removeNode(nodeId);
      return;
    }

    if (mode === MODES.ADD_EDGE) {
      if (!edgeSource) {
        setEdgeSource(nodeId);
        setGhostLine({ x1: node.x, y1: node.y, x2: node.x, y2: node.y });
        setPendingEdge({ sourceId: nodeId });
      } else if (edgeSource !== nodeId) {
        // Trigger edge creation with weight prompt via pendingEdge
        setPendingEdge({ sourceId: edgeSource, targetId: nodeId });
        setEdgeSource(null);
        setGhostLine(null);
      }
      return;
    }

    if (mode === MODES.SELECT) {
      setSelected({ type: 'node', id: nodeId });
      setDragging({ nodeId, offsetX: x - node.x, offsetY: y - node.y });
    }
  }, [mode, nodes, edgeSource, getSVGPoint, removeNode]);

  const onPointerMove = useCallback((e) => {
    const { x, y } = getSVGPoint(e);
    if (dragging) moveNode(dragging.nodeId, x - dragging.offsetX, y - dragging.offsetY);
    if (ghostLine) setGhostLine((g) => ({ ...g, x2: x, y2: y }));
  }, [dragging, ghostLine, getSVGPoint, moveNode]);

  const onPointerUp = useCallback(() => {
    if (dragging) {
      const node = nodes.find((n) => n.id === dragging.nodeId);
      if (node) commitNodeMove(node.id, node.x, node.y);
      setDragging(null);
    }
  }, [dragging, nodes, commitNodeMove]);

  const onEdgeClick = useCallback((e, edgeId) => {
    e.stopPropagation();
    if (mode === MODES.DELETE) { removeEdge(edgeId); return; }
    setSelected({ type: 'edge', id: edgeId });
  }, [mode, removeEdge]);

  const onKeyDown = useCallback((e) => {
    if ([KEYS.DELETE, KEYS.BACKSPACE].includes(e.key) && selected) {
      if (selected.type === 'node') removeNode(selected.id);
      if (selected.type === 'edge') removeEdge(selected.id);
      setSelected(null);
    }
    if (e.key === KEYS.ESCAPE) {
      setMode(MODES.SELECT);
      setEdgeSource(null);
      setGhostLine(null);
      setPendingEdge(null);
    }
  }, [selected, removeNode, removeEdge]);

  const clearPendingEdge = useCallback(() => setPendingEdge(null), []);

  return {
    svgRef, mode, setMode,
    selected, setSelected,
    edgeSource, ghostLine,
    pendingEdge, clearPendingEdge,
    onCanvasPointerDown, onNodePointerDown,
    onPointerMove, onPointerUp,
    onEdgeClick, onKeyDown,
  };
}
