"use client"

import { useState } from "react"

interface Node {
  id: string
  label: string
  text: string
  bgColor: string
  borderColor: string
  textColor: string
}

interface Arrow {
  from: string
  to: string
  label: string
}

export function LogicDiagram() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const nodes: Node[] = [
    {
      id: "claim",
      label: "主张",
      text: "我吃盐多",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-500",
      textColor: "text-blue-900",
    },
    {
      id: "rule",
      label: "规则",
      text: "资历多→更正确",
      bgColor: "bg-green-100",
      borderColor: "border-green-500",
      textColor: "text-green-900",
    },
    {
      id: "assumption",
      label: "假设",
      text: "情境相似",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-500",
      textColor: "text-yellow-900",
    },
    {
      id: "conclusion",
      label: "结论",
      text: "你应该听我的",
      bgColor: "bg-red-100",
      borderColor: "border-red-500",
      textColor: "text-red-900",
    },
  ]

  const arrows: Arrow[] = [
    { from: "claim", to: "rule", label: "诉诸权威" },
    { from: "assumption", to: "rule", label: "外部效度缺失" },
    { from: "rule", to: "conclusion", label: "事实→义务" },
  ]

  return (
    <div className="relative h-full w-full">
      {/* SVG for arrows */}
      <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 0 }}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            className="fill-muted-foreground"
          >
            <polygon points="0 0, 10 3, 0 6" />
          </marker>
        </defs>

        {/* Arrow from claim to rule */}
        <line
          x1="25%"
          y1="25%"
          x2="48%"
          y2="25%"
          stroke="currentColor"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          className="text-muted-foreground"
        />

        {/* Arrow from assumption to rule */}
        <line
          x1="50%"
          y1="65%"
          x2="50%"
          y2="35%"
          stroke="currentColor"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          className="text-muted-foreground"
        />

        {/* Arrow from rule to conclusion */}
        <line
          x1="52%"
          y1="25%"
          x2="75%"
          y2="25%"
          stroke="currentColor"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          className="text-muted-foreground"
        />
      </svg>

      {/* Nodes and labels */}
      <div className="relative h-full" style={{ zIndex: 1 }}>
        {/* Top row: Claim, Rule, Conclusion */}
        <div className="flex items-start justify-between px-4 pt-12">
          {/* Claim Node */}
          <div className="flex flex-col items-center">
            <div
              className={`flex h-20 w-40 cursor-pointer items-center justify-center rounded-lg border-2 transition-shadow ${nodes[0].bgColor} ${nodes[0].borderColor} ${hoveredNode === "claim" ? "shadow-lg" : ""}`}
              onMouseEnter={() => setHoveredNode("claim")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="text-center">
                <div className={`text-xs font-semibold ${nodes[0].textColor}`}>{nodes[0].label}</div>
                <div className={`mt-1 text-sm font-medium ${nodes[0].textColor}`}>{nodes[0].text}</div>
              </div>
            </div>
          </div>

          {/* Arrow label: 诉诸权威 */}
          <div className="mt-6 rounded bg-background px-2 py-1 text-sm text-muted-foreground shadow-sm">
            {arrows[0].label}
          </div>

          {/* Rule Node */}
          <div className="flex flex-col items-center">
            <div
              className={`flex h-20 w-40 cursor-pointer items-center justify-center rounded-lg border-2 transition-shadow ${nodes[1].bgColor} ${nodes[1].borderColor} ${hoveredNode === "rule" ? "shadow-lg" : ""}`}
              onMouseEnter={() => setHoveredNode("rule")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="text-center">
                <div className={`text-xs font-semibold ${nodes[1].textColor}`}>{nodes[1].label}</div>
                <div className={`mt-1 text-sm font-medium ${nodes[1].textColor}`}>{nodes[1].text}</div>
              </div>
            </div>
          </div>

          {/* Arrow label: 事实→义务 */}
          <div className="mt-6 rounded bg-background px-2 py-1 text-sm text-muted-foreground shadow-sm">
            {arrows[2].label}
          </div>

          {/* Conclusion Node */}
          <div className="flex flex-col items-center">
            <div
              className={`flex h-20 w-40 cursor-pointer items-center justify-center rounded-lg border-2 transition-shadow ${nodes[3].bgColor} ${nodes[3].borderColor} ${hoveredNode === "conclusion" ? "shadow-lg" : ""}`}
              onMouseEnter={() => setHoveredNode("conclusion")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="text-center">
                <div className={`text-xs font-semibold ${nodes[3].textColor}`}>{nodes[3].label}</div>
                <div className={`mt-1 text-sm font-medium ${nodes[3].textColor}`}>{nodes[3].text}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: Assumption */}
        <div className="mt-16 flex justify-center">
          <div className="flex flex-col items-center">
            {/* Arrow label: 外部效度缺失 */}
            <div className="mb-2 rounded bg-background px-2 py-1 text-sm text-muted-foreground shadow-sm">
              {arrows[1].label}
            </div>
            <div
              className={`flex h-20 w-40 cursor-pointer items-center justify-center rounded-lg border-2 transition-shadow ${nodes[2].bgColor} ${nodes[2].borderColor} ${hoveredNode === "assumption" ? "shadow-lg" : ""}`}
              onMouseEnter={() => setHoveredNode("assumption")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="text-center">
                <div className={`text-xs font-semibold ${nodes[2].textColor}`}>{nodes[2].label}</div>
                <div className={`mt-1 text-sm font-medium ${nodes[2].textColor}`}>{nodes[2].text}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
