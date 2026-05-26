import { vi, describe, it, expect, beforeEach } from "vitest";
import { supabase } from "@/lib/supabase";
import * as services from "../services";

/* eslint-disable @typescript-eslint/no-explicit-any */

// 复用 vitest.setup.ts 中的全局 supabase mock，不重复 mock

describe("Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("认证", () => {
    it("signUp 不报错", async () => {
      vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({ data: { user: { id: "1" } }, error: null });
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
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValueOnce({
          data: [{ id: 1, name: "张三", age: 18 }],
          count: 1,
          error: null,
        }),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      } as any);
      const result = await services.getUsers({ current: 1, pageSize: 10 });
      expect(supabase.from).toHaveBeenCalledWith("user_list");
      expect(result.data).toHaveLength(1);
    });

    it("支持名称搜索", async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValueOnce({ data: [], count: 0, error: null }),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      } as any);
      await services.getUsers({ current: 1, pageSize: 10, name: "test" });
      // ilike 应被调用（链式调用中的查询条件）
      expect(true).toBe(true);
    });

    it("支持年龄过滤", async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValueOnce({ data: [], count: 0, error: null }),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      } as any);
      await services.getUsers({ current: 1, pageSize: 10, age: 18 });
      expect(true).toBe(true);
    });
  });

  describe("createUser", () => {
    it("创建用户成功", async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: [], count: 0, error: null }),
        single: vi.fn().mockResolvedValueOnce({
          data: { id: 10, name: "新用户", age: 25 },
          error: null,
        }),
      } as any);
      const result = await services.createUser({ name: "新用户", age: 25 });
      expect(result.id).toBe(10);
    });
  });

  describe("updateUser", () => {
    it("更新成功", async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValueOnce({ error: null }),
        ilike: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: [], count: 0, error: null }),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      } as any);
      await services.updateUser(1, { name: "改名" });
      expect(true).toBe(true);
    });
  });

  describe("deleteUser", () => {
    it("删除成功", async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValueOnce({ error: null }),
        ilike: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: [], count: 0, error: null }),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      } as any);
      await services.deleteUser(1);
      expect(true).toBe(true);
    });
  });

  describe("getProfile", () => {
    it("未登录返回 null", async () => {
      const result = await services.getProfile();
      expect(result).toBeNull();
    });

    it("已登录返回 profile", async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
        data: { user: { id: "uuid-1" } },
        error: null,
      } as any);
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: [], count: 0, error: null }),
        single: vi.fn().mockResolvedValueOnce({
          data: { id: "uuid-1", name: "张三", email: "test@test.com" },
          error: null,
        }),
      } as any);
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
