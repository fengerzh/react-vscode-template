/**
 * Profile service 单测（create-form 大表单示例）。
 * 复用 vitest.setup.ts 全局 supabase mock。
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  vi, describe, it, expect, beforeEach,
} from 'vitest';
import { supabase } from '@/lib/supabase';
import { getProfileDetail, createProfile, updateProfile } from '../service';

function mockQuery() {
  return {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  } as any;
}

const baseInput = {
  name: '张三',
  age: 18,
  role: 'engineer',
  email: 'zs@example.com',
} as const;

describe('profile service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getProfileDetail 返回记录', async () => {
    const q = mockQuery();
    q.single.mockResolvedValueOnce({
      data: { id: 1, ...baseInput },
      error: null,
    });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    const result = await getProfileDetail(1);

    expect(result.id).toBe(1);
    expect(supabase.from).toHaveBeenCalledWith('profile_list');
    expect(q.eq).toHaveBeenCalledWith('id', 1);
  });

  it('getProfileDetail 记录不存在时抛出', async () => {
    const q = mockQuery();
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    await expect(getProfileDetail(999)).rejects.toThrow('记录不存在');
  });

  it('createProfile 返回新记录', async () => {
    const q = mockQuery();
    q.single.mockResolvedValueOnce({
      data: { id: 10, ...baseInput },
      error: null,
    });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    const result = await createProfile({ ...baseInput });

    expect(result.id).toBe(10);
    expect(q.insert).toHaveBeenCalledWith({ ...baseInput });
  });

  it('updateProfile 成功', async () => {
    const q = mockQuery();
    q.eq.mockResolvedValueOnce({ error: null });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    await expect(updateProfile(1, { name: '改名' })).resolves.toBeUndefined();
    expect(q.update).toHaveBeenCalledWith({ name: '改名' });
    expect(q.eq).toHaveBeenCalledWith('id', 1);
  });

  it('createProfile 失败时抛出异常', async () => {
    const q = mockQuery();
    q.single.mockResolvedValueOnce({ data: null, error: new Error('boom') });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    await expect(createProfile({ ...baseInput })).rejects.toThrow('boom');
  });
});
