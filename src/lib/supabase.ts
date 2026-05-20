import { createClient } from '@supabase/supabase-js';

// 当 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 未设置时（CI/无 Supabase 环境），
// 用假的 JWT 和 URL 初始化客户端。Supabase SDK 不会在 import 时报错，
// 实际的 API 调用只会返回网络错误，由业务代码处理。
const FAKE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZha2UiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxODAwMDAwMDAwfQ.fake';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'http://localhost:0',
  import.meta.env.VITE_SUPABASE_ANON_KEY || FAKE_JWT,
);

export type { User } from '@supabase/supabase-js';