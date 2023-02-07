const usersTableBody = document.querySelector('#users tbody')
const todosTableBody = document.querySelector('#todos tbody')
const newTodoInput = document.getElementById('new-todo')

const state = {
  userId: null,
}

async function renderTodos() {
  if (!state.userId) {
    throw new Error('Missing user id')
  }

  const todos = await (
    await fetch(`/todos/?userId=${state.userId}`, { method: 'GET' })
  ).json()
  if (!todos.length) {
    todosTableBody.innerHTML = `<tr data-cy="zero-todos">
      <td colspan="3" style="text-align:center;">No todos</td>
    </tr>`
  } else {
    todosTableBody.innerHTML = todos
      .map((todo, k) => {
        return `<tr data-cy="todo-${k}">
          <td>${k + 1}</td>
          <td>${todo.title || 'something'}</td>
        </tr>`
      })
      .join('\n')
  }
}

async function renderUsers() {
  const users = await (await fetch('/users', { method: 'GET' })).json()
  if (!users.length) {
    usersTableBody.innerHTML = `<tr data-cy="zero-users">
      <td colspan="3" style="text-align:center;">No users</td>
    </td>`
  } else {
    usersTableBody.innerHTML = users
      .map((user, k) => {
        return `<tr data-cy="user-${k}">
          <td>${k + 1}</td>
          <td><input type="radio" id="user${k}" name="contact" value="${
          user.id
        }" /></td>
          <td>${user.name || 'anonymous'}</td>
        </tr>`
      })
      .join('\n')
  }
  usersTableBody.setAttribute('loaded', 'true')

  usersTableBody.addEventListener('click', (e) => {
    if (e.target && e.target.matches(['input[name=contact]'])) {
      console.log('clicked', e.target.value)
      state.userId = e.target.value
      document
        .getElementById('new-todo-form')
        .setAttribute('style', 'display:inherit')

      renderTodos()
    }
  })
}

async function render() {
  document.getElementById('new-user').addEventListener('change', async (e) => {
    e.preventDefault()
    console.log('new user', e.target.value)
    await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: e.target.value,
      }),
    })
    e.target.value = ''

    await renderUsers()
  })

  document.getElementById('new-todo').addEventListener('change', async (e) => {
    e.preventDefault()
    console.log('new todo %s for user %s', e.target.value, state.userId)
    await fetch('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: e.target.value,
        userId: state.userId,
      }),
    })
    e.target.value = ''

    await renderTodos()
  })

  await renderUsers()
}

render()
