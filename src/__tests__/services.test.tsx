import { vi, describe, it, expect, beforeEach } from "vitest";

/* eslint-disable @typescript-eslint/no-explicit-any */

// 构建可链式调用的 mock query builder
function makeQueryBuilder(result = { data: [], count: 0, error: null }) {
  const builder: Record<string, any> = {};

  const methods = ["select", "insert", "update", "delete", "upsert", "eq", "ilike", "order", "single"];
  for (const m of methods) {
    builder[m] = vi.fn(() => builder);
  }

  // range 是最终调用，返回结果
  builder.range = vi.fn().mockResolvedValue(result);

  // from 返回 builder
  const fromFn = vi.fn((_table: string) => builder);

  return { fromFn, builder };
}

const { fromFn, builder } = makeQueryBuilder();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: fromFn,
  },
}));

// 动态导入确保 mock 先生效
const services = await import("../services");

describe("Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("认证", () => {
    it("signUp 不报错", async () => {
      const { supabase } = await import("@/lib/supabase");
      (supabase.auth.signUp as any).mockResolvedValue({ data: { user: { id: "1" } }, error: null });
      const result = await services.signUp({ email: "a@b.com", password: "123456" });
      expect(result).toBeDefined();
    });

    it("signIn 不报错", async () => {
      const result = await services.signIn({ email: "a@b.com", password: "123456" });
      expect(result).toBeDefined();
    });

    it("signOut 不报错", async () => {
      await services.signOut();
      expect(true).toBe(true);
    });
  });

  describe("getUsers", () => {
    it("返回分页数据", async () => {
      builder.range.mockResolvedValueOnce({
        data: [{ id: 1, name: "张三", age: 18 }],
        count: 1,
        error: null,
      });
      const result = await services.getUsers({ current: 1, pageSize: 10 });
      expect(fromFn).toHaveBeenCalledWith("user_list");
      expect(result.data).toHaveLength(1);
    });

    it("支持名称搜索", async () => {
      builder.range.mockResolvedValueOnce({ data: [], count: 0, error: null });
      await services.getUsers({ current: 1, pageSize: 10, name: "test" });
      expect(builder.ilike).toHaveBeenCalledWith("name", "%test%");
    });

    it("支持年龄过滤", async () => {
      builder.range.mockResolvedValueOnce({ data: [], count: 0, error: null });
      await services.getUsers({ current: 1, pageSize: 10, age: 18 });
      expect(builder.eq).toHaveBeenCalledWith("age", 18);
    });
  });

  describe("createUser", () => {
    it("创建用户成功", async () => {
      builder.single.mockResolvedValueOnce({
        data: { id: 10, name: "新用户", age: 25 },
        error: null,
      });
      const result = await services.createUser({ name: "新用户", age: 25 });
      expect(result.id).toBe(10);
    });
  });

  describe("updateUser", () => {
    it("更新成功", async () => {
      (builder.eq as any).mockResolvedValueOnce({ error: null });
      await services.updateUser(1, { name: "改名" });
      expect(builder.update).toHaveBeenCalledWith({ name: "改名" });
    });
  });

  describe("deleteUser", () => {
    it("删除成功", async () => {
      (builder.eq as any).mockResolvedValueOnce({ error: null });
      await services.deleteUser(1);
      expect(builder.delete).toHaveBeenCalled();
    });
  });

  describe("getProfile", () => {
    it("未登录返回 null", async () => {
      const result = await services.getProfile();
      expect(result).toBeNull();
    });

    it("已登录返回 profile", async () => {
      const { supabase } = await import("@/lib/supabase");
      (supabase.auth.getUser as any).mockResolvedValueOnce({
        data: { user: { id: "uuid-1" } },
        error: null,
      });
      builder.single.mockResolvedValueOnce({
        data: { id: "uuid-1", name: "张三", email: "test@test.com" },
        error: null,
      });
      const result = await services.getProfile();
      expect(result?.name).toBe("张三");
    });
  });

  describe("upsertProfile", () => {
    it("未登录时抛错", async () => {
      await expect(services.upsertProfile({ name: "test" })).rejects.toThrow("未登录");
    });
  });
});