/// <reference types="cypress" />

it('adds todos for the user', () => {
  const username = `Joe-${Cypress._.random(1e4)}`
  const todo = `todo ${Cypress._.random(1e2)}`
  cy.visit('/')
  cy.get('#users tbody[loaded=true]')
  cy.get('#new-user').type(`${username}{enter}`)
  cy.contains('#users tr', username).find('input[type=radio]').click()
  cy.intercept('POST', '/todos').as('add-todo')
  cy.get('input#new-todo').should('be.visible').type(`${todo}{enter}`)
  cy.get('input#new-todo').should('have.value', '')
  cy.wait('@add-todo')
    .its('request.body')
    .should('deep.include', {
      title: todo,
    })
    .and('have.property', 'userId')
})
