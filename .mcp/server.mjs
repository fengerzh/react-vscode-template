#!/usr/bin/env node
/**
 * react-vscode-template-mcp — MCP stdio server (零外部依赖)
 *
 * 将仓库的 AI-Native 能力暴露为 MCP 工具：
 *   - get_project_structure  返回 src 目录树
 *   - get_architecture       返回 .ai/architecture.yaml
 *   - create_page            返回 create-page 技能指引 + templates 绝对路径（指引型，不落盘）
 *   - create_crud            返回 create-crud 技能指引 + templates 绝对路径（指引型，不落盘）
 *   - run_test               在项目根执行 yarn test（或 npx vitest run）
 *   - run_lint               在项目根执行 yarn eslint（或 npx eslint src）
 *
 * 传输层：MCP stdio —— LSP 风格 Content-Length 帧 + JSON-RPC 2.0。
 * 所有协议输出走 stdout，日志走 stderr。
 *
 * 配置：node .mcp/server.mjs
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { once } from "node:events";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 默认项目根 = .mcp 的父目录（仓库根）；tools/call 可用 root 参数覆盖
const DEFAULT_ROOT = path.resolve(__dirname, "..");

const SERVER_INFO = {
  name: "react-vscode-template-mcp",
  version: "0.1.0",
};

// 允许的 tools/call 参数白名单（安全边界：只读 + 执行既有命令）
const TOOLS = [
  {
    name: "get_project_structure",
    description: "返回项目 src 目录树（递归列出关键文件/目录，跳过 node_modules/dist/coverage 等）。",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "项目根目录，默认服务器所在仓库根" },
      },
    },
  },
  {
    name: "get_architecture",
    description: "读取并返回 .ai/architecture.yaml 的机器可读架构声明内容。",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "项目根目录，默认服务器所在仓库根" },
      },
    },
  },
  {
    name: "create_page",
    description: "指引型工具：读取 .agents/skills/create-page/SKILL.md 并返回模板目录绝对路径，供 AI Agent 遵循生成页面；不在项目内落盘业务代码。",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "string", description: "目标页面名（仅作指引上下文，不影响输出）" },
        root: { type: "string", description: "项目根目录，默认服务器所在仓库根" },
      },
    },
  },
  {
    name: "create_crud",
    description: "指引型工具：读取 .agents/skills/create-crud/SKILL.md 并返回模板目录绝对路径，供 AI Agent 遵循生成 CRUD 模块；不在项目内落盘业务代码。",
    inputSchema: {
      type: "object",
      properties: {
        crud: { type: "string", description: "目标模块名（仅作指引上下文，不影响输出）" },
        root: { type: "string", description: "项目根目录，默认服务器所在仓库根" },
      },
    },
  },
  {
    name: "run_test",
    description: "在项目根执行 yarn test（失败回退 npx vitest run），返回 stdout/stderr 与退出码。",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "项目根目录，默认服务器所在仓库根" },
      },
    },
  },
  {
    name: "run_lint",
    description: "在项目根执行 yarn eslint（即 script `eslint src`；执行异常时回退 npx eslint src），返回 stdout/stderr 与退出码。",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "项目根目录，默认服务器所在仓库根" },
      },
    },
  },
];

// ---------------------------------------------------------------- 传输层
let buffer = Buffer.alloc(0);

function send(obj) {
  const body = JSON.stringify(obj);
  const header = `Content-Length: ${Buffer.byteLength(body, "utf8")}\r\n\r\n`;
  process.stdout.write(header + body);
}

function log(...args) {
  process.stderr.write(`[mcp] ${args.join(" ")}\n`);
}

// ---------------------------------------------------------------- 工具实现
const SKIP_DIRS = new Set([
  "node_modules", "dist", "dist-ssr", "coverage", ".nyc_output",
  ".git", ".yarn", "reports", ".DS_Store",
]);

function walkLines(dir, prefix = "") {
  const lines = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => !SKIP_DIRS.has(e.name))
    .sort((a, b) => (b.isDirectory() ? 1 : 0) - (a.isDirectory() ? 1 : 0)
      || a.name.localeCompare(b.name));
  entries.forEach((entry, i) => {
    const last = i === entries.length - 1;
    const branch = last ? "└── " : "├── ";
    lines.push(`${prefix}${branch}${entry.isDirectory() ? entry.name + "/" : entry.name}`);
    if (entry.isDirectory()) {
      lines.push(...walkLines(path.join(dir, entry.name), prefix + (last ? "    " : "│   ")));
    }
  });
  return lines;
}

function getProjectStructure(root) {
  if (!fs.existsSync(root)) {
    throw new Error(`root 不存在: ${root}`);
  }
  const lines = [`${path.basename(root)}/`, ...walkLines(root)];
  return lines.join("\n");
}

function getArchitecture(root) {
  const file = path.join(root, ".ai", "architecture.yaml");
  if (!fs.existsSync(file)) {
    throw new Error(`未找到架构声明: ${file}`);
  }
  return fs.readFileSync(file, "utf8");
}

// 读取技能指引（摘要 + 模板路径）
const MAX_SKILL_LEN = 20000;
function readSkill(root, skillName, subject) {
  const skillDir = path.join(root, ".agents", "skills", skillName);
  const skillDoc = path.join(skillDir, "SKILL.md");
  const templatesDir = path.join(skillDir, "templates");
  if (!fs.existsSync(skillDoc)) {
    throw new Error(`未找到技能文档: ${skillDoc}`);
  }
  const skill = fs.readFileSync(skillDoc, "utf8");
  const truncated = skill.length > MAX_SKILL_LEN;
  const body = truncated ? `${skill.slice(0, MAX_SKILL_LEN)}\n\n[INFO] SKILL.md 过长已截断（共 ${skill.length} 字符）。` : skill;
  return [
    `[${skillName}] 指引（subject: ${subject || "-"}）`,
    `SKILL.md: ${skillDoc}`,
    (fs.existsSync(templatesDir) ? `templates: ${templatesDir}` : "templates: (无)"),
    "---- 以下是 SKILL.md 内容（AI Agent 应遵循；本工具为指引型，不会向 src 写业务代码） ----",
    body,
  ].join("\n");
}

// 保留输出头部 headLen + 尾部 tailLen，中部折叠，避免超长命令输出淹没协议响应
function clip(text, headLen, tailLen) {
  if (text.length <= headLen + tailLen + 40) return text;
  return `${text.slice(0, headLen)}\n\n...[省略 ${text.length - headLen - tailLen} 字符]...\n\n${text.slice(-tailLen)}`;
}

function runCommand(root, baseCmd, args, fallbackBase, fallbackArgs) {
  return new Promise(async (resolve) => {
    let stdout = "";
    let stderr = "";
    const tryExec = (cmd, cmdArgs) => new Promise((res) => {
      const child = spawn(cmd, cmdArgs, {
        cwd: root,
        shell: process.platform === "win32",
        env: { ...process.env },
      });
      const timer = setTimeout(() => {
        child.kill("SIGKILL");
        res({ timedOut: true });
      }, 180000);
      child.stdout.on("data", (d) => { stdout += d.toString(); });
      child.stderr.on("data", (d) => { stderr += d.toString(); });
      child.on("error", (err) => {
        clearTimeout(timer);
        res({ error: err.message });
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        res({ code });
      });
    });

    const first = await tryExec(baseCmd, args);
    let final = first;
    // yarn 不可用或脚本执行异常（launch error / 127 无有效输出）时回退 npx
    if ((first.error || first.code === 127) && fallbackBase) {
      stdout = "";
      stderr = "";
      const fb = await tryExec(fallbackBase, fallbackArgs);
      final = { ...fb, fallbackUsed: true };
    }
    resolve({ ...final, cmd: first.error || first.code === 127 ? `${fallbackBase} ${fallbackArgs.join(" ")}` : `${baseCmd} ${args.join(" ")}`, stdout, stderr });
  });
}

// ---------------------------------------------------------------- JSON-RPC 分发
async function handleRequest(req) {
  const { id, method, params = {} } = req;

  if (method === "initialize") {
    return send({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: params.protocolVersion || "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      },
    });
  }

  if (method === "tools/list") {
    return send({
      jsonrpc: "2.0",
      id,
      result: { tools: TOOLS },
    });
  }

  if (method === "tools/call") {
    const { name, arguments: callArgs = {} } = params;
    const root = path.resolve(callArgs.root || DEFAULT_ROOT);
    let result;
    let isError = false;
    try {
      switch (name) {
        case "get_project_structure":
          result = getProjectStructure(root);
          break;
        case "get_architecture":
          result = getArchitecture(root);
          break;
        case "create_page":
          result = readSkill(root, "create-page", callArgs.page);
          break;
        case "create_crud":
          result = readSkill(root, "create-crud", callArgs.crud);
          break;
        case "run_test": {
          const r = await runCommand(root, "yarn", ["test"], "npx", ["vitest", "run"]);
          result = `cmd: ${r.cmd} (cwd: ${root})${r.fallbackUsed ? " [首命令异常，已回退 npx]" : ""}\n`
            + `exit code: ${r.code ?? -1}${r.timedOut ? " [TIMEOUT 180s]" : ""}${r.error ? ` [launch error: ${r.error}]` : ""}\n`
            + `---- stdout ----\n${clip(r.stdout, 3000, 2000)}`
            + `\n---- stderr ----\n${clip(r.stderr, 1200, 800)}`;
          break;
        }
        case "run_lint": {
          const r = await runCommand(root, "yarn", ["eslint"], "npx", ["eslint", "src"]);
          result = `cmd: ${r.cmd} (cwd: ${root})${r.fallbackUsed ? " [首命令异常，已回退 npx]" : ""}\n`
            + `exit code: ${r.code ?? -1}${r.timedOut ? " [TIMEOUT 180s]" : ""}${r.error ? ` [launch error: ${r.error}]` : ""}\n`
            + `---- stdout ----\n${clip(r.stdout, 3000, 2000)}`
            + `\n---- stderr ----\n${clip(r.stderr, 1200, 800)}`;
          break;
        }
        default:
          return send({
            jsonrpc: "2.0",
            id,
            error: { code: -32601, message: `未知工具: ${name}` },
          });
      }
    } catch (err) {
      isError = true;
      result = `[error] ${err.message}`;
    }
    return send({
      jsonrpc: "2.0",
      id,
      result: {
        content: [{ type: "text", text: String(result) }],
        isError,
      },
    });
  }

  return send({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `未知方法: ${method}` },
  });
}

function handleMessage(raw) {
  let msg;
  try {
    msg = JSON.parse(raw);
  } catch (err) {
    log("bad JSON frame");
    return;
  }
  const { id, method } = msg;
  if (method && typeof id === "number") {
    handleRequest(msg).catch((err) => {
      log(`request error: ${err.message}`);
      send({
        jsonrpc: "2.0",
        id,
        error: { code: -32603, message: `internal error: ${err.message}` },
      });
    });
  } else {
    // notification（initialized 等）无需响应
    log(`notification: ${method}`);
  }
}

process.stdin.on("data", (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  for (;;) {
    const headerEnd = buffer.indexOf("\r\n\r\n");
    if (headerEnd === -1) break;
    const header = buffer.slice(0, headerEnd).toString("utf8");
    const m = /Content-Length:\s*(\d+)/i.exec(header);
    if (!m) {
      buffer = buffer.slice(headerEnd + 4);
      continue;
    }
    const len = Number(m[1]);
    const bodyStart = headerEnd + 4;
    if (buffer.length < bodyStart + len) break;
    const body = buffer.slice(bodyStart, bodyStart + len).toString("utf8");
    buffer = buffer.slice(bodyStart + len);
    handleMessage(body);
  }
});

process.stdin.on("end", () => {
  process.exit(0);
});

log(`server ready (root=${DEFAULT_ROOT})`);
