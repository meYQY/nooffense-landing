"use client"

import { EdgeCriticism } from "@/types/analysis"
import { useState } from "react"

interface DynamicCriticismCardProps {
  criticisms: EdgeCriticism[]
  edgeId: string | null
}

export function DynamicCriticismCard({ criticisms, edgeId }: DynamicCriticismCardProps) {
  const [showHarsh, setShowHarsh] = useState(false)

  if (!edgeId) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center bg-blue-50 border-2 border-blue-200 border-dashed rounded-lg p-8 max-w-md">
          <p className="text-xl text-blue-700 font-medium leading-relaxed">
            👆 点击上方逻辑图中的边标签查看详细批判
          </p>
        </div>
      </div>
    )
  }

  const criticism = criticisms.find(c => c.edgeId === edgeId)

  if (!criticism) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-center text-muted-foreground">未找到对应的批判内容</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 transition-all duration-300">
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-foreground">
          {criticism.edgeLabel}
        </h3>
      </div>

      <div className="border-t border-border" />

      <div className="space-y-6">
        {/* 攻击点 */}
        {criticism.attacks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-red-500">
              ❌ 攻击
            </h4>
            <div className="text-muted-foreground/30">━━━━━━━━━━━━━━</div>
            <ul className="space-y-2">
              {criticism.attacks.map((point, index) => (
                <li key={index} className="text-sm leading-relaxed text-foreground/90">
                  • {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 要证据 */}
        {criticism.evidenceRequests.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-blue-500">
              📎 要证据
            </h4>
            <div className="text-muted-foreground/30">━━━━━━━━━━━━━━</div>
            <ul className="space-y-2">
              {criticism.evidenceRequests.map((point, index) => (
                <li key={index} className="text-sm leading-relaxed text-foreground/90">
                  • {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 同构类比 */}
        {criticism.analogies.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-purple-500">
              🪞 同构类比
            </h4>
            <div className="text-muted-foreground/30">━━━━━━━━━━━━━━</div>
            <ul className="space-y-2">
              {criticism.analogies.map((point, index) => (
                <li key={index} className="text-sm leading-relaxed text-foreground/90">
                  • {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
