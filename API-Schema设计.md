# API Schema 设计文档

> 定义前后端数据交互的完整结构

---

## 一、核心数据结构

### 1. 请求 Schema（用户输入）

```typescript
// POST /api/analyze
interface AnalyzeRequest {
  input: string;  // 用户输入的家长话术
}

// 示例
{
  "input": "我吃的盐比你吃的饭还多，听我的准没错"
}
```

---

### 2. 响应 Schema（LLM输出）

```typescript
interface AnalyzeResponse {
  // 句型分类
  sentenceType: string;  // 10类句型之一

  // 核心反驳（One-Punch）
  onePunch: string;  // ≤200字的总反驳

  // 逻辑图
  logicGraph: {
    nodes: LogicNode[];  // 节点列表
    edges: LogicEdge[];  // 边列表
  };

  // 批判详情（按边组织）
  criticisms: EdgeCriticism[];  // 每条边的批判

  // 强硬反驳句（可选展开）
  harshRebuttals?: string[];  // 3-5条反驳句
}
```

---

## 二、详细类型定义

### 2.1 LogicNode（逻辑节点）

```typescript
interface LogicNode {
  id: string;  // 唯一ID，如 "node_1", "node_2"

  type: NodeType;  // 节点类型（枚举）

  label: string;  // 节点的类型标签（中文），如 "主张"、"规则"

  content: string;  // 节点的具体内容，如 "我吃盐多"

  position?: {  // 可选：节点在图中的位置（如果LLM能生成）
    x: number;
    y: number;
  };
}

// 节点类型枚举
enum NodeType {
  CLAIM = 'claim',           // 主张
  ASSUMPTION = 'assumption', // 假设
  RULE = 'rule',            // 规则
  NORM = 'norm',            // 规范
  CONCLUSION = 'conclusion' // 结论
}

// 节点颜色映射（前端使用）
const NODE_COLORS = {
  claim: { bg: 'bg-blue-100', border: 'border-blue-500' },
  assumption: { bg: 'bg-yellow-100', border: 'border-yellow-500' },
  rule: { bg: 'bg-green-100', border: 'border-green-500' },
  norm: { bg: 'bg-purple-100', border: 'border-purple-500' },
  conclusion: { bg: 'bg-red-100', border: 'border-red-500' }
};
```

**示例**：
```json
{
  "id": "node_1",
  "type": "claim",
  "label": "主张",
  "content": "我吃盐多",
  "position": { "x": 50, "y": 150 }
}
```

---

### 2.2 LogicEdge（逻辑边）

```typescript
interface LogicEdge {
  id: string;  // 唯一ID，如 "edge_1", "edge_2"

  source: string;  // 源节点ID（从哪个节点出发）

  target: string;  // 目标节点ID（指向哪个节点）

  label: string;  // 边的标签（显示在箭头上），如 "诉诸权威"

  primaryLabel: string;  // 主标签（用于分类统计），如 "权威替代"

  secondaryNote?: string;  // 补充说明（可选），如 "用经验年限替代论证质量"

  badge: string;  // 徽章编号，如 "❶", "❷", "❸"

  badgeColor: string;  // 徽章颜色类，如 "red", "blue", "purple"
}
```

**示例**：
```json
{
  "id": "edge_1",
  "source": "node_1",
  "target": "node_2",
  "label": "诉诸权威",
  "primaryLabel": "权威替代",
  "secondaryNote": "用经验年限替代论证质量",
  "badge": "❶",
  "badgeColor": "red"
}
```

---

### 2.3 EdgeCriticism（边的批判）

```typescript
interface EdgeCriticism {
  edgeId: string;  // 对应的边ID

  edgeLabel: string;  // 边的标签（方便前端显示）

  // ❌ 攻击点
  attacks: string[];  // 2-4条攻击要点

  // 📎 要证据
  evidenceRequests: string[];  // 1-3条证据要求

  // 🪞 同构类比
  analogies: string[];  // 1-2条类比
}
```

**示例**：
```json
{
  "edgeId": "edge_1",
  "edgeLabel": "诉诸权威",
  "attacks": [
    "资历≠正确性。经验多不等于在这个具体问题上的判断准确。",
    "吃盐的量和决策能力没有因果关系，这是隐喻的滥用。"
  ],
  "evidenceRequests": [
    "需要证据：你在这个具体问题上的历史决策准确率是多少？",
    "需要对照：同样资历的其他人，在类似问题上的判断如何？"
  ],
  "analogies": [
    ""我看的电影比你多，所以你该听我的穿衣建议"——看电影多和穿衣品味有必然联系吗？"
  ]
}
```

---

## 三、完整响应示例

```json
{
  "sentenceType": "诉诸权威",

  "onePunch": "资历不等于在这个具体问题上的判断准确性，且从'可能更正确'到'必须服从'缺少规范性论证。你的经验是否适用于当前情境，需要验证而非假设。",

  "logicGraph": {
    "nodes": [
      {
        "id": "node_1",
        "type": "claim",
        "label": "主张",
        "content": "我吃盐多",
        "position": { "x": 50, "y": 150 }
      },
      {
        "id": "node_2",
        "type": "rule",
        "label": "规则",
        "content": "资历多→更正确",
        "position": { "x": 300, "y": 80 }
      },
      {
        "id": "node_3",
        "type": "assumption",
        "label": "假设",
        "content": "情境相似",
        "position": { "x": 300, "y": 280 }
      },
      {
        "id": "node_4",
        "type": "conclusion",
        "label": "结论",
        "content": "你应该听我的",
        "position": { "x": 550, "y": 150 }
      }
    ],
    "edges": [
      {
        "id": "edge_1",
        "source": "node_1",
        "target": "node_2",
        "label": "诉诸权威",
        "primaryLabel": "权威替代",
        "secondaryNote": "用经验年限替代论证质量",
        "badge": "❶",
        "badgeColor": "red"
      },
      {
        "id": "edge_2",
        "source": "node_2",
        "target": "node_4",
        "label": "事实→义务",
        "primaryLabel": "休谟鸿沟",
        "secondaryNote": "从描述性前提推出规范性结论",
        "badge": "❷",
        "badgeColor": "blue"
      },
      {
        "id": "edge_3",
        "source": "node_3",
        "target": "node_2",
        "label": "外部效度缺失",
        "primaryLabel": "情境假设",
        "secondaryNote": "未验证决策情境是否可类比",
        "badge": "❸",
        "badgeColor": "purple"
      }
    ]
  },

  "criticisms": [
    {
      "edgeId": "edge_1",
      "edgeLabel": "诉诸权威",
      "attacks": [
        "资历≠正确性。经验多不等于在这个具体问题上的判断准确。",
        "吃盐的量和决策能力没有因果关系，这是隐喻的滥用。"
      ],
      "evidenceRequests": [
        "需要证据：你在这个具体问题上的历史决策准确率是多少？",
        "需要对照：同样资历的其他人，在类似问题上的判断如何？"
      ],
      "analogies": [
        ""我看的电影比你多，所以你该听我的穿衣建议"——看电影多和穿衣品味有必然联系吗？"
      ]
    },
    {
      "edgeId": "edge_2",
      "edgeLabel": "事实→义务",
      "attacks": [
        "从'我可能更正确'跳到'你应该听我的'，中间缺少规范性论证。",
        "即使你的判断概率更高，也不能推出'必须服从'这个义务。"
      ],
      "evidenceRequests": [
        "需要论证：为什么概率上的优势可以转化为服从的义务？",
        "需要讨论：如果我不服从，会有什么实质性的负面后果？"
      ],
      "analogies": [
        ""统计显示医生建议有70%准确率，所以你必须无条件听医生的"——但实际上患者仍有知情同意权。"
      ]
    },
    {
      "edgeId": "edge_3",
      "edgeLabel": "外部效度缺失",
      "attacks": [
        "隐藏假设：你的历史经验和当前决策情境高度相似。但这个假设从未被验证。",
        "外部效度问题：时代、技术、社会环境都在变化，过去的经验未必适用。"
      ],
      "evidenceRequests": [
        "需要证据：当前情境和你过去的经验情境，有哪些关键相似点？",
        "需要论证：如果情境不同，你的经验如何迁移？"
      ],
      "analogies": [
        ""我30年前高考成功了，所以你现在也该用我当年的方法"——但30年前没有互联网、AI、新高考改革。"
      ]
    }
  ],

  "harshRebuttals": [
    "如果吃盐多就代表判断准确，那腌鱼应该当诺贝尔评委。",
    "你需要证明的是：在这个具体问题上，你的判断为什么更准确——而不是诉诸年龄。",
    "即使你的建议概率上更优，我仍有权根据自己的风险偏好做决策。服从不是逻辑推论，是权力要求。",
    "你的经验形成于不同的时代和环境。如果情境已变，那经验的适用性需要重新论证，而不是默认成立。"
  ]
}
```

---

## 四、数据约束和验证规则

### 4.1 必需字段验证

| 字段 | 类型 | 必需 | 约束 |
|------|------|------|------|
| `sentenceType` | string | ✅ | 非空 |
| `onePunch` | string | ✅ | ≤300字 |
| `logicGraph.nodes` | array | ✅ | 长度 ≥3，≤10 |
| `logicGraph.edges` | array | ✅ | 长度 ≥2，≤15 |
| `criticisms` | array | ✅ | 长度 = edges数量 |
| `harshRebuttals` | array | ❌ | 可选，长度 ≤5 |

### 4.2 节点约束

- **ID格式**：`node_` + 数字，如 `node_1`
- **类型**：必须是5种之一（claim/assumption/rule/norm/conclusion）
- **内容**：非空，≤100字
- **位置**：可选，如果提供则 x, y 都是数字

### 4.3 边约束

- **ID格式**：`edge_` + 数字，如 `edge_1`
- **source/target**：必须指向存在的节点ID
- **label**：非空，≤30字
- **badge**：必须是 ❶❷❸❹❺❻❼❽❾❿ 之一
- **badgeColor**：必须是 red/blue/purple/green/orange 之一

### 4.4 批判约束

- **attacks**：至少1条，最多5条，每条≤200字
- **evidenceRequests**：至少1条，最多3条，每条≤200字
- **analogies**：至少1条，最多2条，每条≤200字

---

## 五、TypeScript 完整定义（可直接使用）

```typescript
// types/analysis.ts

// 节点类型枚举
export enum NodeType {
  CLAIM = 'claim',
  ASSUMPTION = 'assumption',
  RULE = 'rule',
  NORM = 'norm',
  CONCLUSION = 'conclusion'
}

// 徽章颜色枚举
export enum BadgeColor {
  RED = 'red',
  BLUE = 'blue',
  PURPLE = 'purple',
  GREEN = 'green',
  ORANGE = 'orange'
}

// 位置坐标
export interface Position {
  x: number;
  y: number;
}

// 逻辑节点
export interface LogicNode {
  id: string;
  type: NodeType;
  label: string;
  content: string;
  position?: Position;
}

// 逻辑边
export interface LogicEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  primaryLabel: string;
  secondaryNote?: string;
  badge: string;
  badgeColor: BadgeColor;
}

// 逻辑图
export interface LogicGraph {
  nodes: LogicNode[];
  edges: LogicEdge[];
}

// 边的批判
export interface EdgeCriticism {
  edgeId: string;
  edgeLabel: string;
  attacks: string[];
  evidenceRequests: string[];
  analogies: string[];
}

// API 请求
export interface AnalyzeRequest {
  input: string;
}

// API 响应
export interface AnalyzeResponse {
  sentenceType: string;
  onePunch: string;
  logicGraph: LogicGraph;
  criticisms: EdgeCriticism[];
  harshRebuttals?: string[];
}

// 错误响应
export interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
}
```

---

## 六、Zod Schema（运行时验证）

```typescript
// lib/validation.ts
import { z } from 'zod';

// 节点验证
const LogicNodeSchema = z.object({
  id: z.string().regex(/^node_\d+$/),
  type: z.enum(['claim', 'assumption', 'rule', 'norm', 'conclusion']),
  label: z.string().min(1).max(10),
  content: z.string().min(1).max(100),
  position: z.object({
    x: z.number(),
    y: z.number()
  }).optional()
});

// 边验证
const LogicEdgeSchema = z.object({
  id: z.string().regex(/^edge_\d+$/),
  source: z.string(),
  target: z.string(),
  label: z.string().min(1).max(30),
  primaryLabel: z.string().min(1).max(30),
  secondaryNote: z.string().max(100).optional(),
  badge: z.string().regex(/^[❶❷❸❹❺❻❼❽❾❿]$/),
  badgeColor: z.enum(['red', 'blue', 'purple', 'green', 'orange'])
});

// 批判验证
const EdgeCriticismSchema = z.object({
  edgeId: z.string(),
  edgeLabel: z.string(),
  attacks: z.array(z.string().max(200)).min(1).max(5),
  evidenceRequests: z.array(z.string().max(200)).min(1).max(3),
  analogies: z.array(z.string().max(200)).min(1).max(2)
});

// 完整响应验证
export const AnalyzeResponseSchema = z.object({
  sentenceType: z.string().min(1),
  onePunch: z.string().min(10).max(300),
  logicGraph: z.object({
    nodes: z.array(LogicNodeSchema).min(3).max(10),
    edges: z.array(LogicEdgeSchema).min(2).max(15)
  }),
  criticisms: z.array(EdgeCriticismSchema).min(1),
  harshRebuttals: z.array(z.string().max(200)).max(5).optional()
});

// 验证函数
export function validateAnalyzeResponse(data: unknown): AnalyzeResponse {
  return AnalyzeResponseSchema.parse(data);
}
```

---

## 七、前端使用示例

```typescript
// 前端调用API
async function analyzeInput(input: string): Promise<AnalyzeResponse> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input })
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.message);
  }

  const data: AnalyzeResponse = await response.json();
  return data;
}

// 使用示例
const result = await analyzeInput("我吃的盐比你吃的饭还多");

console.log(result.onePunch);  // 核心反驳
console.log(result.logicGraph.nodes);  // 节点列表
console.log(result.criticisms);  // 批判详情
```

---

## 八、下一步：将Schema集成到项目

### 8.1 创建类型文件

```bash
mkdir /Users/teddy/Downloads/nooffense-landing/types
touch /Users/teddy/Downloads/nooffense-landing/types/analysis.ts
```

### 8.2 创建验证文件

```bash
touch /Users/teddy/Downloads/nooffense-landing/lib/validation.ts
```

### 8.3 在API route中使用

```typescript
// app/api/analyze/route.ts
import { validateAnalyzeResponse } from '@/lib/validation';

export async function POST(request: Request) {
  const { input } = await request.json();

  // 调用LLM...
  const llmOutput = await callOpenAI(input);

  // 验证输出
  const validated = validateAnalyzeResponse(llmOutput);

  return Response.json(validated);
}
```

---

## 九、注意事项

### 9.1 灵活性 vs 严格性

- **节点和边的数量**：不固定，根据输入复杂度调整
- **批判的长度**：可以略微超出限制，但要合理
- **位置坐标**：LLM可能生成不了，前端可以用自动布局

### 9.2 错误处理

如果LLM输出格式不正确：
1. **尝试修复**：如ID格式错误，自动生成正确的ID
2. **降级处理**：如位置缺失，前端用默认布局
3. **重试**：如果完全无效，重新调用LLM

### 9.3 扩展性

未来可能新增：
- `confidence`: 每个批判的置信度分数
- `sources`: 批判的参考来源
- `alternatives`: 替代解释
- `metadata`: 分析的元数据（耗时、模型版本等）

---

**这个Schema已经可以直接使用！下一步就是基于它来写Prompt和API集成。**
