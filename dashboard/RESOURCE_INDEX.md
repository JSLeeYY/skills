# 🧭 AI 资源导航索引

> 最后更新：2026-03-04 | 使用 `/update-skills` 可同步所有仓库最新内容

---

## 📑 目录

- [Anthropic Skills（16个）](#-anthropic-skills)
  - [📄 文档处理类](#-文档处理类)
  - [🎨 设计创意类](#-设计创意类)
  - [🛠️ 开发工具类](#️-开发工具类)
  - [📝 内容创作类](#-内容创作类)
- [AI 生态仓库（7个）](#-ai-生态仓库)
  - [🔌 MCP 工具生态](#-mcp-工具生态)
  - [📚 AI Agent 大全](#-ai-agent-大全)
  - [🧩 工具集成平台](#-工具集成平台)

---

## 🎯 Anthropic Skills

### 📄 文档处理类

| Skill | 说明 | 适用场景 | 关键技术 |
|-------|------|---------|---------|
| **docx** | Word 文档创建与编辑 | 创建/修改 .docx 文件、追踪修改、添加评论 | docx-js (Node.js)、pandoc、OOXML |
| **pdf** | PDF 文档处理 | 读取/合并/拆分/创建 PDF、提取表格和文本 | pypdf、pdfplumber、reportlab、qpdf |
| **pptx** | PowerPoint 演示文稿 | 创建/编辑 PPT、设计幻灯片 | pptxgenjs、python-pptx、OOXML |
| **xlsx** | Excel 表格处理 | 数据分析、财务建模、创建/编辑表格 | openpyxl、pandas |

### 🎨 设计创意类

| Skill | 说明 | 适用场景 | 关键技术 |
|-------|------|---------|---------|
| **algorithmic-art** | 算法生成艺术 | 创建 p5.js 生成式艺术作品、交互式可视化 | p5.js、Canvas |
| **canvas-design** | Canvas 画布设计 | 创建高品质视觉设计、海报、画册 | HTML Canvas、CSS |
| **frontend-design** | 前端界面设计 | 构建高品质 Web 界面、组件、页面 | HTML/CSS/JS、React |
| **brand-guidelines** | Anthropic 品牌指南 | 应用 Anthropic 品牌色彩和字体 | Poppins/Lora 字体、品牌色 |
| **theme-factory** | 主题工厂 | 为幻灯片/文档/网页应用专业主题 | 10 种预设主题 + 自定义 |
| **slack-gif-creator** | Slack GIF 创建 | 制作优化的 Slack 动画 GIF | PIL/Pillow、imageio |

### 🛠️ 开发工具类

| Skill | 说明 | 适用场景 | 关键技术 |
|-------|------|---------|---------|
| **mcp-builder** | MCP 服务器构建 | 从零构建 MCP 工具服务器 | TypeScript/Python SDK |
| **skill-creator** | Skill 创建工具 | 创建/打包/验证新的 Agent Skill | Python 脚本 |
| **web-artifacts-builder** | Web 作品构建器 | 构建复杂的 React 前端 artifact | React + TypeScript + Vite + shadcn/ui |
| **webapp-testing** | Web 应用测试 | 自动化测试本地 Web 应用 | Playwright (Python) |

### 📝 内容创作类

| Skill | 说明 | 适用场景 | 关键技术 |
|-------|------|---------|---------|
| **doc-coauthoring** | 文档协作编辑 | 与 AI 协作起草/优化文档 | 多阶段写作流程 |
| **internal-comms** | 内部通讯模板 | 编写各类内部通讯（周报、简报、FAQ等） | 多种通讯模板 |

---

## 🌐 AI 生态仓库

### 🔌 MCP 工具生态

| 仓库 | 说明 | 本地路径 | 主要内容 |
|------|------|---------|---------|
| **awesome-mcp-servers** | MCP Servers 大全 | `../../repos/awesome-mcp-servers` | 第三方开源 MCP 服务器索引，分类清晰（数据库、搜索、文件系统等） |
| **mcp-servers-official** | 官方 MCP 工具集 | `../../repos/mcp-servers-official` | Anthropic 官方维护（GitHub、Slack、Google Drive 等核心工具） |

### 📚 AI Agent 大全

| 仓库 | 说明 | 本地路径 | 主要内容 |
|------|------|---------|---------|
| **awesome-ai-agents-jim** | AI Agents 百科大全 | `../../repos/awesome-ai-agents-jim` | 1500+ 资源：Applications、Frameworks、LLM Models、Benchmarks、Datasets、Tools、Workflows 等 |
| **awesome-ai-agents-deep-insight** | AI Agents 精选指南 | `../../repos/awesome-ai-agents-deep-insight` | 精选实用资源：Frameworks、Observability & Tracing、Emerging Ideas |

### 🧩 工具集成平台

| 仓库 | 说明 | 本地路径 | 主要内容 |
|------|------|---------|---------|
| **composio** | AI Agent 工具集成平台 | `../../repos/composio` | 100+ 企业级 API 集成（Jira、Salesforce、Gmail 等） |
| **llama_index** | LlamaIndex 框架 | `../../repos/llama_index` | 数据接入工具 + Agent 交互工具（含原 llama_hub） |
| **langchain** | LangChain 工具集 | `../../repos/langchain` | 海量社区贡献工具（langchain-community/tools） |

---

## 🔍 快速查找指南

### 按用途查找

| 我想要... | 推荐资源 |
|-----------|---------|
| 处理 Word 文档 | → `skills/docx` |
| 处理 PDF 文件 | → `skills/pdf` |
| 处理 Excel 表格 | → `skills/xlsx` |
| 制作 PPT 演示文稿 | → `skills/pptx` + `skills/theme-factory` |
| 创建漂亮的前端页面 | → `skills/frontend-design` |
| 构建复杂 React 应用 | → `skills/web-artifacts-builder` |
| 测试 Web 应用 | → `skills/webapp-testing` |
| 创建生成式艺术 | → `skills/algorithmic-art` |
| 设计高品质视觉作品 | → `skills/canvas-design` |
| 制作 Slack 动画 GIF | → `skills/slack-gif-creator` |
| 构建 MCP 服务器 | → `skills/mcp-builder` + `repos/mcp-servers-official` |
| 寻找现成的 MCP 工具 | → `repos/awesome-mcp-servers` |
| 了解 AI Agent 框架 | → `repos/awesome-ai-agents-*` |
| 寻找企业级 API 集成 | → `repos/composio` |
| 寻找数据加载工具 | → `repos/llama_index` |
| 寻找社区工具 | → `repos/langchain` |
| 写内部通讯/周报 | → `skills/internal-comms` |
| 协作编辑文档 | → `skills/doc-coauthoring` |
| 创建新的 Skill | → `skills/skill-creator` |

---

## ⚙️ 维护

- 使用 `/update-skills` 命令同步所有仓库最新内容
- Workflow 文件位于：`.agent/workflows/update-skills.md`
