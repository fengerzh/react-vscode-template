/**
 * Customer 模块类型定义。
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

/** 客户实体（对齐后端表 customer_list 字段） */
export interface Customer {
  id: number;
  name: string;
  age: number;
  email?: string;
  birthday?: string;
  status?: 'active' | 'inactive';
  created_at?: string;
}

/** 客户状态下拉选项（枚举固定，无需走接口） */
export const CUSTOMER_STATUSES = [
  { label: '活跃', value: 'active' },
  { label: '非活跃', value: 'inactive' },
] as const;

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number]['value'];

/** 客户列表查询参数：分页 + 搜索条件 */
export interface CustomerQuery extends PageQuery {
  name?: string;
  age?: number;
}

/** 新增/编辑表单提交类型 */
export interface CustomerFormValues {
  name: string;
  age: number;
  email?: string;
  birthday?: string;
  status?: CustomerStatus;
}

/** 新增入参（id / created_at 由后端生成） */
export type CustomerCreateInput = Omit<Customer, 'id' | 'created_at'>;

/** 更新入参（全字段可选） */
export type CustomerUpdateInput = Partial<Omit<Customer, 'id' | 'created_at'>>;
