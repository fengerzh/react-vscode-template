import { createClient } from '@supabase/supabase-js';

// 当 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 未设置时（CI/无 Supabase 环境），
// 用假的 JWT 和 URL 初始化客户端。Supabase SDK 不会在 import 时报错。
// getSession() 等调用会收到网络错误，由业务代码 try/catch 处理。
const FAKE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZha2UiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxODAwMDAwMDAwfQ.fake';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// CI 环境：用无效 scheme 阻止 SDK 发网络请求，避免连接超时
const fallbackUrl = import.meta.env.CI ? 'noop://ci' : 'http://localhost:0';

export const supabase = createClient(url || fallbackUrl, key || FAKE_JWT);

export type { User } from '@supabase/supabase-js';