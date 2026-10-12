"use client";

import {useEffect, useMemo} from "react";
import {ReactFlow, Handle, Position, MarkerType, Controls, useNodesInitialized, useReactFlow, useStore, type NodeProps} from "@xyflow/react";
import type {Scene} from "@/data/scenes";
import "@xyflow/react/dist/style.css";

function ModuleNode({data}: NodeProps) {
  return <div className={`pattern-node ${data.active ? "active" : ""} ${data.container ? "module-container" : ""}`}>
    <Handle type="target" position={Position.Left} />
    <span>{String(data.label)}</span>
    {data.note ? <small>{String(data.note)}</small> : null}
    <Handle type="source" position={Position.Right} />
  </div>;
}
const nodeTypes = {module: ModuleNode};

function FitDiagramViewport() {
  const initialized = useNodesInitialized();
  const {fitView} = useReactFlow();
  const width = useStore(state => state.width);
  const height = useStore(state => state.height);

  useEffect(() => {
    if (initialized && width > 0 && height > 0) void fitView({padding: .16});
  }, [initialized, width, height, fitView]);
  return null;
}

// Scenes contain topology only. All visible labels come from locale resources.
export function PatternDiagram({scene, labels, description, notes = {}}: {scene: Scene; labels: Record<string,string>; description: string; notes?: Record<string,string>}) {
  // Match Dagre's reserved width so long labels cannot consume the connector gap.
  const nodes = useMemo(() => scene.nodes.map(node => ({id: node.id, type: "module", parentId: node.parentId, position: {x: node.x,y: node.y}, style: node.container ? undefined : {width: 146}, data: {label: labels[node.id] ?? node.id, note: notes[node.id], active: node.active, container: node.container}})), [scene, labels, notes]);
  // Node IDs alone do not identify a layout: Memento reuses IDs at new positions.
  // Labels and notes also affect the measured bounds. Highlight-only changes retain zoom.
  const layoutKey = JSON.stringify(nodes.map(node => [node.id, node.parentId, node.position, node.data.label, node.data.note, node.data.container]));
  const edges = useMemo(() => scene.edges.map((edge,index) => ({id: `edge-${index}`, source: edge.source, target: edge.target, type: "smoothstep", style: {stroke: edge.active ? "#315dce" : "#859198",strokeWidth: edge.active ? 2 : 1.3}, markerEnd: {type: MarkerType.ArrowClosed,color: edge.active ? "#315dce" : "#859198"}})), [scene]);
  return <div className="pattern-flow" role="group" aria-label={description}>
    <ReactFlow key={layoutKey} nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{padding: .16}} minZoom={.1} maxZoom={1.5} nodesDraggable={false} nodesConnectable={false} elementsSelectable={false} zoomOnScroll={false} zoomOnDoubleClick={false} panOnDrag={false} preventScrolling={false} proOptions={{hideAttribution: true}}>
      <FitDiagramViewport />
      <Controls showInteractive={false} />
    </ReactFlow>
  </div>;
}
