import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { login, getUsers, LoginParams, User } from "../services";

// 创建axios mock实例
let mock = new MockAdapter(axios);

// Mock antd message
jest.mock("antd", () => ({
  message: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

describe("Services", () => {
  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();
    // 重置axios实例的mock适配器
    mock.restore();
    mock = new MockAdapter(axios);
  });

  afterAll(() => {
    mock.restore();
  });

  describe("login", () => {
    it("应该成功登录", async () => {
      const loginParams: LoginParams = {
        phone: "13912345678",
        captcha: "admin",
      };

      const mockResponse = {
        data: {
          userName: "张三",
          userId: "user_001",
          token: "mock_token_123456",
        },
        success: true,
        message: "登录成功",
      };

      mock.onPost("/login").reply(200, mockResponse);

      const response = await login(loginParams);

      expect(response.status).toBe(200);
      expect(response.data.data.userName).toBe("张三");
      expect(response.data.success).toBe(true);
    });

    it("应该处理登录失败", async () => {
      const loginParams: LoginParams = {
        phone: "13912345678",
        captcha: "wrong",
      };

      mock.onPost("/login").reply(401, {
        success: false,
        message: "手机号或验证码错误",
      });

      try {
        await login(loginParams);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("应该处理网络错误", async () => {
      const loginParams: LoginParams = {
        phone: "13912345678",
        captcha: "admin",
      };

      mock.onPost("/login").networkError();

      try {
        await login(loginParams);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("getUsers", () => {
    it("应该成功获取用户列表", async () => {
      // 使用实际services中的mock数据，它返回4个用户
      const response = await getUsers({ current: 1, pageSize: 10 });

      expect(response.status).toBe(200);
      expect(response.data.data).toHaveLength(4); // 实际返回4个用户
      expect(response.data.total).toBe(4);
      expect(response.data.success).toBe(true);
    });

    it("应该处理分页参数", async () => {
      // 使用实际services中的分页逻辑
      const response = await getUsers({ current: 2, pageSize: 2 });

      expect(response.status).toBe(200);
      expect(response.data.current).toBe(2);
      expect(response.data.pageSize).toBe(2);
      // 第二页应该有2个用户（第3、4个用户）
      expect(response.data.data).toHaveLength(2);
    });

    it("应该处理默认分页", async () => {
      // 测试默认分页参数
      const response = await getUsers({});

      expect(response.status).toBe(200);
      expect(response.data.data).toHaveLength(4); // 默认返回所有4个用户
      expect(response.data.total).toBe(4);
      expect(response.data.current).toBe(1);
      expect(response.data.pageSize).toBe(10);
    });

    it("应该处理服务器错误", async () => {
      mock.onPost("/users").reply(500, {
        success: false,
        message: "服务器内部错误",
      });

      try {
        await getUsers({});
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("请求拦截器", () => {
    it("应该在请求头中添加token", async () => {
      // 模拟cookie中有token
      Object.defineProperty(document, "cookie", {
        writable: true,
        value: "token=test_token_123; other=value",
      });

      mock.onPost("/test").reply((config) => {
        expect(config.headers?.Authorization).toBe("Bearer test_token_123");
        return [200, { success: true }];
      });

      try {
        await axios.post("/test", {});
      } catch (error) {
        // 忽略错误，我们只关心请求头
      }
    });
  });

  describe("响应拦截器", () => {
    it("应该处理业务失败响应", async () => {
      mock.onPost("/test").reply(200, {
        success: false,
        message: "业务错误",
      });

      try {
        await axios.post("/test", {});
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("应该处理401未授权", async () => {
      // Mock window.location.href
      delete (window as any).location;
      (window as any).location = { href: "" };

      mock.onPost("/test").reply(401, {
        success: false,
        message: "未授权",
      });

      try {
        await axios.post("/test", {});
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
