import { makeAutoObservable, runInAction } from "mobx";

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

class UserStore {
  // 用户信息
  userInfo: UserInfo = {
    userName: "",
  };

  // 应用状态
  appState: AppState = {
    loading: false,
    theme: "light",
    collapsed: false,
  };

  constructor() {
    // 使用makeAutoObservable自动处理observable和action
    makeAutoObservable(this, {}, { autoBind: true });

    // 初始化时从localStorage恢复用户信息
    this.initUserInfo();
  }

  // 初始化用户信息
  private initUserInfo() {
    const savedUserName = localStorage.getItem("userName");
    const savedUserId = localStorage.getItem("userId");

    if (savedUserName) {
      this.userInfo = {
        ...this.userInfo,
        userName: savedUserName,
        userId: savedUserId || undefined,
      };
    }
  }

  // 获取用户信息
  async getUserInfo(): Promise<void> {
    try {
      this.setLoading(true);

      // 这里可以调用API获取用户信息
      // const response = await api.getUserInfo();

      // 模拟API调用
      await new Promise((resolve) => { setTimeout(resolve, 500); });

      runInAction(() => {
        this.userInfo = {
          userName: localStorage.getItem("userName") || "",
          userId: localStorage.getItem("userId") || undefined,
        };
      });
    } finally {
      this.setLoading(false);
    }
  }

  // 设置用户信息
  setUserInfo(userInfo: Partial<UserInfo>): void {
    this.userInfo = { ...this.userInfo, ...userInfo };

    // 持久化到localStorage
    if (userInfo.userName) {
      localStorage.setItem("userName", userInfo.userName);
    }
    if (userInfo.userId) {
      localStorage.setItem("userId", userInfo.userId);
    }
  }

  // 清除用户信息
  clearUserInfo(): void {
    this.userInfo = { userName: "" };
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    document.cookie = "token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  // 设置加载状态
  setLoading(loading: boolean): void {
    this.appState.loading = loading;
  }

  // 切换主题
  toggleTheme(): void {
    this.appState.theme = this.appState.theme === "light" ? "dark" : "light";
  }

  // 切换侧边栏折叠状态
  toggleCollapsed(): void {
    this.appState.collapsed = !this.appState.collapsed;
  }

  // 计算属性：是否已登录
  get isLoggedIn(): boolean {
    return !!this.userInfo.userName;
  }

  // 计算属性：用户显示名称
  get displayName(): string {
    return this.userInfo.userName || "未登录";
  }
}

export default new UserStore();
