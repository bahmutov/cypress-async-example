const usersTableBody = document.querySelector('#users tbody')
async function render() {
  const users = await (await fetch('/users', { method: 'GET' })).json()
  if (!users.length) {
    usersTableBody.innerHTML = `<tr data-cy="zero-users">No users</td>`
  } else {
    usersTableBody.innerHTML = users
      .map((user, k) => {
        return `<tr>
          <td>${k + 1}</td>
          <td><input type="radio" id="user${k}" name="contact" value="${
          user.id
        }" /></td>
          <td>${JSON.stringify(user)}</td>
        </tr>`
      })
      .join('\n')
  }

  document
    .querySelectorAll('input[name=contact]')
    .addEventListener('change', (e) => {
      e.preventDefault()
    })
}

render()
