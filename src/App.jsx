import React, { useEffect, useState } from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { RoutePanel } from './components/RoutePanel';
import { EdgeWeightModal } from './components/EdgeWeightModal';
import { useGraph } from './hooks/useGraph';
import { useCanvas } from './hooks/useCanvas';
import { GRAPH_ID, MODES } from './constants';

export default function App() {
  const graph = useGraph(GRAPH_ID);
  const canvas = useCanvas({
    nodes: graph.nodes,
    addNode: graph.addNode,
    moveNode: graph.moveNode,
    commitNodeMove: graph.commitNodeMove,
    removeNode: graph.removeNode,
    addEdge: graph.addEdge,
    removeEdge: graph.removeEdge,
  });

  // Route building: sequence of node ids clicked in ROUTE mode
  const [routeSequence, setRouteSequence] = useState([]);

  // Load on mount
  useEffect(() => { graph.loadGraph(); }, []);

  // Keyboard shortcuts for mode
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT') return;
      const map = { v: MODES.SELECT, V: MODES.SELECT, n: MODES.ADD_NODE, N: MODES.ADD_NODE,
                    e: MODES.ADD_EDGE, E: MODES.ADD_EDGE, d: MODES.DELETE, D: MODES.DELETE,
                    r: MODES.ROUTE,   R: MODES.ROUTE };
      if (map[e.key]) canvas.setMode(map[e.key]);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [canvas]);

  // Handle node click in ROUTE mode
  const handleNodePointerDown = (e, nodeId) => {
    if (canvas.mode === MODES.ROUTE) {
      e.stopPropagation();
      setRouteSequence((prev) => {
        if (prev.includes(nodeId)) return prev; // avoid duplicate
        return [...prev, nodeId];
      });
      return;
    }
    canvas.onNodePointerDown(e, nodeId);
  };

  // When pendingEdge is set (two nodes selected in ADD_EDGE mode), show modal
  const handleEdgeConfirm = (label, weight, direction = 'forward') => {
    const { sourceId, targetId } = canvas.pendingEdge;
    if (direction === 'forward') {
      graph.addEdge(sourceId, targetId, label, weight, graph.nodes);
    } else if (direction === 'backward') {
      graph.addEdge(targetId, sourceId, label, weight, graph.nodes);
    } else if (direction === 'both') {
      graph.addEdge(sourceId, targetId, label, weight, graph.nodes);
      graph.addEdge(targetId, sourceId, label, weight, graph.nodes);
    }
    canvas.clearPendingEdge();
  };

  const handleEdgeCancel = () => canvas.clearPendingEdge();

  const handleSaveRoute = (name, sequence) => {
    graph.addRoute(name, sequence, graph.nodes, graph.edges);
    setRouteSequence([]);
  };

  const sourceLabel = canvas.pendingEdge
    ? graph.nodes.find((n) => n.id === canvas.pendingEdge.sourceId)?.label || '?'
    : '';
  const targetLabel = canvas.pendingEdge
    ? graph.nodes.find((n) => n.id === canvas.pendingEdge.targetId)?.label || '?'
    : '';

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />

      <Toolbar mode={canvas.mode} setMode={canvas.setMode} />

      <Canvas
        nodes={graph.nodes}
        edges={graph.edges}
        svgRef={canvas.svgRef}
        mode={canvas.mode}
        selected={canvas.selected}
        edgeSource={canvas.edgeSource}
        ghostLine={canvas.ghostLine}
        routeSequence={routeSequence}
        onCanvasPointerDown={canvas.onCanvasPointerDown}
        onNodePointerDown={handleNodePointerDown}
        onPointerMove={canvas.onPointerMove}
        onPointerUp={canvas.onPointerUp}
        onKeyDown={canvas.onKeyDown}
        scale={canvas.scale}
        pan={canvas.pan}
        onWheel={canvas.onWheel}
        onEdgeClick={canvas.onEdgeClick}
        onLabelChange={graph.updateNodeLabel}
        onEdgeLabelChange={(id, label) => graph.updateEdgeLabel(id, label, graph.nodes)}
        onEdgeWeightChange={(id, w) => graph.updateEdgeWeight(id, w, graph.nodes)}
      />

      <RoutePanel
        nodes={graph.nodes}
        edges={graph.edges}
        routes={graph.routes}
        routeSequence={routeSequence}
        onRemoveRoute={graph.removeRoute}
        onClearRoute={() => setRouteSequence([])}
        onSaveRoute={handleSaveRoute}
      />

      {canvas.pendingEdge?.targetId && (
        <EdgeWeightModal
          sourceLabel={sourceLabel}
          targetLabel={targetLabel}
          onConfirm={handleEdgeConfirm}
          onCancel={handleEdgeCancel}
        />
      )}

      {graph.loading && <div style={styles.loader}>Carregando…</div>}
    </>
  );
}

const styles = {
  loader: {
    position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
    background: 'rgba(74,144,217,0.9)', color: '#fff',
    padding: '6px 18px', borderRadius: 20, fontSize: 11,
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
  },
};
