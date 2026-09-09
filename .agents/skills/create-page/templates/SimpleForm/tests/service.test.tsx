/**
 * Feedback service 单测（简单表单型页面示例）。
 * 复用 vitest.setup.ts 全局 supabase mock。
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  vi, describe, it, expect, beforeEach,
} from 'vitest';
import { supabase } from '@/lib/supabase';
import { createFeedback } from '../service';

function mockQuery() {
  return {
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  } as any;
}

describe('feedback service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createFeedback 返回新记录', async () => {
    const q = mockQuery();
    q.single.mockResolvedValueOnce({
      data: { id: 10, title: '建议加夜间模式', category: 'feature', content: '详情' },
      error: null,
    });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    const result = await createFeedback({
      title: '建议加夜间模式',
      category: 'feature',
      content: '详情',
    });

    expect(result.id).toBe(10);
    expect(supabase.from).toHaveBeenCalledWith('feedback_list');
    expect(q.insert).toHaveBeenCalledWith({
      title: '建议加夜间模式',
      category: 'feature',
      content: '详情',
    });
  });

  it('createFeedback 失败时抛出异常', async () => {
    const q = mockQuery();
    q.single.mockResolvedValueOnce({ data: null, error: new Error('boom') });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    await expect(createFeedback({
      title: 'x', category: 'question', content: 'y',
    })).rejects.toThrow('boom');
  });
});
