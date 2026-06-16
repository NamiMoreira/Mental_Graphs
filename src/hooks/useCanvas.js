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
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panningRef = useRef(null);

  const getSVGPoint = useCallback((e) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;
    // convert to world coords using current pan and scale
    return { x: (screenX - pan.x) / scale, y: (screenY - pan.y) / scale };
  }, [pan, scale]);

  const onCanvasPointerDown = useCallback((e) => {
    // Start panning when middle-click, shift+left-click, or left-drag on background in SELECT mode
    const isMiddle = e.button === 1;
    const isLeft = e.button === 0;
    const isShiftLeft = isLeft && e.shiftKey;
    if (isMiddle || isShiftLeft || (isLeft && mode === MODES.SELECT)) {
      // If in ADD_NODE and left-click, handle node creation instead
      if (mode === MODES.ADD_NODE && isLeft) {
        const { x, y } = getSVGPoint(e);
        addNode(x, y);
        return;
      }
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      // clear selection when clicking background
      if (mode === MODES.SELECT) setSelected(null);
      panningRef.current = { startX: clientX, startY: clientY, startPan: { ...pan } };
      return;
    }
    const { x, y } = getSVGPoint(e);
    if (mode === MODES.ADD_NODE) {
      addNode(x, y);
    } else if (mode === MODES.ADD_EDGE) {
      setEdgeSource(null);
      setGhostLine(null);
      setPendingEdge(null);
    }
  }, [mode, getSVGPoint, addNode, pan]);

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
    // handle panning
    if (panningRef.current) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - panningRef.current.startX;
      const dy = clientY - panningRef.current.startY;
      setPan({ x: panningRef.current.startPan.x + dx, y: panningRef.current.startPan.y + dy });
      return;
    }

    const { x, y } = getSVGPoint(e);
    if (dragging) moveNode(dragging.nodeId, x - dragging.offsetX, y - dragging.offsetY);
    if (ghostLine) setGhostLine((g) => ({ ...g, x2: x, y2: y }));
  }, [dragging, ghostLine, getSVGPoint, moveNode]);

  const onPointerUp = useCallback(() => {
    // end panning if active
    if (panningRef.current) {
      panningRef.current = null;
      return;
    }

    if (dragging) {
      const node = nodes.find((n) => n.id === dragging.nodeId);
      if (node) commitNodeMove(node.id, node.x, node.y);
      setDragging(null);
    }
  }, [dragging, nodes, commitNodeMove]);

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;
    const wheel = e.deltaY < 0 ? 1.12 : 0.88;
    const newScale = clamp(scale * wheel, 0.1, 4);
    // world coordinates at pointer
    const worldX = (screenX - pan.x) / scale;
    const worldY = (screenY - pan.y) / scale;
    // compute new pan so the world point stays under cursor
    const newPanX = screenX - worldX * newScale;
    const newPanY = screenY - worldY * newScale;
    setScale(newScale);
    setPan({ x: newPanX, y: newPanY });
  }, [pan, scale]);

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
    // zoom & pan
    scale, pan, onWheel,
  };
}
