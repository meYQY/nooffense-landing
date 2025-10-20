// 逻辑分析相关的类型定义

// 节点类型枚举
export enum NodeType {
  CLAIM = 'claim',           // 主张
  ASSUMPTION = 'assumption', // 假设
  RULE = 'rule',            // 规则
  NORM = 'norm',            // 规范
  CONCLUSION = 'conclusion' // 结论
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
  id: string;           // 唯一ID，如 "node_1"
  type: NodeType;       // 节点类型
  label: string;        // 类型标签（中文），如 "主张"
  content: string;      // 节点内容，如 "我吃盐多"
  position?: Position;  // 可选：节点位置
}

// 逻辑边
export interface LogicEdge {
  id: string;              // 唯一ID，如 "edge_1"
  source: string;          // 源节点ID
  target: string;          // 目标节点ID
  label: string;           // 边标签，如 "诉诸权威"
  primaryLabel: string;    // 主标签，如 "权威替代"
  secondaryNote?: string;  // 补充说明
  badge: string;           // 徽章，如 "❶"
  badgeColor: BadgeColor;  // 徽章颜色
}

// 逻辑图
export interface LogicGraph {
  nodes: LogicNode[];
  edges: LogicEdge[];
}

// 边的批判
export interface EdgeCriticism {
  edgeId: string;               // 对应的边ID
  edgeLabel: string;            // 边标签
  attacks: string[];            // ❌ 攻击点
  evidenceRequests: string[];   // 📎 要证据
  analogies: string[];          // 🪞 同构类比
}

// API 请求
export interface AnalyzeRequest {
  input: string;  // 用户输入
}

// API 响应
export interface AnalyzeResponse {
  sentenceType: string;         // 句型分类
  onePunch: string;             // 核心反驳
  logicGraph: LogicGraph;       // 逻辑图
  criticisms: EdgeCriticism[];  // 批判详情
  harshRebuttals?: string[];    // 强硬反驳（可选）
}

// 错误响应
export interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
}

// 节点颜色映射（前端使用）
export const NODE_COLORS: Record<NodeType, { bg: string; border: string; text: string }> = {
  [NodeType.CLAIM]: {
    bg: 'bg-blue-100',
    border: 'border-blue-500',
    text: 'text-blue-700'
  },
  [NodeType.ASSUMPTION]: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-500',
    text: 'text-yellow-700'
  },
  [NodeType.RULE]: {
    bg: 'bg-green-100',
    border: 'border-green-500',
    text: 'text-green-700'
  },
  [NodeType.NORM]: {
    bg: 'bg-purple-100',
    border: 'border-purple-500',
    text: 'text-purple-700'
  },
  [NodeType.CONCLUSION]: {
    bg: 'bg-red-100',
    border: 'border-red-500',
    text: 'text-red-700'
  }
};

// 徽章颜色映射
export const BADGE_COLORS: Record<BadgeColor, string> = {
  [BadgeColor.RED]: 'from-red-400 to-red-600',
  [BadgeColor.BLUE]: 'from-blue-400 to-blue-600',
  [BadgeColor.PURPLE]: 'from-purple-400 to-purple-600',
  [BadgeColor.GREEN]: 'from-green-400 to-green-600',
  [BadgeColor.ORANGE]: 'from-orange-400 to-orange-600'
};
