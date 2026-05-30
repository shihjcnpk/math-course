import { useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
} from 'reactflow'
import { useNavigate } from 'react-router-dom'
import GraphNode from './GraphNode'
import GraphEdge from './GraphEdge'

// Stable references — defined outside component to avoid re-renders
const nodeTypes: NodeTypes = { knowledgeNode: GraphNode }
const edgeTypes: EdgeTypes = { graphEdge: GraphEdge }
const defaultEdgeOptions = {
  type: 'graphEdge' as const,
}

const defaultViewport = { x: 0, y: 0, zoom: 0.8 }

interface KnowledgeGraphProps {
  nodes: Node[]
  edges: Edge[]
}

/**
 * Main ReactFlow canvas for the knowledge graph.
 * Uses dagre-laid-out nodes and custom node/edge components.
 * Clicking a node navigates to its detail view.
 */
export default function KnowledgeGraph({ nodes, edges }: KnowledgeGraphProps) {
  const navigate = useNavigate()

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      navigate(`/knowledge-graph/${node.id}`)
    },
    [navigate],
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={handleNodeClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      defaultViewport={defaultViewport}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.1}
      maxZoom={2}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={true}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={0.5} color="#e2e8f0" />
      <Controls showInteractive={false} position="bottom-right" />
      <MiniMap
        nodeColor={(n) => {
          const cat = (n.data as Record<string, string>)?.category
          if (cat === 'number-and-expression') return '#3b82f6'
          if (cat === 'equation-and-inequality') return '#f59e0b'
          if (cat === 'geometry-and-proof') return '#10b981'
          if (cat === 'coordinate-and-function') return '#8b5cf6'
          if (cat === 'statistics-and-data') return '#ec4899'
          return '#ef4444'
        }}
        maskColor="rgba(0,0,0,0.05)"
        style={{ width: 160, height: 120 }}
        position="bottom-left"
      />
    </ReactFlow>
  )
}
