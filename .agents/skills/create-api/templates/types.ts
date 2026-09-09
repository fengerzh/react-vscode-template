/**
 * Task 模块类型定义（create-api 模板示例）。
 * 复制改名为业务模块时，请按业务实体同步调整字段、查询参数与表单类型。
 * 禁止使用 any；所有 API 响应必须显式类型。
 */

/** 分页查询基础参数（current 从 1 开始） */
export interface PageQuery {
  current?: number;
  pageSize?: number;
}

/** 分页响应统一结构 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  current: number;
  pageSize: number;
}

/** 任务状态枚举 */
export const TASK_STATUSES = [
  { label: '待处理', value: 'todo' },
  { label: '进行中', value: 'doing' },
  { label: '已完成', value: 'done' },
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number]['value'];

/** 任务实体（对齐后端表 task_list 字段） */
export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  owner: string;
  priority?: number;
  due_date?: string;
  created_at?: string;
}

/** 列表查询参数：分页 + 筛选 */
export interface TaskQuery extends PageQuery {
  title?: string;
  status?: TaskStatus;
  owner?: string;
}

/** 新增入参（id / created_at 由后端生成） */
export type TaskCreateInput = Omit<Task, 'id' | 'created_at'>;

/** 更新入参（全字段可选） */
export type TaskUpdateInput = Partial<Omit<Task, 'id' | 'created_at'>>;
