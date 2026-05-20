import { create } from 'zustand';
import { subscribeWithSelector, persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { getProfile, upsertProfile, type ProfileRow } from '@/services';

// ============ 类型定义 ============

export interface UserInfo {
  userId?: string;
  userName: string;
  email?: string;
  avatar?: string;
  phone?: string;
}

export interface AppState {
  loading: boolean;
  theme: 'light' | 'dark';
  collapsed: boolean;
}

interface UserStoreState {
  userInfo: UserInfo;
  appState: AppState;

  // 认证相关
  initAuth: () => Promise<void>;
  setUserInfo: (info: Partial<UserInfo>) => void;
  clearUserInfo: () => void;
  refreshProfile: () => Promise<void>;

  // 应用状态
  setLoading: (loading: boolean) => void;
  toggleTheme: () => void;
  toggleCollapsed: () => void;

  // 计算
  isLoggedIn: () => boolean;
  displayName: () => string;
}

const useUserStore = create<UserStoreState>()(
  persist(
    subscribeWithSelector((set, get) => ({
      userInfo: { userName: '' },
      appState: { loading: false, theme: 'light', collapsed: false },

      // ====== 初始化认证 ======
      initAuth: async () => {
        set((s) => ({ appState: { ...s.appState, loading: true } }));

        // 从 Supabase 恢复 session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // 查 profile
          const profile = await getProfile();
          if (profile) {
            set({
              userInfo: {
                userId: session.user.id,
                userName: profile.name || session.user.email?.split('@')[0] || '',
                email: session.user.email,
                phone: profile.phone,
              },
            });
          } else {
            // 有 auth 用户但没 profile（刚注册），创建一个
            const name = session.user.email?.split('@')[0] || '新用户';
            await upsertProfile({ name, email: session.user.email });
            set({
              userInfo: {
                userId: session.user.id,
                userName: name,
                email: session.user.email,
              },
            });
          }
        }

        set((s) => ({ appState: { ...s.appState, loading: false } }));

        // 监听 auth 状态变化（登录/登出/过期）
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const profile = await getProfile();
            set({
              userInfo: {
                userId: session.user.id,
                userName: profile?.name || session.user.email?.split('@')[0] || '',
                email: session.user.email,
                phone: profile?.phone,
              },
            });
          } else if (event === 'SIGNED_OUT') {
            set({ userInfo: { userName: '' } });
          }
        });
      },

      // ====== 设置用户信息 ======
      setUserInfo: (info: Partial<UserInfo>) => {
        set((state) => ({
          userInfo: { ...state.userInfo, ...info },
        }));
      },

      // ====== 清除用户信息 ======
      clearUserInfo: () => {
        set({ userInfo: { userName: '' } });
        supabase.auth.signOut();
      },

      // ====== 刷新 profile ======
      refreshProfile: async () => {
        const profile = await getProfile();
        if (profile) {
          set((state) => ({
            userInfo: {
              ...state.userInfo,
              userName: profile.name,
              email: profile.email,
              phone: profile.phone,
            },
          }));
        }
      },

      // ====== 应用状态 ======
      setLoading: (loading: boolean) => {
        set((s) => ({ appState: { ...s.appState, loading } }));
      },

      toggleTheme: () => {
        set((s) => ({
          appState: {
            ...s.appState,
            theme: s.appState.theme === 'light' ? 'dark' : 'light',
          },
        }));
      },

      toggleCollapsed: () => {
        set((s) => ({
          appState: { ...s.appState, collapsed: !s.appState.collapsed },
        }));
      },

      isLoggedIn: () => !!get().userInfo.userName,

      displayName: () => get().userInfo.userName || '未登录',
    })),
    {
      name: 'user-store',
      partialize: (state) => ({ userInfo: state.userInfo }),
    },
  ),
);

export default useUserStore;