/* global context, it, cy */
context("React-Vscode-Template", () => {
  it("登录页面渲染", () => {
    cy.visit("/user/login");
    // 邮箱和密码输入框应该存在
    cy.get('input[type="email"]', { timeout: 10000 }).should("exist");
    cy.get('input[type="password"]', { timeout: 10000 }).should("exist");
  });

  it("首页需要登录", () => {
    // CI 无 Supabase 后端，auth guard 会检测到未登录并跳转到 /user
    cy.visit("/dashboard/home");
    // 最终会渲染 login 页面（因为未认证跳转）
    cy.get('input[type="email"]', { timeout: 15000 }).should("exist");
  });
});