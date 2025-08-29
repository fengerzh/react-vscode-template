import { create } from "zustand";
import { subscribeWithSelector, persist } from "zustand/middleware";

// 用户信息类型定义
export interface UserInfo {
  userName: string;
  userId?: string;
  avatar?: string;
  email?: string;
  roles?: string[];
}

// 应用状态类型定义
export interface AppState {
  loading: boolean;
  theme: "light" | "dark";
  collapsed: boolean;
}

// Store 状态类型定义
interface UserStoreState {
  // 状态
  userInfo: UserInfo;
  appState: AppState;

  // Actions
  getUserInfo: () => Promise<void>;
  setUserInfo: (userInfo: Partial<UserInfo>) => void;
  clearUserInfo: () => void;
  setLoading: (loading: boolean) => void;
  toggleTheme: () => void;
  toggleCollapsed: () => void;

  // 计算属性
  isLoggedIn: () => boolean;
  displayName: () => string;
}



// 创建 Zustand store
const useUserStore = create<UserStoreState>()(
  persist(
    subscribeWithSelector((set, get) => ({
    // 初始状态
    userInfo: { userName: "" },
    appState: {
      loading: false,
      theme: "light",
      collapsed: false,
    },



    // 获取用户信息
    getUserInfo: async () => {
      try {
        get().setLoading(true);

        // 这里可以调用API获取用户信息
        // const response = await api.getUserInfo();

        // 模拟API调用
        await new Promise((resolve) => { setTimeout(resolve, 500); });

        // 由于使用了持久化中间件，用户信息已经自动从 localStorage 恢复
        // 这里可以根据需要更新用户信息，比如从服务器获取最新数据
      } finally {
        get().setLoading(false);
      }
    },

    // 设置用户信息
    setUserInfo: (userInfo: Partial<UserInfo>) => {
      set((state) => ({
        userInfo: { ...state.userInfo, ...userInfo },
      }));
    },

    // 清除用户信息
    clearUserInfo: () => {
      set({ userInfo: { userName: "" } });
      document.cookie = "token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    },

    // 设置加载状态
    setLoading: (loading: boolean) => {
      set((state) => ({
        appState: { ...state.appState, loading },
      }));
    },

    // 切换主题
    toggleTheme: () => {
      set((state) => ({
        appState: {
          ...state.appState,
          theme: state.appState.theme === "light" ? "dark" : "light",
        },
      }));
    },

    // 切换侧边栏折叠状态
    toggleCollapsed: () => {
      set((state) => ({
        appState: { ...state.appState, collapsed: !state.appState.collapsed },
      }));
    },

    // 计算属性：是否已登录
    isLoggedIn: () => {
      return !!get().userInfo.userName;
    },

    // 计算属性：用户显示名称
    displayName: () => {
      return get().userInfo.userName || "未登录";
    },
  })),
  {
    name: "user-store", // 存储的键名
    partialize: (state) => ({
      userInfo: state.userInfo
    }), // 只持久化用户信息，不持久化应用状态
  }
));

export default useUserStore;
