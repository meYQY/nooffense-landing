# NoOffense 项目复现 Prompt

请帮我从零开始构建一个名为 **NoOffense 无意冒犯** 的 Web 应用，这是一个东亚家长话语逻辑分析器。

## 项目概述

**目标**：帮助青少年和大学生（15-22岁）分析东亚父母典型话语中的逻辑问题，提供尖锐但不辱骂的反驳。

**核心功能**：
1. 用户输入父母的一句话（例如："我吃的盐比你吃的饭还多"）
2. AI 分析这句话的逻辑结构，生成：
   - 可视化逻辑图（节点+边）
   - 逐边批判（攻击点/要证据/类比）
   - One-Punch 核心反驳（≤150字）
3. 用户可点击边标签查看详细批判
4. 复制功能（复制核心反驳/复制全部）

## 技术栈要求

- **框架**：Next.js 14.2.5 (App Router)
- **React**：18.3.1
- **TypeScript**：严格模式
- **样式**：Tailwind CSS
- **组件库**：shadcn/ui
- **验证**：Zod
- **AI**：OpenAI API (通过第三方代理)

## 项目结构

```
nooffense-landing/
├── app/
│   ├── page.tsx              # 首页（输入页）
│   ├── result/page.tsx       # 结果页
│   ├── api/analyze/route.ts  # API 路由
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── interactive-logic-diagram.tsx  # 逻辑图组件
│   ├── dynamic-criticism-card.tsx     # 批判卡片
│   └── ui/                            # shadcn/ui 组件
├── types/
│   └── analysis.ts           # TypeScript 类型定义
├── lib/
│   ├── api-client.ts         # API 客户端
│   ├── validation.ts         # Zod schemas
│   └── utils.ts
└── .env.local                # 环境变量
```

## 数据结构设计

### 1. 节点类型 (NodeType)
```typescript
enum NodeType {
  CLAIM = 'claim',           // 主张
  ASSUMPTION = 'assumption', // 假设
  RULE = 'rule',            // 规则
  NORM = 'norm',            // 规范
  CONCLUSION = 'conclusion' // 结论
}
```

### 2. 逻辑图结构
```typescript
interface LogicNode {
  id: string          // "node_1", "node_2"...
  type: NodeType
  label: string       // 显示的标签（中文）
  content: string     // 节点内容
}

interface LogicEdge {
  id: string              // "edge_1", "edge_2"...
  source: string          // 源节点 ID
  target: string          // 目标节点 ID
  label: string           // 边标签（如 "❶ 拿资历说事"）
  primaryLabel: string    // 主标签
  badge: string           // 徽章 ❶❷❸❹...
  badgeColor: string      // red/blue/purple/orange
}
```

### 3. 批判结构
```typescript
interface EdgeCriticism {
  edgeId: string
  edgeLabel: string
  attacks: string[]           // ❌ 攻击点（2-3条）
  evidenceRequests: string[]  // 📎 要证据（2-3条）
  analogies: string[]         // 🪞 同构类比（2-3条）
}
```

### 4. 完整响应
```typescript
interface AnalyzeResponse {
  sentenceType: string         // 句型类型
  onePunch: string            // 核心反驳（≤150字）
  logicGraph: {
    nodes: LogicNode[]
    edges: LogicEdge[]
  }
  criticisms: EdgeCriticism[] // 每条边对应一个批判
}
```

## API 设计

### 端点：POST /api/analyze

**请求体**：
```json
{
  "input": "我吃的盐比你吃的饭还多"
}
```

**AI Prompt 关键要求**：

**系统提示**：
- 目标读者：青少年和大学生（15-22岁）
- 语气：尖锐、犀利、直击要害，但不辱骂、不人身攻击
- 用词：口语化、战斗力强，敢于质疑和揭露矛盾
- 句式：反问为主，质疑式、讽刺式，直戳痛点
- 强度：8.5/10 - 要有攻击性，要让对方说不出话

**语言风格示例**：
- ❌ 太温和："就算你说的是对的，凭什么我就必须听你的？"
- ✅ 够尖锐："你说的对我就得听？那我说1+1=2，你是不是也该把银行卡密码告诉我？这什么逻辑？"

**输出要求**：
- 4-5个节点，展示完整推理链
- 3-4条边，每条边标注一个逻辑问题
- 每条边提供 2-3 个攻击点、要证据、类比
- 必须使用 JSON 格式输出

**响应格式**：
```json
{
  "sentenceType": "诉诸权威",
  "onePunch": "吃的盐多就能替我做决定？那医生吃的药多，是不是也该替你活着？",
  "logicGraph": {
    "nodes": [...],
    "edges": [...]
  },
  "criticisms": [...]
}
```

## UI/UX 要求

### 首页 (app/page.tsx)
- 大标题："NoOffense 无意冒犯"
- 副标题："东亚家长话语逻辑分析器"
- 大型文本输入框（textarea）
- "生成分析" 按钮
- 加载状态显示
- 错误提示

### 结果页 (app/result/page.tsx)

**布局**：
1. **顶部导航栏**：
   - 左：返回按钮
   - 中：标题 "分析结果"
   - 右：复制全部按钮

2. **One-Punch 区域**（黄色背景）：
   - 标题："【核心反驳】"
   - 句型类型显示
   - 核心反驳内容
   - 复制按钮（点击后显示"✓ 已复制"）

3. **使用说明框**（蓝色背景）：
   - 💡 如何使用？
   - 简要说明节点、连线、数字标签的含义

4. **主内容区**（两栏布局）：
   - **左栏（60%）**：交互式逻辑图
     - 方框显示节点，不同颜色区分类型
     - 连线显示边，箭头指向目标
     - 数字标签可点击
     - 可滚动
   - **右栏（40%）**：批判卡片
     - 未选中：提示"点击左侧数字标签"
     - 选中后：显示该边的详细批判
       - ❌ 攻击（红色）
       - 📎 要证据（蓝色）
       - 🪞 同构类比（紫色）

### 逻辑图实现要点

**自动布局算法**：
```typescript
function autoLayout(logicGraph: LogicGraph): Map<string, Position> {
  const positions = new Map()
  const nodes = logicGraph.nodes
  const cols = Math.min(3, Math.ceil(Math.sqrt(nodes.length))) // 最多3列

  nodes.forEach((node, index) => {
    const row = Math.floor(index / cols)
    const col = index % cols
    positions.set(node.id, {
      x: 80 + col * 280,  // 水平间距 280px
      y: 60 + row * 200   // 垂直间距 200px
    })
  })

  return positions
}
```

**SVG 箭头绘制**：
- 使用 SVG `<line>` + `<marker>` 绘制带箭头的连线
- 箭头颜色：未选中灰色，选中蓝色
- 线条粗细：3px（未选中）/ 4px（选中）

**节点样式**：
- 宽度：160px，高度：80px
- 圆角边框，不同类型不同颜色
- 居中显示 label 和 content

**边标签**：
- 绝对定位在连线中点
- 白色背景，圆角，有阴影
- 可点击，点击后高亮
- 使用徽章 ❶❷❸❹

## 数据流

1. **首页输入** → localStorage 存储输入 → 调用 `/api/analyze`
2. **API 处理** → 调用 OpenAI API → 验证 JSON → 返回结果
3. **结果页** → 从 localStorage 读取 → 渲染逻辑图和批判卡片
4. **交互** → 点击边标签 → 更新右侧批判卡片

## 环境变量

```bash
OPENAI_API_KEY=your-api-key-here
```

API 配置：
- 端点：`https://xiaohumini.site/v1/chat/completions`（第三方代理）
- 模型：`gpt-4o-mini`
- Temperature: 0.7
- Max tokens: 3000
- Response format: `{ type: 'json_object' }`

## 关键实现细节

### 1. Zod 验证
对 AI 返回的 JSON 进行严格验证：
- 节点 ID 格式：`/^node_\d+$/`
- 边 ID 格式：`/^edge_\d+$/`
- 徽章格式：`/^[❶❷❸❹❺❻❼❽❾❿]$/`

### 2. 错误处理
- API 调用失败：显示友好错误信息
- JSON 解析失败：返回验证错误
- 复制失败：弹出提示

### 3. 复制功能
使用 `navigator.clipboard.writeText()`，格式：
```
【核心反驳】
{onePunch}

【逻辑分析】
句型：{sentenceType}

【批判详情】
1. {edgeLabel}
❌ {attack1}
❌ {attack2}
📎 {evidence1}
🪞 {analogy1}
...
```

### 4. 样式细节
- 使用 Tailwind CSS
- 响应式设计（移动端友好）
- 流畅的过渡动画
- 清晰的视觉层次

## 部署

- 平台：Vercel
- 环境变量在 Vercel Dashboard 配置
- 自动部署：连接 GitHub 仓库

## 参考示例输入

测试时可以用这些例子：
1. "我吃的盐比你吃的饭还多"
2. "你看看别人家的孩子"
3. "我这都是为了你好"
4. "不听老人言，吃亏在眼前"

## 期望输出效果

对于输入 "我吃的盐比你吃的饭还多"：

**One-Punch**：
"吃的盐多就能替我做决定？那医生吃的药多，是不是也该替你活着？资历不等于正确，正确也不等于我必须服从"

**逻辑图**：
- 节点1（主张）：我吃的盐比你吃的饭还多
- 节点2（规则）：经验多→判断更准确
- 节点3（假设）：过去经验适用于当前情境
- 节点4（规范）：判断准确→应该服从
- 节点5（结论）：听我的准没错

**边**：
- ❶ 拿资历说事（主张→规则）
- ❷ 对了就得听？（规则→规范）
- ❸ 时代变了（假设→规则）
- ❹ 必须听话（规范→结论）

每条边都有尖锐的攻击、证据要求和荒谬类比。

## 重要提示

1. **语言风格**：必须尖锐、犀利，多用反问和质疑，不能太温和
2. **逻辑完整性**：节点和边要能形成完整的推理链
3. **用户友好**：界面清晰，交互流畅，有足够的提示
4. **数据验证**：严格验证 AI 返回的数据结构

---

请按照以上要求从零开始构建这个项目。如有不清楚的地方，可以参考仓库：https://github.com/meYQY/nooffense-landing
