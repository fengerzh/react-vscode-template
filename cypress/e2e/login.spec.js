/* global context, it, cy */
context("React-Vscode-Template", () => {
  it("登录页面渲染", () => {
    cy.visit("/user/login");

    // Ant Design ProFormText 渲染 <input class="ant-input"> 而非 type="email"
    // id 属性来自 ProFormText 的 name 属性
    cy.get("#email, input[placeholder*='邮箱']", { timeout: 15000 })
      .should("exist")
      .should("have.length.at.least", 1);
    cy.get("#password, input[placeholder*='密码']", { timeout: 15000 })
      .should("exist")
      .should("have.length.at.least", 1);
  });

  it("首页需要登录", () => {
    cy.visit("/dashboard/home");
    // CI 无 Supabase → auth guard 检测为未登录，自动跳转 /user
    // 等待跳转后登录表单出现
    cy.get("#email, input[placeholder*='邮箱']", { timeout: 20000 })
      .should("exist");
  });
});