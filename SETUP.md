# 东亚父母逻辑分析器 - 设置指南

## 已完成的工作

### 1. API Schema 设计 ✅
- **文档**: `API-Schema设计.md` - 完整的 API 设计文档
- **类型定义**: `types/analysis.ts` - TypeScript 类型定义
  - NodeType 枚举（5种节点类型）
  - LogicNode, LogicEdge, LogicGraph 接口
  - EdgeCriticism 批判接口
  - AnalyzeRequest/Response 接口
  - UI 颜色映射常量

### 2. 数据验证层 ✅
- **文件**: `lib/validation.ts`
- 使用 Zod 实现运行时数据验证
- 包含所有 Schema 的验证规则
- 提供辅助函数：
  - `validateAnalyzeRequest()` - 验证请求数据
  - `validateAnalyzeResponse()` - 验证响应数据
  - `safeValidate*()` - 安全验证（返回结果而非抛出异常）

### 3. API 路由 ✅
- **文件**: `app/api/analyze/route.ts`
- POST `/api/analyze` 端点
- 集成 OpenAI GPT-4 的结构化输出
- 完整的错误处理和验证
- 系统提示词已优化

### 4. 前端 API 客户端 ✅
- **文件**: `lib/api-client.ts`
- `analyzeText()` 函数用于调用分析 API
- 自定义 `ApiError` 类处理错误
- `formatErrorMessage()` 格式化用户友好的错误信息

## 环境配置

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制 `.env.example` 为 `.env.local`:
```bash
cp .env.example .env.local
```

编辑 `.env.local` 添加你的 OpenAI API Key:
```env
OPENAI_API_KEY=sk-your-api-key-here
```

**获取 API Key:**
- 访问 https://platform.openai.com/api-keys
- 创建新的 API key
- 确保账户有 GPT-4 的访问权限

### 3. 清理构建缓存（如果遇到问题）
```bash
rm -rf .next
npm run dev
```

## 待办事项

### 1. 修复前端集成 🔧
当前前端使用的是静态 mock 数据。需要：
- [ ] 在主页面组件中导入 `analyzeText` 函数
- [ ] 替换 mock 数据为真实 API 调用
- [ ] 添加加载状态处理
- [ ] 添加错误提示 UI
- [ ] 测试完整流程

**参考代码位置:**
- 主页: `app/page.tsx`
- 结果页: `app/result/page.tsx`（如果存在）

### 2. Prompt 优化 🎯
当前的系统提示词（`SYSTEM_PROMPT`）已包含基础逻辑，但需要：
- [ ] 使用真实案例测试
- [ ] 根据输出质量调整提示词
- [ ] 优化节点和边的生成策略
- [ ] 确保批判内容的质量
- [ ] 调整徽章颜色分配逻辑

**测试示例:**
```javascript
// 建议用这些经典案例测试
const testCases = [
  "我吃的盐比你吃的饭还多",
  "你看隔壁家小明都考上清华了",
  "不听话就是不孝顺",
  "现在不好好学习，以后就只能扫大街"
];
```

### 3. 错误处理增强 ⚠️
- [ ] 添加 API rate limit 处理
- [ ] 添加重试逻辑（网络错误）
- [ ] 完善错误日志记录
- [ ] 用户友好的错误提示

### 4. 性能优化 ⚡
- [ ] 实现请求节流（避免重复提交）
- [ ] 添加响应缓存（相同输入返回缓存结果）
- [ ] 考虑使用 React Query 管理 API 状态

### 5. 测试 🧪
- [ ] 单元测试：validation.ts 的 Zod schemas
- [ ] 集成测试：API 路由
- [ ] E2E 测试：完整用户流程

## API 使用示例

### 请求
```typescript
import { analyzeText } from '@/lib/api-client';

try {
  const result = await analyzeText("我吃的盐比你吃的饭还多");
  console.log('分析结果:', result);
  // 使用 result.logicGraph, result.criticisms 等
} catch (error) {
  console.error('分析失败:', formatErrorMessage(error));
}
```

### 响应结构
```json
{
  "sentenceType": "诉诸权威",
  "onePunch": "年龄和经验不等于逻辑正确",
  "logicGraph": {
    "nodes": [...],
    "edges": [...]
  },
  "criticisms": [
    {
      "edgeId": "edge_1",
      "edgeLabel": "诉诸权威",
      "attacks": ["..."],
      "evidenceRequests": ["..."],
      "analogies": ["..."]
    }
  ],
  "harshRebuttals": ["..."]
}
```

## 技术栈总结

- **框架**: Next.js 14.2.5 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **验证**: Zod
- **AI**: OpenAI GPT-4 (Structured Output)
- **部署**: Vercel (推荐)

## 常见问题

### Q: API 返回 MISSING_API_KEY 错误
A: 检查 `.env.local` 文件是否存在，且包含正确的 `OPENAI_API_KEY`

### Q: 分析结果不准确
A: 调整 `app/api/analyze/route.ts` 中的 `SYSTEM_PROMPT`，或修改 temperature 参数

### Q: 构建错误
A: 尝试删除 `.next` 目录并重新运行 `npm run dev`

### Q: OpenAI API 超时
A: 增加 fetch 的 timeout 配置，或者考虑使用流式响应

## 下一步建议

1. **立即**: 配置 `.env.local` 并测试 API
2. **短期**: 集成前端，完成 MVP
3. **中期**: 优化 Prompt，提升分析质量
4. **长期**: 添加用户反馈机制，持续改进

---

📝 **Note**: 这是 MVP 版本的设置指南。随着项目发展，请及时更新此文档。
