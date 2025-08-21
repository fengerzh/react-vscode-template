import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";
import { message } from "antd";

// API响应基础类型
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  code?: number;
  total?: number;
}

// 用户类型定义
export interface User {
  id: number;
  name: string;
  age: number;
  birthday?: string;
  email?: string;
  phone?: string;
}

// 登录参数类型
export interface LoginParams {
  phone: string;
  captcha: string;
}

// 登录响应类型
export interface LoginResponse {
  userName: string;
  userId?: string;
  token?: string;
}

// 分页参数类型
export interface PaginationParams {
  current?: number;
  pageSize?: number;
  [key: string]: unknown;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  success: boolean;
  total: number;
  current?: number;
  pageSize?: number;
}

// 创建axios实例
const instance = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? "/api" : "",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加token到请求头
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token && config.headers) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;

    // 检查业务状态码
    if (data.success === false) {
      message.error(data.message || "请求失败");
      return Promise.reject(new Error(data.message || "请求失败"));
    }

    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    // 处理不同的HTTP状态码
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          message.error("登录已过期，请重新登录");
          // 清除token并跳转到登录页
          document.cookie = "token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
          window.location.href = "/user";
          break;
        case 403:
          message.error("没有权限访问该资源");
          break;
        case 404:
          message.error("请求的资源不存在");
          break;
        case 500:
          message.error("服务器内部错误");
          break;
        default:
          message.error(data?.message || `请求失败 (${status})`);
      }
    } else if (error.request) {
      message.error("网络连接失败，请检查网络");
    } else {
      message.error("请求配置错误");
    }

    return Promise.reject(error);
  },
);

// Mock数据配置
const mock = new MockAdapter(instance, { delayResponse: 300 });

// 登录接口Mock
mock.onPost("/login").reply((config) => {
  try {
    const { phone, captcha } = JSON.parse(config.data || "{}");

    if (phone === "13912345678" && captcha === "admin") {
      return [
        200,
        {
          data: {
            userName: "张三",
            userId: "user_001",
            token: "mock_token_123456",
          },
          success: true,
          message: "登录成功",
        },
      ];
    }

    return [
      401,
      {
        success: false,
        message: "手机号或验证码错误",
      },
    ];
  } catch {
    return [400, { success: false, message: "请求参数格式错误" }];
  }
});

// 用户列表接口Mock
mock.onPost("/users").reply((config) => {
  try {
    const params = JSON.parse(config.data || "{}");
    const { current = 1, pageSize = 10 } = params;

    const allUsers: User[] = [
      {
        id: 1, name: "张三", age: 18, birthday: "2005-01-01", email: "zhangsan@example.com",
      },
      {
        id: 2, name: "李四", age: 20, birthday: "2003-05-15", email: "lisi@example.com",
      },
      {
        id: 3, name: "王五", age: 22, birthday: "2001-09-20", email: "wangwu@example.com",
      },
      {
        id: 4, name: "赵六", age: 25, birthday: "1998-12-10", email: "zhaoliu@example.com",
      },
    ];

    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    const data = allUsers.slice(start, end);

    return [
      200,
      {
        data,
        success: true,
        total: allUsers.length,
        current,
        pageSize,
      },
    ];
  } catch {
    return [400, { success: false, message: "请求参数格式错误" }];
  }
});

// API函数
export const login = async (params: LoginParams): Promise<AxiosResponse<ApiResponse<LoginResponse>>> => instance.post("/login", params);

export const getUsers = async (params: PaginationParams): Promise<AxiosResponse<PaginatedResponse<User>>> => instance.post("/users", params);

export const getCompany = async (): Promise<AxiosResponse<ApiResponse>> => instance.get("/company");

// 导出axios实例供其他地方使用
export { instance as axiosInstance };
