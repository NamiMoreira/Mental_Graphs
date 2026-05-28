import React, { useEffect } from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { RoutePanel } from './components/RoutePanel';
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

  // Load on mount
  useEffect(() => { graph.loadGraph(); }, []);

  // Keyboard shortcut for mode switching
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'v' || e.key === 'V') canvas.setMode(MODES.SELECT);
      if (e.key === 'n' || e.key === 'N') canvas.setMode(MODES.ADD_NODE);
      if (e.key === 'e' || e.key === 'E') canvas.setMode(MODES.ADD_EDGE);
      if (e.key === 'd' || e.key === 'D') canvas.setMode(MODES.DELETE);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [canvas]);

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
        onCanvasPointerDown={canvas.onCanvasPointerDown}
        onNodePointerDown={canvas.onNodePointerDown}
        onPointerMove={canvas.onPointerMove}
        onPointerUp={canvas.onPointerUp}
        onKeyDown={canvas.onKeyDown}
        onEdgeClick={canvas.onEdgeClick}
        onLabelChange={graph.updateNodeLabel}
        onEdgeLabelChange={graph.updateEdgeLabel}
        onEdgeWeightChange={graph.updateEdgeWeight}
      />

      <RoutePanel
        nodes={graph.nodes}
        routes={graph.routes}
        onAddRoute={graph.addRoute}
        onRemoveRoute={graph.removeRoute}
        onCalcRoute={graph.calcRoute}
      />

      {graph.loading && (
        <div style={styles.loader}>Carregando grafo…</div>
      )}
    </>
  );
}

const styles = {
  loader: {
    position: 'fixed', bottom: 20, left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(74,144,217,0.9)',
    color: '#fff', padding: '6px 16px',
    borderRadius: 20, fontSize: 11,
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
  },
};
