/// <reference types="cypress" />

beforeEach(() => {
  cy.fixture('three-users.json').as('users')
})

beforeEach(function () {
  // empty everything
  cy.request('POST', '/reset', { users: this.users, todos: [] })
})

it('adds todos for the user', () => {
  cy.visit('/')
  cy.get('#users tbody[loaded=true]')
  cy.get('table#users tbody tr').should('have.length', 3)
  cy.contains('#users tr', 'Anna').find('input[type=radio]').click()
  cy.get('input#new-todo').should('be.visible').type(`one{enter}`)
  cy.get('input#new-todo').should('have.value', '')
  // add two more todos
  cy.get('input#new-todo').type('second{enter}')
  cy.get('input#new-todo').type('third{enter}')
  cy.get('table#todos tbody tr').should('have.length', 3)
})
