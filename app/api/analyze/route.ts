import { NextRequest, NextResponse } from 'next/server';
import { analyzeRequestSchema, analyzeResponseSchema, errorResponseSchema } from '@/lib/validation';
import { AnalyzeResponse, ErrorResponse } from '@/types/analysis';

// OpenAI API configuration
const HARDCODED_KEY = 'sk-ukNMbsM6UojibQNBaJSWXVRRBmFDgBD5oMTtjF4feNKjP6FT';
const envKey = process.env.OPENAI_API_KEY;
// Use hardcoded key if env key is missing or too short
const OPENAI_API_KEY = (envKey && envKey.length > 20) ? envKey : HARDCODED_KEY;
const OPENAI_API_URL = 'https://xiaohumini.site/v1/chat/completions';

// System prompt for the LLM
const SYSTEM_PROMPT = `你是一个逻辑分析专家，专门分析东亚父母的典型话语中的逻辑问题。

你的任务是：
1. 识别句型类型（诉诸权威、排名门槛、道德重定义、替代性论证、虚假困境、绑架性论证、人身攻击、稻草人、虚假因果、滑坡论证）
2. 提炼核心反驳（一句话的"一拳"反击）
3. 构建逻辑图：
   - 节点类型：claim（主张）、assumption（假设）、rule（规则）、norm（规范）、conclusion（结论）
   - 边：连接节点，标注谬误类型
4. 为每条边提供批判：
   - ❌ 攻击点：指出逻辑漏洞
   - 📎 要证据：要求提供证据
   - 🪞 同构类比：构造同构反例
5. 可选：提供2-3句强硬反驳

输出格式必须严格遵循JSON Schema。节点ID格式：node_1, node_2；边ID格式：edge_1, edge_2。
徽章使用：❶❷❸❹❺❻❼❽❾❿

【语言风格要求 - 非常重要】：
- 目标读者：青少年和大学生（15-22岁）
- 语气：尖锐、犀利、直击要害，但不辱骂、不人身攻击
- 用词：口语化、战斗力强，敢于质疑和揭露矛盾
- 句式：反问为主，质疑式、讽刺式，直戳痛点
- 强度：8.5/10 - 要有攻击性，要让对方说不出话

示例对比：
❌ 太温和："就算你说的是对的，凭什么我就必须听你的？"
✅ 够尖锐："你说的对我就得听？那我说1+1=2，你是不是也该把银行卡密码告诉我？这什么逻辑？"

❌ 太温和："当年的情况和现在能一样吗？"
✅ 够尖锐："你当年用粮票买东西，难道我现在也该拿粮票去超市？醒醒，时代变了"

❌ 太温和："吃盐多不代表在这件事上就一定对"
✅ 够尖锐："吃盐多就能替我做决定？那厨师吃的盐最多，是不是该让厨师管理国家？"

记住：
- 逻辑图要清晰展示论证结构
- 批判要犀利、直接、一针见血
- 类比要极端化、荒谬化，让对方无话可说
- 多用反问、质疑、揭露荒谬
- 像一个很会吵架、逻辑又强的朋友在帮你反击`;

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = analyzeRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const errorResponse: ErrorResponse = {
        error: 'VALIDATION_ERROR',
        message: '输入验证失败：' + validationResult.error.errors.map(e => e.message).join(', '),
        code: 'INVALID_INPUT'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { input } = validationResult.data;

    // Check if OpenAI API key is configured
    if (!OPENAI_API_KEY) {
      const errorResponse: ErrorResponse = {
        error: 'CONFIGURATION_ERROR',
        message: 'OpenAI API key 未配置',
        code: 'MISSING_API_KEY'
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    console.log('[API] Using key (first 20 chars):', OPENAI_API_KEY.substring(0, 20));
    console.log('[API] Calling:', OPENAI_API_URL);

    const exampleJSON = `{
  "sentenceType": "诉诸权威",
  "onePunch": "吃的盐多就能替我做决定？那医生吃的药多，是不是也该替你活着？资历不等于正确，正确也不等于我必须服从",
  "logicGraph": {
    "nodes": [
      {"id": "node_1", "type": "claim", "label": "主张", "content": "我吃的盐比你吃的饭还多"},
      {"id": "node_2", "type": "rule", "label": "规则", "content": "经验多→判断更准确"},
      {"id": "node_3", "type": "assumption", "label": "假设", "content": "过去经验适用于当前情境"},
      {"id": "node_4", "type": "norm", "label": "规范", "content": "判断准确→应该服从"},
      {"id": "node_5", "type": "conclusion", "label": "结论", "content": "听我的准没错"}
    ],
    "edges": [
      {"id": "edge_1", "source": "node_1", "target": "node_2", "label": "❶ 拿资历说事", "primaryLabel": "用经验压人", "badge": "❶", "badgeColor": "red"},
      {"id": "edge_2", "source": "node_2", "target": "node_4", "label": "❷ 对了就得听？", "primaryLabel": "偷换成义务", "badge": "❷", "badgeColor": "blue"},
      {"id": "edge_3", "source": "node_3", "target": "node_2", "label": "❸ 时代变了", "primaryLabel": "情境不一样", "badge": "❸", "badgeColor": "purple"},
      {"id": "edge_4", "source": "node_4", "target": "node_5", "label": "❹ 必须听话", "primaryLabel": "强制服从", "badge": "❹", "badgeColor": "orange"}
    ]
  },
  "criticisms": [
    {
      "edgeId": "edge_1",
      "edgeLabel": "❶ 拿资历说事",
      "attacks": [
        "吃盐多就能替我做决定？那厨师吃的盐最多，是不是该让厨师管理国家？",
        "你吃过的盐和这件事有半毛钱关系吗？别拿无关的东西来压我",
        "经验≠正确。历史上多少'有经验'的人做出过错误决定？"
      ],
      "evidenceRequests": [
        "你在这个具体问题上，成功率是多少？能拿数据说话吗？",
        "你上次用这套逻辑做决定，结果怎么样？敢不敢说实话？"
      ],
      "analogies": [
        "我游泳游得好，所以开车也要听我的——这两个有关系吗？别搞笑了",
        "算命先生见的人多，所以你的人生规划要听算命的——荒不荒谬？"
      ]
    },
    {
      "edgeId": "edge_2",
      "edgeLabel": "❷ 对了就得听？",
      "attacks": [
        "你说的对我就得听？那我说1+1=2，你是不是也该把银行卡密码告诉我？",
        "正确≠服从。牛顿定律也正确，难道我得跪下来拜牛顿？",
        "我又不是你的傀儡，凭什么放弃自己的判断去当复读机？"
      ],
      "evidenceRequests": [
        "哪条法律规定，说对了别人就必须听？拿出来看看？",
        "我不听你的，除了你不爽，还有什么实际后果？说得清吗？"
      ],
      "analogies": [
        "天气预报说明天下雨，所以我今天就得听气象局的安排在家待着——这是什么逻辑？",
        "数学老师算得准，所以我的恋爱对象也要听数学老师的——荒谬到家了"
      ]
    },
    {
      "edgeId": "edge_3",
      "edgeLabel": "❸ 时代变了",
      "attacks": [
        "你当年用粮票买东西，难道我现在也该拿粮票去超市？醒醒，时代变了",
        "你那套经验是上个世纪的，现在还拿出来用？保质期过了吧",
        "当年和现在完全是两个世界，你的经验放现在就是笑话"
      ],
      "evidenceRequests": [
        "你能证明当年的环境和现在有可比性吗？列出来看看？",
        "现在变化了哪些东西，你研究过吗？还是根本不了解？"
      ],
      "analogies": [
        "你当年骑自行车上班，所以我现在也不该开车——这合理吗？",
        "古人用算盘算账，所以我们现在也别用计算器——要不要回到古代？"
      ]
    },
    {
      "edgeId": "edge_4",
      "edgeLabel": "❹ 必须听话",
      "attacks": [
        "凭什么我必须服从？我是你的遥控器吗？一按就得照做？",
        "你这是要我放弃大脑，当个没思想的木偶，对吧？",
        "就算你说得有理，也不代表我是你的奴隶，必须执行命令"
      ],
      "evidenceRequests": [
        "法律哪条规定我必须听你的？能指出来吗？",
        "我不听你的，会坐牢吗？会被开除吗？说点实在的后果？"
      ],
      "analogies": [
        "导航说往东走，所以我必须往东，不能有自己的路线选择——我是机器人？",
        "营养师说要吃西兰花，所以我必须吃，不能有自己的口味——这是监狱吗？"
      ]
    }
  ]
}`;

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT + '\n\n输出格式示例：\n' + exampleJSON
        },
        {
          role: 'user',
          content: `请深入分析这句话的逻辑问题：\n\n"${input}"\n\n要求：\n1. 构建完整的逻辑链条（至少4-5个节点，包含主张、假设、规则、规范、结论）\n2. 识别多个逻辑谬误（3-4条边）\n3. 每种批判类型提供2-3个具体的论点\n4. 类比要生动、有说服力\n5. 严格按照上面的JSON格式输出`
        }
      ],
      response_format: {
        type: 'json_object'
      },
      temperature: 0.7,
      max_tokens: 3000
    };

    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      console.error('[API] OpenAI error:', error);
      const errorResponse: ErrorResponse = {
        error: 'OPENAI_API_ERROR',
        message: `OpenAI API 错误: ${error.error?.message || '未知错误'}`,
        code: error.error?.code
      };
      return NextResponse.json(errorResponse, { status: openaiResponse.status });
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices[0]?.message?.content;

    if (!content) {
      const errorResponse: ErrorResponse = {
        error: 'EMPTY_RESPONSE',
        message: 'OpenAI 返回空响应',
        code: 'NO_CONTENT'
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Parse and validate the response from OpenAI
    const analysisData = JSON.parse(content);
    console.log('[API] AI returned data:', JSON.stringify(analysisData).substring(0, 500));

    const responseValidation = analyzeResponseSchema.safeParse(analysisData);

    if (!responseValidation.success) {
      console.error('OpenAI response validation failed:', responseValidation.error);
      console.error('Raw AI data:', JSON.stringify(analysisData));
      const errorResponse: ErrorResponse = {
        error: 'RESPONSE_VALIDATION_ERROR',
        message: 'AI 返回的数据格式不正确',
        code: 'INVALID_RESPONSE'
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const response: AnalyzeResponse = responseValidation.data;
    return NextResponse.json(response);

  } catch (error) {
    console.error('API route error:', error);
    const errorResponse: ErrorResponse = {
      error: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : '服务器内部错误',
      code: 'INTERNAL_SERVER_ERROR'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
