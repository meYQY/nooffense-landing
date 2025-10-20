import { z } from 'zod';
import { NodeType, BadgeColor } from '@/types/analysis';

// Position schema
export const positionSchema = z.object({
  x: z.number(),
  y: z.number()
});

// Node type schema
export const nodeTypeSchema = z.nativeEnum(NodeType);

// Badge color schema
export const badgeColorSchema = z.nativeEnum(BadgeColor);

// Logic node schema
export const logicNodeSchema = z.object({
  id: z.string().regex(/^node_\d+$/, '节点ID必须是node_开头加数字'),
  type: nodeTypeSchema,
  label: z.string().min(1, '节点标签不能为空'),
  content: z.string().min(1, '节点内容不能为空').max(200, '节点内容不能超过200字'),
  position: positionSchema.optional()
});

// Logic edge schema
export const logicEdgeSchema = z.object({
  id: z.string().regex(/^edge_\d+$/, '边ID必须是edge_开头加数字'),
  source: z.string().regex(/^node_\d+$/, '源节点ID格式错误'),
  target: z.string().regex(/^node_\d+$/, '目标节点ID格式错误'),
  label: z.string().min(1, '边标签不能为空'),
  primaryLabel: z.string().min(1, '主标签不能为空'),
  secondaryNote: z.string().optional(),
  badge: z.string().regex(/^[❶❷❸❹❺❻❼❽❾❿]$/, '徽章必须是❶-❿之一'),
  badgeColor: badgeColorSchema
});

// Logic graph schema
export const logicGraphSchema = z.object({
  nodes: z.array(logicNodeSchema)
    .min(2, '至少需要2个节点')
    .max(10, '节点数不能超过10'),
  edges: z.array(logicEdgeSchema)
    .min(1, '至少需要1条边')
    .max(10, '边数不能超过10')
});

// Edge criticism schema
export const edgeCriticismSchema = z.object({
  edgeId: z.string().regex(/^edge_\d+$/, '边ID格式错误'),
  edgeLabel: z.string().min(1, '边标签不能为空'),
  attacks: z.array(z.string().min(1)).max(5, '攻击点不能超过5个'),
  evidenceRequests: z.array(z.string().min(1)).max(5, '证据请求不能超过5个'),
  analogies: z.array(z.string().min(1)).max(3, '类比不能超过3个')
});

// Analyze request schema
export const analyzeRequestSchema = z.object({
  input: z.string()
    .min(1, '输入不能为空')
    .max(500, '输入不能超过500字')
    .refine(val => val.trim().length > 0, '输入不能只包含空格')
});

// Analyze response schema
export const analyzeResponseSchema = z.object({
  sentenceType: z.string().min(1, '句型分类不能为空'),
  onePunch: z.string()
    .min(1, '核心反驳不能为空')
    .max(200, '核心反驳不能超过200字'),
  logicGraph: logicGraphSchema,
  criticisms: z.array(edgeCriticismSchema)
    .min(1, '至少需要1个批判')
    .max(10, '批判数不能超过10'),
  harshRebuttals: z.array(z.string().min(1).max(200))
    .max(3, '强硬反驳不能超过3个')
    .optional()
});

// Error response schema
export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  code: z.string().optional()
});

// Helper function to validate and parse data
export function validateAnalyzeRequest(data: unknown) {
  return analyzeRequestSchema.parse(data);
}

export function validateAnalyzeResponse(data: unknown) {
  return analyzeResponseSchema.parse(data);
}

// Safe validation (returns error instead of throwing)
export function safeValidateAnalyzeRequest(data: unknown) {
  return analyzeRequestSchema.safeParse(data);
}

export function safeValidateAnalyzeResponse(data: unknown) {
  return analyzeResponseSchema.safeParse(data);
}
