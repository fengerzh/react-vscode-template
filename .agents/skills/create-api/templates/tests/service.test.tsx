/**
 * Task service 方法集单测（create-api 模板示例）。
 * 复用 vitest.setup.ts 全局 supabase mock；用 mock 链式 builder 注入返回值。
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  vi, describe, it, expect, beforeEach,
} from 'vitest';
import { supabase } from '@/lib/supabase';
import {
  getTaskList, getTaskDetail, createTask, updateTask, removeTask,
  batchRemoveTasks, batchUpdateTaskStatus,
} from '../service';

const sampleTask = {
  id: 1, title: '写周报', status: 'todo', owner: 'zhangjing', priority: 1,
} as const;

/** 构造可链式调用的 mock query builder */
function mockQuery() {
  return {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockResolvedValue({ data: [sampleTask], count: 1, error: null }),
    single: vi.fn().mockResolvedValue({ data: sampleTask, error: null }),
  } as any;
}

describe('task service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getTaskList 返回分页数据并落库表名', async () => {
    const q = mockQuery();
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    const result = await getTaskList({ current: 1, pageSize: 10 });

    expect(supabase.from).toHaveBeenCalledWith('task_list');
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(q.range).toHaveBeenCalledWith(0, 9);
  });

  it('getTaskList 支持标题模糊与状态精确筛选', async () => {
    const q = mockQuery();
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    await getTaskList({ title: '周报', status: 'todo' });

    expect(q.ilike).toHaveBeenCalledWith('title', '%周报%');
    expect(q.eq).toHaveBeenCalledWith('status', 'todo');
  });

  it('getTaskList 出错时抛出异常', async () => {
    const q = mockQuery();
    q.range.mockResolvedValueOnce({ data: [], count: 0, error: new Error('boom') });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    await expect(getTaskList()).rejects.toThrow('boom');
  });

  it('getTaskDetail 返回记录', async () => {
    const q = mockQuery();
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    const result = await getTaskDetail(1);

    expect(result.id).toBe(1);
    expect(q.eq).toHaveBeenCalledWith('id', 1);
  });

  it('getTaskDetail 不存在时抛出', async () => {
    const q = mockQuery();
    q.single.mockResolvedValueOnce({ data: null, error: null });
    vi.mocked(supabase.from).mockReturnValueOnce(q);

    await expect(getTaskDetail(999)).rejects.toThrow('任务不存在');
  });

  it('createTask / updateTask 组装插入与更新入参', async () => {
    const createQ = mockQuery();
    vi.mocked(supabase.from).mockReturnValueOnce(createQ);
    const created = await createTask({ ...sampleTask });
    expect(created.id).toBe(1);
    expect(createQ.insert).toHaveBeenCalledWith({ ...sampleTask });

    const updateQ = mockQuery();
    vi.mocked(supabase.from).mockReturnValueOnce(updateQ);
    const updated = await updateTask(1, { status: 'done' });
    expect(updated.status).toBe('todo');
    expect(updateQ.update).toHaveBeenCalledWith({ status: 'done' });
    expect(updateQ.eq).toHaveBeenCalledWith('id', 1);
  });

  it('removeTask / batchRemoveTasks / batchUpdateTaskStatus 命中删除与批量链', async () => {
    const delQ = mockQuery();
    vi.mocked(supabase.from).mockReturnValueOnce(delQ);
    await removeTask(1);
    expect(delQ.eq).toHaveBeenCalledWith('id', 1);

    const batchDelQ = mockQuery();
    vi.mocked(supabase.from).mockReturnValueOnce(batchDelQ);
    await batchRemoveTasks([1, 2]);
    expect(batchDelQ.in).toHaveBeenCalledWith('id', [1, 2]);

    const batchUpQ = mockQuery();
    vi.mocked(supabase.from).mockReturnValueOnce(batchUpQ);
    await batchUpdateTaskStatus([1, 2], 'done');
    expect(batchUpQ.update).toHaveBeenCalledWith({ status: 'done' });
    expect(batchUpQ.in).toHaveBeenCalledWith('id', [1, 2]);
  });

  it('空 ID 列表时批量方法短路不请求', async () => {
    await batchRemoveTasks([]);
    await batchUpdateTaskStatus([], 'done');
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
