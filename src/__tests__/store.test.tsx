import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import useUserStore, { UserInfo } from "../store";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn(),
  },
}));
vi.mock("@/services", async () => {
  const actual = await vi.importActual("@/services");
  return {
    ...actual,
    getProfile: vi.fn().mockResolvedValue(null),
    upsertProfile: vi.fn().mockResolvedValue(true),
  };
});

describe("UserStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    act(() => {
      useUserStore.setState({
        userInfo: { userName: "" },
        appState: {
          loading: false,
          theme: "light",
          collapsed: false,
        },
      });
    });
  });

  describe("用户信息管理", () => {
    it("应该正确设置用户信息", () => {
      const { result } = renderHook(() => useUserStore());
      const userInfo: UserInfo = {
        userName: "张三",
        userId: "user_001",
        email: "zhangsan@example.com",
      };

      act(() => {
        result.current.setUserInfo(userInfo);
      });

      expect(result.current.userInfo.userName).toBe("张三");
      expect(result.current.userInfo.userId).toBe("user_001");
      expect(result.current.userInfo.email).toBe("zhangsan@example.com");
    });

    it("应该正确清除用户信息", () => {
      const { result } = renderHook(() => useUserStore());

      act(() => {
        result.current.setUserInfo({ userName: "张三", userId: "user_001" });
      });

      act(() => {
        result.current.clearUserInfo();
      });

      expect(result.current.userInfo.userName).toBe("");
      expect(result.current.userInfo.userId).toBeUndefined();
    });

    it("应该支持用户信息的部分更新", () => {
      const { result } = renderHook(() => useUserStore());

      act(() => {
        result.current.setUserInfo({ userName: "李四" });
      });

      expect(result.current.userInfo.userName).toBe("李四");
      expect(result.current.userInfo.userId).toBeUndefined();

      act(() => {
        result.current.setUserInfo({ userId: "user_002" });
      });

      expect(result.current.userInfo.userName).toBe("李四");
      expect(result.current.userInfo.userId).toBe("user_002");
    });
  });

  describe("应用状态管理", () => {
    it("应该正确切换加载状态", () => {
      const { result } = renderHook(() => useUserStore());

      expect(result.current.appState.loading).toBe(false);

      act(() => {
        result.current.setLoading(true);
      });
      expect(result.current.appState.loading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });
      expect(result.current.appState.loading).toBe(false);
    });

    it("应该正确切换主题", () => {
      const { result } = renderHook(() => useUserStore());

      expect(result.current.appState.theme).toBe("light");

      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.appState.theme).toBe("dark");

      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.appState.theme).toBe("light");
    });

    it("应该正确切换侧边栏折叠状态", () => {
      const { result } = renderHook(() => useUserStore());

      expect(result.current.appState.collapsed).toBe(false);

      act(() => {
        result.current.toggleCollapsed();
      });
      expect(result.current.appState.collapsed).toBe(true);

      act(() => {
        result.current.toggleCollapsed();
      });
      expect(result.current.appState.collapsed).toBe(false);
    });
  });

  describe("计算属性", () => {
    it("isLoggedIn应该正确返回登录状态", () => {
      const { result } = renderHook(() => useUserStore());

      expect(result.current.isLoggedIn()).toBe(false);

      act(() => {
        result.current.setUserInfo({ userName: "张三" });
      });
      expect(result.current.isLoggedIn()).toBe(true);

      act(() => {
        result.current.clearUserInfo();
      });
      expect(result.current.isLoggedIn()).toBe(false);
    });

    it("displayName应该正确返回显示名称", () => {
      const { result } = renderHook(() => useUserStore());

      expect(result.current.displayName()).toBe("未登录");

      act(() => {
        result.current.setUserInfo({ userName: "张三" });
      });
      expect(result.current.displayName()).toBe("张三");

      act(() => {
        result.current.clearUserInfo();
      });
      expect(result.current.displayName()).toBe("未登录");
    });
  });

  describe("initAuth", () => {
    it("initAuth 应该正确初始化", async () => {
      const { result } = renderHook(() => useUserStore());

      await act(async () => {
        await result.current.initAuth();
      });

      // initAuth 调用了 supabase.auth.getSession，不应抛错
      expect(result.current.appState.loading).toBe(false);
    });
  });
});