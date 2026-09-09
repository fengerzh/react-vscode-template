/**
 * Vitest 单元测试示例（针对 template/unit/service.ts 纯函数）。
 * 规则：
 * - 测试文件必须用 .tsx 后缀（tsconfig 排除 .ts 后缀测试，必须用 .tsx 保存）。
 * - 单测覆盖：正常分支 / 边界分支 / 空值分支，严禁只测 happy path。
 * - 纯函数直接断言返回值，不需要 mock。
 */
import { describe, it, expect } from 'vitest';
import { formatStatus, pageSummary } from './service';

describe('formatStatus', () => {
  it('返回各状态中文文案', () => {
    expect(formatStatus('todo')).toBe('待处理');
    expect(formatStatus('doing')).toBe('进行中');
    expect(formatStatus('done')).toBe('已完成');
  });

  it('未知状态原样返回（穷举兜底）', () => {
    expect(formatStatus('unknown' as never)).toBe('unknown');
  });
});

describe('pageSummary', () => {
  it('空数据返回暂无数据', () => {
    expect(pageSummary(1, 10, 0)).toBe('暂无数据');
  });

  it('完整页展示起止与总数', () => {
    expect(pageSummary(1, 10, 25)).toBe('第 1-10 条，共 25 条');
  });

  it('末页不足一页时止于 total', () => {
    expect(pageSummary(3, 10, 25)).toBe('第 21-25 条，共 25 条');
  });
});
