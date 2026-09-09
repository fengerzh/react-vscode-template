/**
 * Profile 模块 Service 层（create-form 大表单示例：编辑回填 + 提交链路）。
 * 基于项目真实数据源 @/lib/supabase。复制改名时替换表名常量 TABLE 与写入字段。
 */
import { supabase } from '@/lib/supabase';
import type { Profile, ProfileFormValues, ProfileUpdateInput } from './types';

const TABLE = 'profile_list';

/** 查询详情（编辑回填用） */
export async function getProfileDetail(id: number): Promise<Profile> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) throw new Error(`记录不存在: ${id}`);
  return data as Profile;
}

/** 新增 */
export async function createProfile(input: ProfileFormValues): Promise<Profile> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('新增失败');
  return data as Profile;
}

/** 更新 */
export async function updateProfile(id: number, input: ProfileUpdateInput): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update(input)
    .eq('id', id);

  if (error) throw error;
}
