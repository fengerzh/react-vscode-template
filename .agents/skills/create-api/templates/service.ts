/**
 * Task 模块 Service 层（create-api 模板示例）。
 * 基于项目真实数据源 @/lib/supabase 封装，覆盖：分页列表 / 详情 / 新增 / 更新 / 删除 / 批量。
 * 复制改名为业务模块时，替换表名常量 TABLE、查询筛选字段与批量方法语义。
 * 所有方法统一错误处理：error 存在即抛，数据缺失即抛，不吞错。
 */
import { supabase } from '@/lib/supabase';
import type {
  Task, TaskQuery, TaskCreateInput, TaskUpdateInput, PaginatedResult,
} from './types';

const TABLE = 'task_list';

/**
 * 分页列表：支持的筛选字段（task_list 表列名）与匹配方式
 * - title: ilike 模糊
 * - status: eq 精确
 * - owner: eq 精确
 * 排序：创建时间倒序；分页：current 从 1 开始。
 */
export async function getTaskList(params: TaskQuery = {}): Promise<PaginatedResult<Task>> {
  const { current = 1, pageSize = 10 } = params;

  let query = supabase
    .from(TABLE)
    .select('*', { count: 'exact' });

  if (params.title) {
    query = query.ilike('title', `%${params.title}%`);
  }
  if (params.status) {
    query = query.eq('status', params.status);
  }
  if (params.owner) {
    query = query.eq('owner', params.owner);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range((current - 1) * pageSize, current * pageSize - 1);

  if (error) throw error;
  return {
    data: (data ?? []) as Task[],
    total: count ?? 0,
    current,
    pageSize,
  };
}

/** 详情：按主键查询单条 */
export async function getTaskDetail(id: number): Promise<Task> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) throw new Error(`任务不存在: ${id}`);
  return data as Task;
}

/** 新增 */
export async function createTask(input: TaskCreateInput): Promise<Task> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('新增任务失败');
  return data as Task;
}

/** 更新（全字段可选） */
export async function updateTask(id: number, input: TaskUpdateInput): Promise<Task> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error(`更新任务失败: ${id}`);
  return data as Task;
}

/** 删除 */
export async function removeTask(id: number): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/** 批量删除（in 匹配主键列表） */
export async function batchRemoveTasks(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .in('id', ids);

  if (error) throw error;
}

/** 业务操作示例：批量变更状态（in 匹配） */
export async function batchUpdateTaskStatus(ids: number[], status: Task['status']): Promise<void> {
  if (ids.length === 0) return;
  const { error } = await supabase
    .from(TABLE)
    .update({ status })
    .in('id', ids);

  if (error) throw error;
}
