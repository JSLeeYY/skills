---
description: 从 GitHub 拉取最新的 Anthropic Skills，同步官方仓库的最新 skill 到本地
---

# 更新 Skills & AI 生态仓库 Workflow

此 workflow 用于批量更新本地所有 AI 相关仓库，包括 Anthropic Skills 和各大 AI 生态资源库。

## 仓库清单

| # | 本地目录名 | 远程仓库 | 说明 |
|---|-----------|---------|------|
| 1 | `skills` (当前工作区) | `anthropics/skills` | Anthropic 官方 Skills |
| 2 | `repos/awesome-mcp-servers` | `appcypher/awesome-mcp-servers` | MCP Servers 大全 |
| 3 | `repos/mcp-servers-official` | `modelcontextprotocol/servers` | 官方 MCP 工具集 |
| 4 | `repos/awesome-ai-agents-jim` | `jim-schwoebel/awesome_ai_agents` | AI Agents 百科大全 (1500+) |
| 5 | `repos/awesome-ai-agents-deep-insight` | `Deep-Insight-Labs/awesome-ai-agents` | AI Agents 精选指南 |
| 6 | `repos/composio` | `ComposioHQ/composio` | AI Agent 工具集成平台 |
| 7 | `repos/llama_index` | `run-llama/llama_index` | LlamaIndex (含原 llama_hub) |
| 8 | `repos/langchain` | `langchain-ai/langchain` | LangChain 工具集 |

## 步骤

### 1. 更新 Anthropic Skills (主工作区)

#### 1.1 检查当前 Git 状态
// turbo
```bash
cd "d:\DevelopmentLocation\agent skill\skills" && git status --short
```
查看本地是否有未提交的修改。

#### 1.2 暂存本地修改
如果步骤 1.1 显示有本地修改，执行以下命令暂存：
// turbo
```bash
cd "d:\DevelopmentLocation\agent skill\skills" && git stash push -m "auto-stash-before-pull" --include-untracked
```
如果没有本地修改，跳过此步骤。

#### 1.3 拉取最新代码
// turbo
```bash
cd "d:\DevelopmentLocation\agent skill\skills" && git pull origin main
```

#### 1.4 恢复本地修改
如果步骤 1.2 执行了 stash，则恢复本地修改：
// turbo
```bash
cd "d:\DevelopmentLocation\agent skill\skills" && git stash pop
```
如果有冲突，需要告知用户并协助解决。

### 2. 批量更新其他 AI 生态仓库
由于这些仓库使用浅克隆（--depth 1），使用特殊的 pull 命令来更新：

#### 2.1 更新 awesome-mcp-servers
// turbo
```bash
cd "d:\DevelopmentLocation\agent skill\repos\awesome-mcp-servers" && git pull --depth 1 origin main
```

#### 2.2 更新 mcp-servers-official
// turbo
```bash
cd "d:\DevelopmentLocation\agent skill\repos\mcp-servers-official" && git pull --depth 1 origin main
```

#### 2.3 更新 awesome-ai-agents-jim
// turbo
```bash
cd "d:\DevelopmentLocation\agent skill\repos\awesome-ai-agents-jim" && git pull --depth 1 origin main
```

#### 2.4 更新 awesome-ai-agents-deep-insight
// turbo
```bash
cd "d:\DevelopmentLocation\agent skill\repos\awesome-ai-agents-deep-insight" && git pull --depth 1 origin main
```

#### 2.5 更新 composio
// turbo
```bash
cd "d:\DevelopmentLocation\agent skill\repos\composio" && git pull --depth 1 origin main
```

#### 2.6 更新 llama_index
// turbo
```bash
cd "d:\DevelopmentLocation\agent skill\repos\llama_index" && git pull --depth 1 origin main
```

#### 2.7 更新 langchain
// turbo
```bash
cd "d:\DevelopmentLocation\agent skill\repos\langchain" && git pull --depth 1 origin master
```

### 3. 列出所有当前可用的 Skills
// turbo
```bash
cd "d:\DevelopmentLocation\agent skill\skills" && Get-ChildItem -Name -Directory skills
```
列出 `skills/` 目录下所有可用的 skill 文件夹。

### 4. 检查最近更新内容
// turbo
```bash
cd "d:\DevelopmentLocation\agent skill\skills" && git log -n 5 --oneline
```
显示 Anthropic Skills 最近 5 条提交记录。

### 5. 汇总报告
向用户汇报：
- 每个仓库的更新是否成功
- Anthropic Skills 是否有新增的 skills
- 是否有冲突需要处理
- 当前可用的 skills 列表及简要说明

### 6. 浏览新 Skill（可选）
如果有新的 skill 被拉取下来，主动读取新 skill 的 `SKILL.md` 文件，向用户介绍新 skill 的功能和用法。

### 7. 更新 Dashboard（资源导航）
更新完所有仓库后，重新生成 `dashboard/` 目录下的两个文件：
- **`dashboard/RESOURCE_INDEX.md`** — Markdown 索引文件，包含所有 skills 和仓库的分类汇总
- **`dashboard/RESOURCE_DASHBOARD.html`** — HTML 仪表板，支持搜索和分类筛选

更新方式：
1. 读取 `skills/` 目录下所有 skill 的 `SKILL.md` 的 YAML frontmatter（name 和 description）
2. 如果有新增或删除的 skill，更新两个 dashboard 文件中的对应内容
3. 更新文件中的"最后更新"时间戳
4. Dashboard 文件位于：`d:\DevelopmentLocation\agent skill\skills\dashboard\`
