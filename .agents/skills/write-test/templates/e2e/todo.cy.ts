/**
 * Cypress E2E 示例（write-test 模板）。
 * 覆盖关键用户链路：登录 -> 任务列表 -> 新增任务 -> 状态更新。
 * 放置位置：cypress/e2e/todo.cy.ts（现有规格为 *.cy.ts，JS 亦可）。
 *
 * 重要说明：
 * - E2E 依赖真实浏览器与已部署/可访问的页面地址（baseUrl），本技能在
 *   CI/无浏览器环境中【无法运行】，仅作为可复制骨架提供。
 * - 选择器统一用 data-cy 属性，避免绑定易变化的结构类名/文案。
 */
describe('任务管理主流程', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('登录后进入任务列表', () => {
    cy.get('[data-cy="username"]').type('zhangjing');
    cy.get('[data-cy="password"]').type('password');
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/tasks');
    cy.get('[data-cy="task-table"]').should('be.visible');
  });

  it('新增一条任务并出现在列表首行', () => {
    cy.get('[data-cy="task-create"]').click();
    cy.get('[data-cy="task-title"]').type('E2E 冒烟任务');
    cy.get('[data-cy="task-owner"]').type('zhangjing');
    cy.get('[data-cy="task-submit"]').click();

    cy.get('[data-cy="task-table"]')
      .contains('[data-cy="task-row"]', 'E2E 冒烟任务')
      .should('be.visible');
  });

  it('将任务状态更新为已完成', () => {
    cy.get('[data-cy="task-row"]')
      .first()
      .find('[data-cy="task-status"]')
      .click();
    cy.get('[data-cy="task-status-option-done"]').click();

    cy.get('[data-cy="task-row"]')
      .first()
      .should('contain', '已完成');
  });
});

/** 供复制改名的选择器清单（与组件 data-cy 一一对应） */
export const CY_SELECTORS = {
  username: '[data-cy="username"]',
  password: '[data-cy="password"]',
  loginSubmit: '[data-cy="login-submit"]',
  taskTable: '[data-cy="task-table"]',
  taskRow: '[data-cy="task-row"]',
  taskCreate: '[data-cy="task-create"]',
  taskTitle: '[data-cy="task-title"]',
  taskOwner: '[data-cy="task-owner"]',
  taskSubmit: '[data-cy="task-submit"]',
  taskStatus: '[data-cy="task-status"]',
  statusOptionDone: '[data-cy="task-status-option-done"]',
} as const;
