#!/usr/bin/env node
/**
 * create-ai-react — CLI 脚手架
 *
 * 以本仓库（react-vscode-template）为模板源，交互式选择特性后，
 * 将项目骨架复制到目标目录，并按选择做依赖/目录精简。
 *
 * 使用：
 *   node packages/create-ai-react/src/index.mjs <targetDir>
 *   （或安装为 bin 后：create-ai-react <targetDir>）
 *
 * 环境变量：
 *   CREATE_AI_REACT_TEMPLATE  覆盖模板源路径（默认 = 仓库根目录）
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// CLI 位于 packages/create-ai-react/src/，默认模板源 = 仓库根（../../..）
const TEMPLATE_ROOT = process.env.CREATE_AI_REACT_TEMPLATE
  || path.resolve(__dirname, "../../..");

// ---------------------------------------------------------------- 选项定义
const OPTIONS = [
  {
    key: "typescript",
    label: "TypeScript",
    default: true,
    note: "模板以 TypeScript 编写，MVP 不提供 JS 剥离，保持 TS 结构",
    removable: false,
  },
  {
    key: "antd",
    label: "Ant Design",
    default: true,
    note: "模板页面基于 Ant Design 编写，MVP 不提供剥离，保持 antd",
    removable: false,
  },
  {
    key: "zustand",
    label: "Zustand",
    default: true,
    note: "移除 zustand 依赖与 src/store 目录（页面中残留引用需自行迁移）",
    removable: true,
  },
  {
    key: "tailwind",
    label: "Tailwind",
    default: true,
    note: "模板未内置 Tailwind 配置，选中仅提示，需自行安装",
    removable: false,
  },
  {
    key: "testing",
    label: "Testing",
    default: true,
    note: "移除 cypress/ 与 e2e / ai:test 脚本及相关依赖",
    removable: true,
  },
  {
    key: "aiRules",
    label: "AI Rules",
    default: true,
    note: "保留 .agents/rules/ 与 .ai/architecture.yaml（以及 AGENTS.md）",
    removable: true,
  },
  {
    key: "aiSkills",
    label: "AI Skills",
    default: true,
    note: "保留 .agents/skills/ 下的可复用技能",
    removable: true,
  },
];

// 始终排除的目录/文件（按 basename 判断）
const ALWAYS_EXCLUDE = new Set([
  "node_modules",
  "dist",
  "dist-ssr",
  "coverage",
  ".nyc_output",
  ".git",
  "reports",
  ".DS_Store",
  ".env",
  "packages",        // CLI 自身
  ".circleci",
  ".github",
  ".claude",
  ".qoder",
  ".codegraph",
  "Library",         // 误入仓库的会话数据目录
  ".yarn",           // Yarn4 本地发行物，由目标项目自行初始化
  "renovate.json",
  ".nycrc",
]);

const COLOR = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function paint(color, text) {
  // 非 TTY 时去掉颜色，便于日志/管道
  if (!process.stdout.isTTY) return text;
  return `${COLOR[color]}${text}${COLOR.reset}`;
}

// ---------------------------------------------------------------- 输入抽象
// TTY：readline 逐项交互；非 TTY（管道/重定向）：EOF 一次性读全量行喂给选项
let interactive = null; // readline interface 或 null
let pipedLines = null;   // 非 TTY 预读行

async function ask(promptText) {
  if (process.stdout.isTTY && process.stdin.isTTY) {
    if (!interactive) {
      interactive = readline.createInterface({ input: process.stdin, output: process.stdout });
    }
    return (await interactive.question(promptText)).trim().toLowerCase();
  }
  process.stdout.write(promptText);
  const line = pipedLines && pipedLines.length ? pipedLines.shift() : "";
  return line.trim().toLowerCase();
}

function closeInput() {
  if (interactive) {
    interactive.close();
    interactive = null;
  }
}

// ---------------------------------------------------------------- 小工具
function sanitizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9@-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    || "my-app";
}

function rmIfExists(p) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    return true;
  }
  return false;
}

// 逐项确认式询问：空回车 = 默认（保留）
async function confirmOption(opt) {
  const mark = opt.default ? "✔" : "✘";
  const promptText = `  ${paint("cyan", mark)} 保留 ${opt.label} ?` +
    paint("dim", "  (回车=是 / n=否) ") + `[${opt.default ? "是" : "否"}]`;
  const answer = await ask(`${promptText}\n`);
  if (answer === "n" || answer === "no" || answer === "x" || answer === "✘") {
    return false;
  }
  return true;
}

// 递归打印目录树（跳过 node_modules 等）
function printTree(root, prefix = "") {
  let entries = fs.readdirSync(root, { withFileTypes: true })
    .sort((a, b) => {
      const aDir = a.isDirectory() ? 0 : 1;
      const bDir = b.isDirectory() ? 0 : 1;
      return aDir - bDir || a.name.localeCompare(b.name);
    })
    .filter((e) => !ALWAYS_EXCLUDE.has(e.name));
  entries.forEach((entry, i) => {
    const isLast = i === entries.length - 1;
    const branch = isLast ? "└── " : "├── ";
    console.log(`${prefix}${branch}${entry.name}`);
    if (entry.isDirectory()) {
      printTree(path.join(root, entry.name), prefix + (isLast ? "    " : "│   "));
    }
  });
}

// ---------------------------------------------------------------- 主流程
async function main() {
  // 非 TTY：预读全部输入行（含空行），供逐项确认消费
  if (!process.stdin.isTTY) {
    const raw = fs.readFileSync(0, "utf8");
    pipedLines = raw.split(/\r?\n/);
    if (pipedLines[pipedLines.length - 1] === "") pipedLines.pop();
  }

  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  let targetDir = args[0] || null;

  // 1. 目标目录
  if (!targetDir) {
    targetDir = (await ask(paint("dim", "  项目名称 (默认: my-app): "))) || "my-app";
  }

  if (!TEMPLATE_ROOT || !fs.existsSync(TEMPLATE_ROOT)) {
    console.error(paint("red", `[error] 模板源不存在: ${TEMPLATE_ROOT}`));
    process.exit(1);
  }

  if (fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir);
    if (files.length > 0) {
      const answer = await ask(
        paint("yellow", `  [warn] 目录已存在且非空 (${files.length} 项): ${targetDir}\n  继续写入会覆盖同名文件，确认? (y/N) `),
      );
      if (answer !== "y" && answer !== "yes") {
        console.log(paint("yellow", "  已取消。"));
        process.exit(0);
      }
    }
  }

  // 2. 交互式选项确认
  console.log(`\n${paint("cyan", "create-ai-react")} — 将以仓库为模板生成项目:`);
  console.log(`  模板源: ${paint("dim", TEMPLATE_ROOT)}`);
  console.log(`  目标目录: ${paint("green", targetDir)}\n`);
  const selected = {};
  for (const opt of OPTIONS) {
    selected[opt.key] = await confirmOption(opt);
  }
  closeInput();

  console.log(paint("dim", "\n  已选择:"), Object.entries(selected)
    .map(([k, v]) => `${v ? "✔" : "✘"}${OPTIONS.find((o) => o.key === k).label}`)
    .join("  "));

  // 非 remove 选项被取消时给出提示（MVP 不做代码剥离）
  for (const opt of OPTIONS) {
    if (selected[opt.key] === false && !opt.removable) {
      console.log(paint("yellow", `  [warn] ${opt.label}: ${opt.note}`));
    }
  }

  const targetAbs = path.resolve(targetDir);
  fs.mkdirSync(targetAbs, { recursive: true });

  // 3. 复制模板（基于 basename 过滤）
  console.log(paint("dim", "\n  复制模板中..."));
  fs.cpSync(TEMPLATE_ROOT, targetAbs, {
    recursive: true,
    filter: (src) => !ALWAYS_EXCLUDE.has(path.basename(src)),
  });
  const rootChildren = fs.readdirSync(targetAbs)
    .filter((e) => !ALWAYS_EXCLUDE.has(e))
    .sort();
  for (const name of rootChildren) {
    console.log(`    ${paint("green", "✓")} ${name}`);
  }

  // 4. 依选项后处理
  const changed = [];
  const removeRel = (rel) => {
    const p = path.join(targetAbs, rel);
    if (rmIfExists(p)) changed.push(rel);
  };

  console.log(paint("dim", "\n  按选择精简..."));

  // 4a. Testing = off → 移除 cypress 与 e2e/ai:test 脚本
  if (!selected.testing) {
    removeRel("cypress");
    removeRel("cypress.config.ts");
    removeRel("scripts/ai-test.mjs");
    removeRel("src/layout/UserLayout.cy.tsx");
    // eslint.config.mjs 移除 cypress 插件引用，避免缺依赖报错
    const eslintPath = path.join(targetAbs, "eslint.config.mjs");
    if (fs.existsSync(eslintPath)) {
      let content = fs.readFileSync(eslintPath, "utf8");
      const before = content;
      content = content
        .replace(/import pluginCypress from 'eslint-plugin-cypress';\n/g, "")
        .replace(/  pluginCypress\.configs\.recommended,\n/g, "")
        .replace(/      cypress: pluginCypress,\n/g, "")
        .replace(/from 'eslint-plugin-cypress';\n?/g, "");
      if (content !== before) {
        fs.writeFileSync(eslintPath, content);
        changed.push("eslint.config.mjs (移除 cypress 插件引用)");
      }
    }
  }

  // 4b. AI Rules / AI Skills
  if (!selected.aiRules && !selected.aiSkills) {
    removeRel(".agents");
    removeRel(".ai");
  } else {
    if (!selected.aiRules) {
      removeRel(".agents/rules");
      removeRel(".agents/AGENTS.md");
      removeRel(".ai");
    }
    if (!selected.aiSkills) {
      removeRel(".agents/skills");
    }
  }

  // 4c. Zustand = off → 移除依赖与 store
  if (!selected.zustand) {
    removeRel("src/store");
    removeRel("src/__tests__/store.test.tsx");
  }

  // 5. package.json 精简
  const pkgPath = path.join(targetAbs, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.name = sanitizeName(path.basename(targetAbs));
  pkg.version = pkg.version || "1.0.0";

  const scripts = { ...pkg.scripts };
  const alwaysKeep = new Set(["start", "eslint", "test", "build", "serve", "postinstall"]);
  for (const key of Object.keys(scripts)) {
    if (alwaysKeep.has(key)) continue;
    if (key === "e2e" || key === "e2e:run" || key === "ai:test") {
      if (!selected.testing) delete scripts[key];
    } else {
      delete scripts[key];
    }
  }
  pkg.scripts = scripts;

  if (!selected.testing) {
    const dev = { ...pkg.devDependencies };
    delete dev.cypress;
    delete dev["eslint-plugin-cypress"];
    pkg.devDependencies = dev;
  }
  if (!selected.zustand) {
    const deps = { ...pkg.dependencies };
    delete deps.zustand;
    pkg.dependencies = deps;
  }

  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  changed.push("package.json (name/scripts/deps 精简)");

  if (changed.length) {
    changed.forEach((c) => console.log(`    ${paint("yellow", "~")} ${c}`));
  }

  // 6. 打印最终结构树
  console.log(paint("dim", `\n  生成结构 (${targetAbs}):`));
  printTree(targetAbs);

  // 7. 收尾提示
  console.log(paint("green", "\n  ✅ 项目已生成。"));
  console.log(`  下一步:`);
  console.log(`    cd ${targetAbs}`);
  console.log(`    yarn install`);
  console.log(`    yarn start`);
  if (selected.testing) {
    console.log(`    yarn test   # 单测 (Vitest)`);
    console.log(`    yarn e2e    # E2E (Cypress)`);
  }
  for (const opt of OPTIONS) {
    if (selected[opt.key] && opt.note && !opt.removable) {
      console.log(paint("dim", `  [info] ${opt.label}: ${opt.note}`));
    }
  }
  if (!selected.tailwind) {
    console.log(paint("yellow", "  [info] Tailwind: 模板未内置 Tailwind 配置，需要时请自行安装。"));
  }
  console.log();
}

main().catch((err) => {
  console.error(paint("red", `[error] ${err && err.stack ? err.stack : err}`));
  process.exit(1);
});
