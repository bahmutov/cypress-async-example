const usersTableBody = document.querySelector('#users tbody')
async function render() {
  const users = await (await fetch('/users', { method: 'GET' })).json()
  if (!users.length) {
    usersTableBody.innerHTML = `<tr data-cy="zero-users">No users</td>`
  } else {
    usersTableBody.innerHTML = users
      .map((user) => {
        return `<tr><td>${JSON.stringify(user)}</td></tr>`
      })
      .join('\n')
  }
}

render()
