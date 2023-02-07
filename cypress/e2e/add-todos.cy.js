/// <reference types="cypress" />

beforeEach(() => {
  // get all users
  cy.request('/users')
    .its('body')
    .then((users) => {
      if (users.length) {
        // for each user get their todos
        users.forEach((user) => {
          cy.request(`/todos/?userId=${user.id}`)
            .its('body')
            .then((todos) => {
              if (todos.length) {
                // delete each todo
                todos.forEach((todo) => {
                  cy.request('DELETE', `/todos/${todo.id}`)
                })
              }
            })
            .then(() => {
              // delete the user
              cy.request('DELETE', `/users/${user.id}`)
            })
        })
      }
    })
})

it('adds todos for the user', () => {
  cy.visit('/')
  cy.get('#users tbody[loaded=true]')
  cy.get('#new-user').type('Joe{enter}').type('Anna{enter}').type('Mary{enter}')
  cy.get('table#users tbody tr').should('have.length', 3)
  cy.contains('#users tr', 'Anna').find('input[type=radio]').click()
  cy.get('input#new-todo').should('be.visible').type(`one{enter}`)
  cy.get('input#new-todo').should('have.value', '')
  // add two more todos
  cy.get('input#new-todo').type('second{enter}')
  cy.get('input#new-todo').type('third{enter}')
  cy.get('table#todos tbody tr').should('have.length', 3)
})
