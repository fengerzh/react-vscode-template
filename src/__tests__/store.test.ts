import userStore, { UserInfo } from "../store";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock document.cookie
Object.defineProperty(document, "cookie", {
  writable: true,
  value: "",
});

describe("UserStore", () => {
  beforeEach(() => {
    // 重置所有mock
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // 重置store状态
    userStore.userInfo = { userName: "" };
    userStore.appState = {
      loading: false,
      theme: "light",
      collapsed: false,
    };
  });

  describe("用户信息管理", () => {
    it("应该正确设置用户信息", () => {
      const userInfo: UserInfo = {
        userName: "张三",
        userId: "user_001",
        email: "zhangsan@example.com",
      };

      userStore.setUserInfo(userInfo);

      expect(userStore.userInfo.userName).toBe("张三");
      expect(userStore.userInfo.userId).toBe("user_001");
      expect(userStore.userInfo.email).toBe("zhangsan@example.com");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("userName", "张三");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("userId", "user_001");
    });

    it("应该正确清除用户信息", () => {
      // 先设置用户信息
      userStore.setUserInfo({ userName: "张三", userId: "user_001" });
      
      // 清除用户信息
      userStore.clearUserInfo();

      expect(userStore.userInfo.userName).toBe("");
      expect(userStore.userInfo.userId).toBeUndefined();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("userName");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("userId");
    });

    it("应该从localStorage初始化用户信息", () => {
      // 先清除模块缓存
      jest.resetModules();

      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === "userName") return "李四";
        if (key === "userId") return "user_002";
        return null;
      });

      // 重新导入store模块来触发初始化
      const { default: newStore } = require("../store");

      expect(newStore.userInfo.userName).toBe("李四");
      expect(newStore.userInfo.userId).toBe("user_002");
    });
  });

  describe("应用状态管理", () => {
    it("应该正确切换加载状态", () => {
      expect(userStore.appState.loading).toBe(false);
      
      userStore.setLoading(true);
      expect(userStore.appState.loading).toBe(true);
      
      userStore.setLoading(false);
      expect(userStore.appState.loading).toBe(false);
    });

    it("应该正确切换主题", () => {
      expect(userStore.appState.theme).toBe("light");
      
      userStore.toggleTheme();
      expect(userStore.appState.theme).toBe("dark");
      
      userStore.toggleTheme();
      expect(userStore.appState.theme).toBe("light");
    });

    it("应该正确切换侧边栏折叠状态", () => {
      expect(userStore.appState.collapsed).toBe(false);
      
      userStore.toggleCollapsed();
      expect(userStore.appState.collapsed).toBe(true);
      
      userStore.toggleCollapsed();
      expect(userStore.appState.collapsed).toBe(false);
    });
  });

  describe("计算属性", () => {
    it("isLoggedIn应该正确返回登录状态", () => {
      expect(userStore.isLoggedIn).toBe(false);
      
      userStore.setUserInfo({ userName: "张三" });
      expect(userStore.isLoggedIn).toBe(true);
      
      userStore.clearUserInfo();
      expect(userStore.isLoggedIn).toBe(false);
    });

    it("displayName应该正确返回显示名称", () => {
      expect(userStore.displayName).toBe("未登录");
      
      userStore.setUserInfo({ userName: "张三" });
      expect(userStore.displayName).toBe("张三");
      
      userStore.clearUserInfo();
      expect(userStore.displayName).toBe("未登录");
    });
  });

  describe("异步方法", () => {
    it("getUserInfo应该正确处理成功情况", async () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === "userName") return "王五";
        if (key === "userId") return "user_003";
        return null;
      });

      await userStore.getUserInfo();

      expect(userStore.userInfo.userName).toBe("王五");
      expect(userStore.userInfo.userId).toBe("user_003");
    });

    it("getUserInfo应该正确处理加载状态", async () => {
      const getUserInfoPromise = userStore.getUserInfo();
      
      // 在异步操作期间，loading应该为true
      expect(userStore.appState.loading).toBe(true);
      
      await getUserInfoPromise;
      
      // 异步操作完成后，loading应该为false
      expect(userStore.appState.loading).toBe(false);
    });
  });
});
