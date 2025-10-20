"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { InteractiveLogicDiagram } from "@/components/interactive-logic-diagram"
import { DynamicCriticismCard } from "@/components/dynamic-criticism-card"
import { AnalyzeResponse } from "@/types/analysis"

export default function ResultPage() {
  const router = useRouter()
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<AnalyzeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)

  useEffect(() => {
    // 从 localStorage 读取数据
    const dataStr = localStorage.getItem("analysisResult")
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr) as AnalyzeResponse
        setAnalysisData(data)
      } catch (err) {
        console.error("Failed to parse analysis data:", err)
      }
    }
    setLoading(false)
  }, [])

  const handleEdgeSelect = (edgeId: string | null) => {
    setSelectedEdge(edgeId)
  }

  const handleCopyAll = async () => {
    if (!analysisData) return
    const text = `【核心反驳】\n${analysisData.onePunch}\n\n【逻辑分析】\n句型：${analysisData.sentenceType}\n\n【批判详情】\n${analysisData.criticisms.map((c, i) => `${i + 1}. ${c.edgeLabel}\n${c.attacks.map(a => `❌ ${a}`).join('\n')}\n${c.evidenceRequests.map(e => `📎 ${e}`).join('\n')}\n${c.analogies.map(a => `🪞 ${a}`).join('\n')}`).join('\n\n')}`

    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess('all')
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (err) {
      console.error('复制失败:', err)
      alert('复制失败，请重试')
    }
  }

  const handleCopyCore = async () => {
    if (!analysisData) return
    try {
      await navigator.clipboard.writeText(analysisData.onePunch)
      setCopySuccess('core')
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (err) {
      console.error('复制失败:', err)
      alert('复制失败，请重试')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">加载中...</p>
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">没有分析数据</p>
          <Button onClick={() => router.push("/")}>返回首页</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation Bar */}
      <nav className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
        <Button variant="ghost" onClick={() => router.push("/")} className="text-foreground hover:bg-muted">
          ← 返回
        </Button>
        <h1 className="text-lg font-semibold text-foreground">分析结果</h1>
        <Button
          variant="secondary"
          onClick={handleCopyAll}
          className="rounded-lg bg-muted text-foreground hover:bg-muted/80"
        >
          {copySuccess === 'all' ? '✓ 已复制' : '复制全部'}
        </Button>
      </nav>

      {/* One-Punch Section */}
      <section className="w-full bg-yellow-100 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">【核心反驳】</h2>
              <p className="text-sm text-gray-600 mt-1">句型：{analysisData.sentenceType}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyCore}
              className="rounded bg-background px-4 py-2 text-sm text-foreground hover:bg-background/90"
            >
              {copySuccess === 'core' ? '✓ 已复制' : '复制'}
            </Button>
          </div>
          <p className="mt-4 text-lg leading-relaxed text-gray-800">
            {analysisData.onePunch}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl p-6">
        {/* Quick Guide */}
        <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1 text-sm text-blue-900">
              <p className="font-semibold mb-2">如何使用？</p>
              <ul className="space-y-1 text-blue-800">
                <li>• <strong>方框</strong>：父母这句话里包含的各个论点</li>
                <li>• <strong>连线上的数字标签</strong>：标出了论点之间推导的逻辑漏洞</li>
                <li>• <strong>点击数字标签</strong>：查看右侧的详细批判（❌攻击、📎要证据、🪞类比）</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[60%_40%]">
          {/* Left Column - Interactive Logic Diagram */}
          <div className="relative min-h-[600px] rounded-xl bg-background p-6 shadow-sm">
            <InteractiveLogicDiagram
              logicGraph={analysisData.logicGraph}
              onEdgeSelect={handleEdgeSelect}
              selectedEdge={selectedEdge}
            />
          </div>

          {/* Right Column - Dynamic Criticism Card */}
          <div className="min-h-[600px] rounded-xl bg-background p-6 shadow-sm">
            <DynamicCriticismCard
              criticisms={analysisData.criticisms}
              edgeId={selectedEdge}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
