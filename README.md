# NoOffense 无意冒犯 | 东亚家长话语逻辑分析器

一个帮助青少年和大学生分析东亚父母典型话语中逻辑问题的工具。

## 🎯 功能特点

- **逻辑图可视化**：将父母的话拆解成节点和边，清晰展示论证结构
- **三维批判**：
  - ❌ **攻击点**：指出逻辑漏洞
  - 📎 **要证据**：要求可验证的证据
  - 🪞 **同构类比**：用荒谬的类比揭露问题
- **One-Punch 反驳**：一句话直击核心漏洞
- **复制功能**：一键复制反驳内容

## 🚀 在线体验

**生产环境：** https://nooffense-landing-hbbytfmee-yaoqiyang534-gmailcoms-projects.vercel.app

## 🛠️ 技术栈

- **框架**：Next.js 14.2.5 + React 18
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **组件**：shadcn/ui
- **验证**：Zod
- **AI**：OpenAI API (gpt-4o-mini)
- **部署**：Vercel

## 📦 本地开发

```bash
# 克隆仓库
git clone https://github.com/meYQY/nooffense-landing.git
cd nooffense-landing

# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local，添加 OPENAI_API_KEY

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 🎨 示例输入

- "我吃的盐比你吃的饭还多"
- "你看看别人家的孩子"
- "我这都是为了你好"
- "不听老人言，吃亏在眼前"

## 📝 支持的句型

1. 诉诸权威
2. 排名门槛
3. 道德重定义
4. 替代性论证
5. 虚假困境
6. 绑架性论证
7. 人身攻击
8. 稻草人谬误
9. 虚假因果
10. 滑坡论证

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 💡 致谢

本项目旨在提供逻辑分析训练，不鼓励家庭对立。仅供学习和思考使用。
