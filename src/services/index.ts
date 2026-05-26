import { supabase } from '@/lib/supabase';
import { message } from 'antd';
import type { User } from '@supabase/supabase-js';

// ============ 类型定义 ============

export interface UserRow {
  id: number;
  name: string;
  age: number;
  email?: string;
  birthday?: string;
  created_at?: string;
}

export interface ProfileRow {
  id: string;
  name: string;
  age: number;
  email?: string;
  phone?: string;
  birthday?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

// ============ 认证 API ============

export async function signUp(params: LoginParams) {
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
  });
  return { data, error };
}

export async function signIn(params: LoginParams) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  });
  return { data, error };
}

export async function signOut() {
  return supabase.auth.signOut();
}

/** 获取当前登录用户的 profile */
export async function getProfile(): Promise<ProfileRow | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return data;
}

/** 创建或更新 profile */
export async function upsertProfile(profile: Partial<ProfileRow>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('未登录');

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, ...profile, updated_at: new Date().toISOString() });

  if (error) throw error;
  return true;
}

// ============ 用户列表 CRUD ============

export interface PaginationParams {
  current?: number;
  pageSize?: number;
  name?: string;
  age?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  current: number;
  pageSize: number;
}

export async function getUsers(params: PaginationParams): Promise<PaginatedResult<UserRow>> {
  const page = params.current || 1;
  const size = params.pageSize || 10;
  const from = (page - 1) * size;
  const to = from + size - 1;

  // 构建查询
  let query = supabase
    .from('user_list')
    .select('*', { count: 'exact' });

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
    data: data || [],
    total: count || 0,
    current: page,
    pageSize: size,
  };
}

export async function createUser(user: Omit<UserRow, 'id' | 'created_at'>): Promise<UserRow> {
  const { data, error } = await supabase
    .from('user_list')
    .insert(user)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(id: number, user: Partial<UserRow>): Promise<void> {
  const { error } = await supabase
    .from('user_list')
    .update(user)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteUser(id: number): Promise<void> {
  const { error } = await supabase
    .from('user_list')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============ 兼容旧代码 ============

export { supabase };
export type { User };  // Supabase 的 User 类型，兼容旧的 import