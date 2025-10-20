"use client"

import { LogicGraph } from "@/types/analysis"
import { NODE_COLORS, BADGE_COLORS } from "@/types/analysis"

interface InteractiveLogicDiagramProps {
  logicGraph: LogicGraph
  onEdgeSelect: (edgeId: string | null) => void
  selectedEdge: string | null
}

// 简单的自动布局算法
function autoLayout(graph: LogicGraph) {
  const { nodes, edges } = graph
  const nodePositions = new Map<string, { x: number; y: number }>()

  // 如果节点已经有 position，优先使用
  nodes.forEach(node => {
    if (node.position) {
      nodePositions.set(node.id, node.position)
    }
  })

  // 如果没有 position，用简单的网格布局
  if (nodePositions.size === 0) {
    const cols = Math.min(3, Math.ceil(Math.sqrt(nodes.length))) // 最多3列
    nodes.forEach((node, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols
      nodePositions.set(node.id, {
        x: 80 + col * 280, // 增加水平间距：200 → 280
        y: 60 + row * 200  // 增加垂直间距：150 → 200
      })
    })
  }

  return nodePositions
}

export function InteractiveLogicDiagram({ logicGraph, onEdgeSelect, selectedEdge }: InteractiveLogicDiagramProps) {
  const nodePositions = autoLayout(logicGraph)

  // 计算SVG需要的尺寸
  let maxX = 0, maxY = 0
  nodePositions.forEach(pos => {
    maxX = Math.max(maxX, pos.x + 200)
    maxY = Math.max(maxY, pos.y + 100)
  })

  return (
    <div className="relative h-full w-full min-h-[500px] bg-background p-8 overflow-auto">
      {/* SVG for arrows */}
      <svg
        className="absolute pointer-events-none"
        style={{
          zIndex: 0,
          left: 0,
          top: 0,
          width: `${maxX}px`,
          height: `${maxY}px`
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,8 L10,4 z" fill="#6b7280" />
          </marker>
          <marker
            id="arrowhead-selected"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,8 L10,4 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Draw edges */}
        {logicGraph.edges.map((edge) => {
          const sourcePos = nodePositions.get(edge.source)
          const targetPos = nodePositions.get(edge.target)

          if (!sourcePos || !targetPos) return null

          const isSelected = selectedEdge === edge.id

          return (
            <line
              key={edge.id}
              x1={sourcePos.x + 80}
              y1={sourcePos.y + 40}
              x2={targetPos.x + 80}
              y2={targetPos.y + 40}
              stroke={isSelected ? "#3b82f6" : "#6b7280"}
              strokeWidth={isSelected ? "4" : "3"}
              markerEnd={isSelected ? "url(#arrowhead-selected)" : "url(#arrowhead)"}
              className="transition-all duration-200"
              opacity={isSelected ? "1" : "0.7"}
            />
          )
        })}
      </svg>

      {/* Draw nodes */}
      {logicGraph.nodes.map((node) => {
        const pos = nodePositions.get(node.id)
        if (!pos) return null

        const colors = NODE_COLORS[node.type]

        return (
          <div
            key={node.id}
            className={`absolute w-40 h-20 ${colors.bg} border-2 ${colors.border} rounded-lg flex items-center justify-center text-center text-sm font-medium hover:shadow-lg transition-shadow cursor-default`}
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              zIndex: 1
            }}
          >
            <div>
              <div className={`font-semibold ${colors.text}`}>{node.label}</div>
              <div className="text-xs text-gray-600 mt-1 px-2 line-clamp-2">{node.content}</div>
            </div>
          </div>
        )
      })}

      {/* Draw edge labels (clickable) */}
      {logicGraph.edges.map((edge, index) => {
        const sourcePos = nodePositions.get(edge.source)
        const targetPos = nodePositions.get(edge.target)

        if (!sourcePos || !targetPos) return null

        const isSelected = selectedEdge === edge.id

        // Calculate midpoint for label position
        const midX = (sourcePos.x + targetPos.x) / 2 + 40
        const midY = (sourcePos.y + targetPos.y) / 2 + 20

        return (
          <button
            key={edge.id}
            onClick={() => onEdgeSelect(edge.id)}
            className="absolute px-3 py-1.5 bg-white rounded-md shadow-md text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 border-2 cursor-pointer"
            style={{
              left: `${midX}px`,
              top: `${midY}px`,
              zIndex: 2,
              borderColor: isSelected ? "#3b82f6" : "#e5e7eb",
              backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
              animation: index < 3 ? `pulse 2s ease-in-out ${index * 0.3}s 3` : 'none'
            }}
          >
            <span className="text-sm">{edge.badge}</span> {edge.primaryLabel}
          </button>
        )
      })}
    </div>
  )
}
