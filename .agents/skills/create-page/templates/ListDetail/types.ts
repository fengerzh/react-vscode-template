/**
 * Order 模块类型定义（列表详情型页面示例）。
 * 复制改名为业务模块时，请按业务实体同步调整字段与查询参数。
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

/** 订单状态：固定枚举，下拉选项无需走接口 */
export const ORDER_STATUSES = [
  { label: '待支付', value: 'pending' },
  { label: '已支付', value: 'paid' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'done' },
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number]['value'];

/** 订单实体（对齐后端表 order_list 字段） */
export interface Order {
  id: number;
  order_no: string;
  customer_name: string;
  amount: number;
  status?: OrderStatus;
  remark?: string;
  created_at?: string;
}

/** 订单列表查询参数：分页 + 搜索条件 */
export interface OrderQuery extends PageQuery {
  order_no?: string;
  status?: OrderStatus;
}
