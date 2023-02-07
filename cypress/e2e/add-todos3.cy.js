/// <reference types="cypress" />

// refactoring async code
async function removeUser(user) {
  const todos = await (await fetch(`/todos/?userId=${user.id}`)).json()
  // delete each todo
  for (const todo of todos) {
    await fetch(`/todos/${todo.id}`, { method: 'DELETE' })
  }
  // delete the user
  await fetch(`/users/${user.id}`, { method: 'DELETE' })
}

beforeEach(async () => {
  // get all users
  const users = await (await fetch('/users')).json()
  // for each user get their todos
  for (const user of users) {
    await removeUser(user)
  }
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
