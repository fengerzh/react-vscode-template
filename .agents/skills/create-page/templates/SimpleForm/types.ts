/**
 * Feedback 模块类型定义（简单表单型页面示例）。
 * 复制改名为业务模块时，请按业务实体同步调整字段与表单类型。
 * 禁止使用 any；所有 API 响应必须显式类型。
 */

/** 反馈分类：固定枚举，无需走接口 */
export const FEEDBACK_CATEGORIES = [
  { label: '意见反馈', value: 'suggestion' },
  { label: '功能建议', value: 'feature' },
  { label: '问题咨询', value: 'question' },
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number]['value'];

/** 反馈记录实体（对齐后端表 feedback_list 字段） */
export interface Feedback {
  id: number;
  title: string;
  category: FeedbackCategory;
  content: string;
  contact?: string;
  created_at?: string;
}

/** 表单提交类型（id / created_at 由后端生成） */
export interface FeedbackFormValues {
  title: string;
  category: FeedbackCategory;
  content: string;
  contact?: string;
}

/** 新增入参 */
export type FeedbackCreateInput = Omit<Feedback, 'id' | 'created_at'>;
