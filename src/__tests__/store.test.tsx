import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import useUserStore, { UserInfo } from "../store";

describe("UserStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // 重置 Zustand store 状态
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

  describe("异步方法", () => {
    it("getUserInfo应该正确处理成功情况", async () => {
      const { result } = renderHook(() => useUserStore());

      act(() => {
        result.current.setUserInfo({ userName: "王五", userId: "user_003" });
      });

      await act(async () => {
        await result.current.getUserInfo();
      });

      expect(result.current.userInfo.userName).toBe("王五");
      expect(result.current.userInfo.userId).toBe("user_003");
    });

    it("getUserInfo应该正确处理加载状态", async () => {
      const { result } = renderHook(() => useUserStore());

      expect(result.current.appState.loading).toBe(false);

      await act(async () => {
        const getUserInfoPromise = result.current.getUserInfo();
        await Promise.resolve();
        expect(result.current.appState.loading).toBe(true);
        await getUserInfoPromise;
      });

      expect(result.current.appState.loading).toBe(false);
    });
  });
});