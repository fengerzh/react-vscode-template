context('React-Vscode-Template', () => {
  before(() => {
    cy.visit('/user/login');
    cy.get('.ant-input', { timeout: 158000 }).first().type('13912345678');
    cy.get('#captcha').type('admin').type('{enter}');
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('token');
  });

  it('首页', () => {
    cy.setCookie('token', '12345');
    cy.visit('/dashboard/home');
    cy.get('.ant-spin', { timeout: 158000 }).should('not.exist');
    cy.get('.ant-page-header-heading-title').should('have.text', '首页');
  });
});
