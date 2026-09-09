/**
 * Customer service 单测。
 * 复用 vitest.setup.ts 中的全局 supabase mock，不重复 mock；
 * 单个用例用 mockReturnValueOnce 注入自定义链式回调，写法对齐 src/__tests__/services.test.tsx。
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  vi, describe, it, expect, beforeEach,
} from 'vitest';
import { supabase } from '@/lib/supabase';
import {
  getList, getDetail, create, update, remove,
} from '../service';

// 构造可链式调用的 mock query builder（覆盖全局默认返回）
function mockQuery() {
  return {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockResolvedValue({ data: [], count: 0, error: null }),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  } as any;
}

describe('customer service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getList 返回分页数据', async () => {
    const q = mockQuery();
    q.range.mockResolvedValueOnce({
      data: [{
        id: 1, name: '张三', age: 18, status: 'active',
      }],
      count: 1,
      error: null,
    });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    const result = await getList({ current: 1, pageSize: 10 });

    expect(supabase.from).toHaveBeenCalledWith('customer_list');
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.current).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  it('getList 支持名称搜索', async () => {
    const q = mockQuery();
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    await getList({ current: 1, pageSize: 10, name: '张' });

    expect(q.ilike).toHaveBeenCalledWith('name', '%张%');
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
      data: { id: 1, name: '张三', age: 18 },
      error: null,
    });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    const result = await getDetail(1);

    expect(result.id).toBe(1);
    expect(supabase.from).toHaveBeenCalledWith('customer_list');
  });

  it('getDetail 记录不存在时抛出', async () => {
    const q = mockQuery();
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    await expect(getDetail(999)).rejects.toThrow('客户不存在');
  });

  it('create 返回新记录', async () => {
    const q = mockQuery();
    q.single.mockResolvedValueOnce({
      data: { id: 10, name: '新客户', age: 25 },
      error: null,
    });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    const result = await create({ name: '新客户', age: 25 });

    expect(result.id).toBe(10);
    expect(q.insert).toHaveBeenCalledWith({ name: '新客户', age: 25 });
  });

  it('update 成功', async () => {
    const q = mockQuery();
    q.eq.mockResolvedValueOnce({ error: null });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    await expect(update(1, { name: '改名' })).resolves.toBeUndefined();
    expect(q.eq).toHaveBeenCalledWith('id', 1);
  });

  it('remove 成功', async () => {
    const q = mockQuery();
    q.eq.mockResolvedValueOnce({ error: null });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    await expect(remove(1)).resolves.toBeUndefined();
  });
});
