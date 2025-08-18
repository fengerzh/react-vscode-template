/* global context, beforeEach, it, cy */
context("React-Vscode-Template", () => {
  beforeEach(() => {
    // 使用 cy.session 来保持登录状态
    cy.session("login", () => {
      cy.visit("/user/login");
      cy.get(".ant-input", { timeout: 158000 }).first().type("13912345678");
      cy.get("#captcha").type("admin").type("{enter}");
      cy.setCookie("token", "12345");
    });
  });

  it("首页", () => {
    cy.visit("/dashboard/home");
    // 等待加载动画消失
    cy.get(".ant-spin", { timeout: 158000 }).should("not.exist");
    // 等待页面内容加载完成
    cy.get(".ant-layout", { timeout: 158000 }).should("exist");
    // 检查页面标题
    cy.get(".ant-page-header-heading-title", { timeout: 158000 })
      .should("be.visible")
      .should("have.text", "用户管理");
  });
});
