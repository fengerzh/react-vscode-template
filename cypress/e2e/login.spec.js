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
    cy.get(".ant-spin", { timeout: 158000 }).should("not.exist");
    cy.get(".ant-page-header-heading-title").should("have.text", "首页");
  });
});
