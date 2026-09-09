#!/usr/bin/env node
/**
 * ai:test — 一键 AI 测试报告脚本（MVP，无外部依赖，不依赖 LLM 账号即可跑通）。
 *
 * 职责：
 *   1. 扫描 src 各业务模块，统计测试文件覆盖情况；
 *   2. 全量运行 Vitest（--reporter=json），收集通过/失败用例数；
 *   3. 生成 Markdown 报告到 reports/ai-test-report.md 并打印执行摘要；
 *   4. 可选 AI 修复扩展点：配置 AI_TEST_LLM_URL / AI_TEST_LLM_KEY 时，
 *      调用 LLM 分析失败用例并写入修复建议；未配置则跳过并注明。
 *
 * 用法：yarn ai:test
 */
import {
  readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync, statSync,
} from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');
const PAGE_ROOT = join(SRC, 'pages');
const REPORT_DIR = join(ROOT, 'reports');
const REPORT_PATH = join(REPORT_DIR, 'ai-test-report.md');

// ---------- 1. 扫描 src 测试文件 ----------
const TEST_RE = /\.(test|spec)\.[jt]sx?$/i;
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules') continue;
      walk(p, acc);
    } else if (TEST_RE.test(name)) {
      acc.push(p);
    }
  }
  return acc;
}

// 归类业务模块：src/pages/X/... -> pages/X；src/services/... -> services；
// 直接位于一级目录根部的文件（如 src/__tests__/x.test.ts）归属该目录本身。
function moduleOf(file) {
  const rel = relative(SRC, file);
  const seg = rel.split(/[\\/]/);
  if (seg.length >= 2) {
    return seg.length === 2 ? seg[0] : `${seg[0]}/${seg[1]}`;
  }
  return seg[0] || rel;
}

const testFiles = walk(SRC).map((p) => ({ path: p, module: moduleOf(p) }));

// 页面模块是否存在"缺测试"提示
function missingModules() {
  const missing = [];
  if (!existsSync(PAGE_ROOT)) return missing;
  for (const name of readdirSync(PAGE_ROOT)) {
    const dir = join(PAGE_ROOT, name);
    if (!statSync(dir).isDirectory()) continue;
    const mod = `pages/${name}`;
    if (!testFiles.some((f) => f.module === mod)) missing.push({ dir, module: mod });
  }
  return missing;
}

// ---------- 2. 运行 Vitest（JSON reporter）----------
const jsonOut = join(tmpdir(), `ai-test-vitest-${Date.now()}.json`);
const vitest = spawnSync(
  'yarn', ['vitest', 'run', '--reporter=json', `--outputFile=${jsonOut}`],
  { cwd: ROOT, encoding: 'utf8', timeout: 10 * 60 * 1000 },
);

let vJson = null;
if (existsSync(jsonOut)) {
  try { vJson = JSON.parse(readFileSync(jsonOut, 'utf8')); } catch { vJson = null; }
}

// vitest 有失败时 exit code 非 0，脚本仍需正常产出报告
const summary = vJson
  ? {
      suitesTotal: vJson.numTotalTestSuites,
      suitesPassed: vJson.numPassedTestSuites,
      suitesFailed: vJson.numFailedTestSuites,
      testsTotal: vJson.numTotalTests,
      testsPassed: vJson.numPassedTests,
      testsFailed: vJson.numFailedTests,
    }
  : {
      suitesTotal: 0, suitesPassed: 0, suitesFailed: 0,
      testsTotal: 0, testsPassed: 0, testsFailed: 0,
    };

const passedRate = summary.testsTotal > 0
  ? ((summary.testsPassed / summary.testsTotal) * 100).toFixed(1)
  : '0.0';

// 失败用例清单
const failures = [];
if (vJson) {
  for (const tr of vJson.testResults || []) {
    for (const ar of tr.assertionResults || []) {
      if (ar.status === 'failed') {
        failures.push({ file: relative(ROOT, tr.name || ''), fullName: ar.fullName });
      }
    }
  }
}

// 模块用例分布（JSON testResults 按文件归属聚合）
const moduleCases = {};
if (vJson) {
  for (const tr of vJson.testResults || []) {
    const mod = moduleOf(tr.name);
    moduleCases[mod] = moduleCases[mod] || { files: 0, cases: 0, failed: 0 };
    moduleCases[mod].files += 1;
    for (const ar of tr.assertionResults || []) {
      moduleCases[mod].cases += 1;
      if (ar.status === 'failed') moduleCases[mod].failed += 1;
    }
  }
}

const moduleRows = new Map();
for (const f of testFiles) {
  if (!moduleRows.has(f.module)) moduleRows.set(f.module, { module: f.module, files: 0, cases: 0, failed: 0 });
  const r = moduleRows.get(f.module);
  r.files += 1;
  if (moduleCases[f.module]) {
    r.cases = moduleCases[f.module].cases;
    r.failed = moduleCases[f.module].failed;
  }
}
const moduleRowsSorted = [...moduleRows.values()].sort((a, b) => b.cases - a.cases);

const missing = missingModules();

// ---------- 4. 可选 AI 修复扩展点 ----------
const llmUrl = process.env.AI_TEST_LLM_URL;
const llmKey = process.env.AI_TEST_LLM_KEY;
let aiSection = '> 未配置 `AI_TEST_LLM_URL` / `AI_TEST_LLM_KEY`，已跳过 AI 修复建议环节。';
if (llmUrl && failures.length > 0) {
  aiSection = `> 已配置 \`AI_TEST_LLM_URL\`，已调用 LLM 分析 ${failures.length} 个失败用例。\n\n`;
  for (const f of failures.slice(0, 20)) {
    aiSection += `### ${f.fullName}\n\n- 文件：\`${f.file}\`\n`;
    try {
      const body = JSON.stringify({
        messages: [{ role: 'user', content: `分析以下失败测试并给出修复建议（中文，简洁，2-3 条要点）：${f.file} :: ${f.fullName}` }],
      });
      const args = ['-s', '-X', 'POST', llmUrl, '-H', 'Content-Type: application/json'];
      if (llmKey) args.push('-H', `Authorization: Bearer ${llmKey}`);
      args.push('-d', body);
      const resp = spawnSync('curl', args, { encoding: 'utf8', timeout: 60000 });
      const text = (resp.stdout || resp.error || '（无响应）').slice(0, 600);
      aiSection += `\n**AI 建议**：\n\n\`\`\`\n${text}\n\`\`\`\n\n`;
    } catch (e) {
      aiSection += `\n**AI 调用失败**：${e.message}\n\n`;
    }
  }
} else if (llmUrl) {
  aiSection = '> 已配置 `AI_TEST_LLM_URL`，但当前无失败用例，无需 AI 分析。';
}

// ---------- 3. 生成报告 ----------
const now = new Date();
const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

const failItems = failures.length
  ? failures.map((f) => `- ❌ \`${f.fullName}\`（${f.file}）`).join('\n')
  : '无失败用例。';

const missingItems = missing.length
  ? missing.map((m) => `- \`${m.module}\`（${relative(ROOT, m.dir)}）尚无测试文件`).join('\n')
  : '所有页面模块均有测试覆盖。';

const rows = moduleRowsSorted.length
  ? ['| 模块 | 测试文件数 | 用例数 | 失败数 |', '| --- | ---: | ---: | ---: |']
      .concat(moduleRowsSorted.map((r) => `| \`${r.module}\` | ${r.files} | ${r.cases} | ${r.failed} |`))
      .join('\n')
  : '未扫描到任何测试文件。';

const report = `# AI Test Report

- **生成时间**：${ts}
- **运行命令**：\`yarn ai:test\`
- **Node**：${process.version}

## 总览

| 指标 | 数值 |
| --- | --- |
| 测试文件数 | ${testFiles.length} |
| 测试套件（suites） | ${summary.suitesTotal}（通过 ${summary.suitesPassed} / 失败 ${summary.suitesFailed}） |
| 用例数 | ${summary.testsTotal} |
| 通过 | ${summary.testsPassed} |
| 失败 | ${summary.testsFailed} |
| **通过率** | **${passedRate}%** |

## 各模块测试分布

${rows}

## 失败项清单

${failItems}

## 缺失测试的模块提示

${missingItems}

## AI 修复建议

${aiSection}
`;

mkdirSync(REPORT_DIR, { recursive: true });
writeFileSync(REPORT_PATH, report, 'utf8');

// ---------- 终端摘要 ----------
console.log('================ AI Test Report ================');
console.log(`  测试文件: ${testFiles.length}   用例: ${summary.testsTotal} (通过 ${summary.testsPassed} / 失败 ${summary.testsFailed})   通过率: ${passedRate}%`);
console.log(`  失败项: ${failures.length}   缺测试模块: ${missing.length}`);
console.log(`  报告已写入: ${REPORT_PATH}`);
console.log('================================================');
