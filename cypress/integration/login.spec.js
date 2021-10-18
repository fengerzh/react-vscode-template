context('React-Vscode-Template', () => {
  before(() => {
    cy.visit('/user/login');
    cy.get('.ant-input', { timeout: 58000 }).first().type('13912345678');
    cy.get('#captcha').type('admin').type('{enter}');
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('token');
  });

  it('首页', () => {
    cy.visit('/dashboard/home');
    cy.get('.ant-spin', { timeout: 18000 }).should('not.exist');
    cy.get('.ant-page-header-heading-title').should('have.text', '首页');
  });
});
