/// <reference types="cypress" />

it('adds users', () => {
  const username = `Joe-${Cypress._.random(1e4)}`
  cy.visit('/')
  cy.get('#users tbody[loaded=true]')
  cy.intercept('POST', '/users').as('add-user')
  cy.get('#new-user').type(`${username}{enter}`)
  cy.wait('@add-user').its('request.body').should('deep.equal', {
    name: username,
  })
  cy.get('#new-user').should('have.value', '')
})
