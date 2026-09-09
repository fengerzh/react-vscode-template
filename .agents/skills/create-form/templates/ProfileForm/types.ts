/**
 * Profile 模块类型定义（create-form 大表单示例）。
 * 复制改名为业务模块时，请按业务实体同步调整字段与表单类型。
 * 禁止使用 any；所有 API 响应必须显式类型。
 */

/** 角色：固定枚举 */
export const PROFILE_ROLES = [
  { label: '工程师', value: 'engineer' },
  { label: '设计师', value: 'designer' },
  { label: '产品经理', value: 'product' },
] as const;

export type ProfileRole = (typeof PROFILE_ROLES)[number]['value'];

/** 个人资料实体（对齐后端表 profile_list 字段） */
export interface Profile {
  id: number;
  name: string;
  age: number;
  role: ProfileRole;
  email: string;
  tags?: string[];
  bio?: string;
  skills?: ProfileSkill[];
  updated_at?: string;
}

/** 动态技能项（Form.List 使用） */
export interface ProfileSkill {
  name: string;
  level: number;
}

/** 表单提交类型（id / updated_at 由后端生成） */
export interface ProfileFormValues {
  name: string;
  age: number;
  role: ProfileRole;
  email: string;
  tags?: string[];
  bio?: string;
  skills?: ProfileSkill[];
}

/** 更新入参（全字段可选） */
export type ProfileUpdateInput = Partial<Omit<Profile, 'id' | 'updated_at'>>;
