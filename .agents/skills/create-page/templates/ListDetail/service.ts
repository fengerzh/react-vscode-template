/**
 * Order 模块 Service 层（列表详情型页面示例）。
 * 基于项目真实数据源 @/lib/supabase，页面只依赖本层接口，禁止直接触碰 HTTP。
 * 复制改名时：1) 替换表名常量 TABLE；2) 同步调整搜索/筛选字段；3) 保持方法签名显式类型。
 */
import { supabase } from '@/lib/supabase';
import type {
  Order,
  OrderQuery,
  PaginatedResult,
} from './types';

const TABLE = 'order_list';

/** 分页查询列表（含搜索条件） */
export async function getList(params: OrderQuery): Promise<PaginatedResult<Order>> {
  const page = params.current || 1;
  const size = params.pageSize || 10;
  const from = (page - 1) * size;
  const to = from + size - 1;

  let query = supabase.from(TABLE).select('*', { count: 'exact' });
  if (params.order_no) {
    query = query.ilike('order_no', `%${params.order_no}%`);
  }
  if (params.status) {
    query = query.eq('status', params.status);
  }

  const { data, count, error } = await query
    .order('id', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data ?? []) as Order[],
    total: count ?? 0,
    current: page,
    pageSize: size,
  };
}

/** 查询详情 */
export async function getDetail(id: number): Promise<Order> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) throw new Error(`订单不存在: ${id}`);
  return data as Order;
}
