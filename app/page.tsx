"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { analyzeText, formatErrorMessage } from "@/lib/api-client"

export default function Home() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("请输入内容")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await analyzeText(input)
      // 保存结果到 localStorage
      localStorage.setItem("analysisResult", JSON.stringify(result))
      localStorage.setItem("analysisInput", input)
      router.push("/result")
    } catch (err) {
      setError(formatErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleShowExample = () => {
    setInput("我吃的盐比你吃的饭还多,听我的准没错")
  }

  return (
    <main className="min-h-screen bg-background px-4 py-20">
      <div className="mx-auto max-w-[800px]">
        {/* Header Section */}
        <header className="text-center">
          <h1 className="text-5xl font-bold text-foreground">东亚父母逻辑分析器</h1>
          <p className="mt-4 text-lg text-muted-foreground">输入父母的一句话,点击「生成逻辑图」开始分析</p>
        </header>

        {/* Input Section */}
        <div className="mt-12">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例如:我吃的盐比你吃的饭还多,听我的准没错&#10;或:考不上前5名就别想玩手机"
            className="h-[200px] w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Button Section */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-lg px-8 py-3 text-primary-foreground transition-colors hover:bg-primary/90 bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "分析中..." : "生成逻辑图"}
          </Button>
          <Button
            onClick={handleShowExample}
            disabled={loading}
            variant="outline"
            className="rounded-lg border border-border bg-background px-8 py-3 text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            查看示例
          </Button>
        </div>
      </div>
    </main>
  )
}
