# react-vscode-template-mcp

零依赖的 MCP（Model Context Protocol）stdio 服务器，将本仓库的 AI-Native 能力暴露为 MCP 工具，供 Cursor / Claude Code / 其他兼容 MCP 客户端调用。

> 属于 react-vscode-template 2.0 路线 P5，是整条路线（P0 Rules → P1 Skills → P2 Architecture → P3 CLI → P4 ai:test → P5 MCP）的收尾。

## 工具清单

| 工具 | 类型 | 说明 |
| --- | --- | --- |
| `create_page` | 指引型 | 读取 `.agents/skills/create-page/SKILL.md`，返回模板目录绝对路径；AI Agent 依据指引生成页面，**不落盘业务代码** |
| `create_crud` | 指引型 | 读取 `.agents/skills/create-crud/SKILL.md`，返回模板目录绝对路径；AI Agent 依据指引生成 CRUD 模块，**不落盘业务代码** |
| `get_architecture` | 只读 | 返回 `.ai/architecture.yaml` 的机器可读架构声明 |
| `get_project_structure` | 只读 | 返回 `src` 目录树（跳过 `node_modules` / `dist` / `coverage` 等） |
| `run_lint` | 执行 | 项目根执行 `yarn eslint`（即 script `eslint src`；执行异常时回退 `npx eslint src`），返回 stdout/stderr 与退出码 |
| `run_test` | 执行 | 项目根执行 `yarn test`（失败回退 `npx vitest run`），返回 stdout/stderr 与退出码 |

定位原则：

- `create_page` / `create_crud` 为**指引型**工具：只返回 SKILL.md 摘要 + templates 绝对路径，由 AI Agent 负责实际落盘，MCP 本身**不向 `src/` 写任何业务代码**。
- `run_test` / `run_lint` 只执行既有命令，无破坏性操作。
- 服务器零外部依赖，无网络请求，仅读写项目内白名单路径。

## 配置（stdio 连接）

统一命令：`node .mcp/server.mjs`（在仓库根目录下执行）。

### Cursor

在 `.cursor/mcp.json` 中加入：

```json
{
  "mcpServers": {
    "react-vscode-template": {
      "command": "node",
      "args": [".mcp/server.mjs"],
      "env": {}
    }
  }
}
```

### Claude Code

在 `~/.claude.json`（或项目 `.mcp.json`）中加入：

```json
{
  "mcpServers": {
    "react-vscode-template": {
      "command": "node",
      "args": [".mcp/server.mjs"]
    }
  }
}
```

### 通用 MCP 客户端

任意支持 stdio transport 的 MCP 客户端，配置：

- command: `node`
- args: `[".mcp/server.mjs"]`
- cwd: 仓库根（`/Users/zhangjing/projects/react-vscode-template`）

## 协议

- 传输：LSP 风格 `Content-Length` 帧 + JSON-RPC 2.0，走 stdio。
- 握手：`initialize` → `notifications/initialized` → `tools/list` → `tools/call`。
- 日志输出到 `stderr`，不污染 stdout 协议通道。

## 开发

```bash
# 真实验证（管道发帧，逐个调用 6 个工具）
node scripts/../temp/mcp-test.mjs   # 或自行构造帧
```
