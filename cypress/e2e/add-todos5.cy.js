/// <reference types="cypress" />

// refactoring async code
async function removeTodo(todo) {
  // delete each todo
  await fetch(`/todos/${todo.id}`, { method: 'DELETE' })
}

function removeUser(user) {
  cy.request(`/todos/?userId=${user.id}`)
    .its('body')
    .each(removeTodo)
    .then(async () => {
      // delete the user
      await fetch(`/users/${user.id}`, { method: 'DELETE' })
    })
}

beforeEach(() => {
  // get all users
  cy.request('/users').its('body').each(removeUser)
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
