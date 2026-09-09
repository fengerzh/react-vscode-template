/**
 * Order service 单测（列表详情型页面示例）。
 * 复用 vitest.setup.ts 中的全局 supabase mock，不重复 mock；
 * 单用例用 mockReturnValueOnce 注入自定义链式回调。
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  vi, describe, it, expect, beforeEach,
} from 'vitest';
import { supabase } from '@/lib/supabase';
import { getList, getDetail } from '../service';

// 构造可链式调用的 mock query builder（覆盖全局默认返回）
function mockQuery() {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockResolvedValue({ data: [], count: 0, error: null }),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  } as any;
}

describe('order service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getList 返回分页数据', async () => {
    const q = mockQuery();
    q.range.mockResolvedValueOnce({
      data: [{ id: 1, order_no: 'A001', customer_name: '张三', amount: 100 }],
      count: 1,
      error: null,
    });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    const result = await getList({ current: 1, pageSize: 10 });

    expect(supabase.from).toHaveBeenCalledWith('order_list');
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.current).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  it('getList 支持订单号/状态筛选', async () => {
    const q = mockQuery();
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    await getList({ current: 1, pageSize: 10, order_no: 'A00', status: 'paid' });

    expect(q.ilike).toHaveBeenCalledWith('order_no', '%A00%');
    expect(q.eq).toHaveBeenCalledWith('status', 'paid');
  });

  it('getList 出错时抛出异常', async () => {
    const q = mockQuery();
    q.range.mockResolvedValueOnce({
      data: [], count: 0, error: new Error('boom'),
    });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    await expect(getList({ current: 1, pageSize: 10 })).rejects.toThrow('boom');
  });

  it('getDetail 返回记录', async () => {
    const q = mockQuery();
    q.single.mockResolvedValueOnce({
      data: { id: 1, order_no: 'A001', customer_name: '张三' },
      error: null,
    });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    const result = await getDetail(1);

    expect(result.id).toBe(1);
    expect(supabase.from).toHaveBeenCalledWith('order_list');
  });

  it('getDetail 记录不存在时抛出', async () => {
    const q = mockQuery();
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    await expect(getDetail(999)).rejects.toThrow('订单不存在');
  });
});
