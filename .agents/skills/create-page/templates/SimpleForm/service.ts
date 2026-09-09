/**
 * Feedback 模块 Service 层（简单表单型页面示例）。
 * 基于项目真实数据源 @/lib/supabase。复制改名时替换表名常量 TABLE 与写入字段。
 */
import { supabase } from '@/lib/supabase';
import type { Feedback, FeedbackCreateInput } from './types';

const TABLE = 'feedback_list';

/** 新增反馈 */
export async function createFeedback(input: FeedbackCreateInput): Promise<Feedback> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('新增反馈失败');
  return data as Feedback;
}
