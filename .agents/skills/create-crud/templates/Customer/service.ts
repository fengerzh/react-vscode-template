/**
 * Customer 模块 Service 层。
 * 基于项目真实数据源 @/lib/supabase（项目暂无独立 HTTP request 封装，沿用现有 services 写法）。
 * 复制改名时：1) 替换表名常量 TABLE；2) 同步调整搜索/写入字段；3) 保持方法签名显式类型。
 */
import { supabase } from '@/lib/supabase';
import type {
  Customer,
  CustomerQuery,
  CustomerCreateInput,
  CustomerUpdateInput,
  PaginatedResult,
} from './types';

const TABLE = 'customer_list';

/** 分页查询列表（含搜索条件） */
export async function getList(params: CustomerQuery): Promise<PaginatedResult<Customer>> {
  const page = params.current || 1;
  const size = params.pageSize || 10;
  const from = (page - 1) * size;
  const to = from + size - 1;

  let query = supabase.from(TABLE).select('*', { count: 'exact' });
  if (params.name) {
    query = query.ilike('name', `%${params.name}%`);
  }
  if (params.age) {
    query = query.eq('age', params.age);
  }

  const { data, count, error } = await query
    .order('id', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data ?? []) as Customer[],
    total: count ?? 0,
    current: page,
    pageSize: size,
  };
}

/** 查询详情 */
export async function getDetail(id: number): Promise<Customer> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) throw new Error(`客户不存在: ${id}`);
  return data as Customer;
}

/** 新增 */
export async function create(input: CustomerCreateInput): Promise<Customer> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('新增客户失败');
  return data as Customer;
}

/** 更新 */
export async function update(id: number, input: CustomerUpdateInput): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update(input)
    .eq('id', id);

  if (error) throw error;
}

/** 删除 */
export async function remove(id: number): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}
