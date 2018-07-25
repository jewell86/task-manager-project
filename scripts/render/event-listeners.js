const users = require('../requests/users')
const render = require('./render')
const lists = require('../templates/lists')
const tasks = require('../templates/tasks')
const messages = require('./messages')


function navLinksMain () {
  signupSubmit()
  loginSubmit()
  document.querySelector('.signup-button').addEventListener('click', (ev) => {
      ev.preventDefault()
      document.querySelector('.login-form').classList.add('hide')
      document.querySelector('.signup-form').classList.remove('hide')
  })

  document.querySelector('.login-button').addEventListener('click', (ev) => {
      ev.preventDefault()
      document.querySelector('.login-form').classList.remove('hide')
      document.querySelector('.signup-form').classList.add('hide')
  })
}

function navLinksTasks () {
  document.querySelector('.new-list-button').addEventListener('click', (ev) => {
      ev.preventDefault()
      document.querySelector('.tasks-container').classList.add('hide')
      render.renderNewListForm()
      location.hash = `/lists/new`
      newListSubmit()
  })

  document.querySelector('.all-tasks-button').addEventListener('click', (ev) => {
    ev.preventDefault()
    render.renderTaskPage()
  })

  document.querySelector('.logout-button').addEventListener('click', (ev) => {
      ev.preventDefault()
      // document.querySelector('.login-form').classList.remove('hide')
      // document.querySelector('.main-navbar').classList.remove('hide')
      // document.querySelector('.tasks-navbar').classList.add('hide')
      // document.querySelector('.tasks-container').classList.add('hide')
      users.logout()
      render.renderLogin()
  })

  //all-tasks-button

}

function loginSubmit () {
  document.querySelector('.login-submit').addEventListener('click', (ev) => {
      ev.preventDefault()
      const email = document.querySelector('#email').value
      const pass = document.querySelector('#password').value
      users.loginUser(email, pass)
        .then(response => {
          render.renderTaskPage()
        })
        .catch(err => {
          messages.failureMsg('login')
        })
  })
}

function signupSubmit () {
  document.querySelector('.signup-submit').addEventListener('click', (ev) => {
      ev.preventDefault()
      const email = document.querySelector('#signup-email').value
      const password = document.querySelector('#signup-password').value
      const passwordRe = document.querySelector('#signup-password-re-enter').value
      const first_name = document.querySelector('#signup-first-name').value
      const last_name = document.querySelector('#signup-last-name').value
      if (email && password && passwordRe && first_name && last_name) {
        users.signupUser(password, email, first_name, last_name)
          .then(response => {
            render.renderLogin()
            messages.successMsg('login')
          })
          .catch(err => {
            messages.failureMsg('signup')
          })
      } else {
        console.log('error')
        messages.failureMsg('signup')
      }

  })
}

function newListSubmit () {
  document.querySelector('.new-list-submit').addEventListener('click', (ev) => {
      ev.preventDefault()
      const title = document.querySelector('#new-list-title').value
      const token = JSON.parse(localStorage.getItem('token'))

      users.createList(title, token)
  })
}

function newTaskSubmit () {
    document.querySelector('.task-submit').addEventListener('click', (ev) => {
        ev.preventDefault()
        const title = document.querySelector('#task-title').value
        const description = document.querySelector('#task-description').value
        const token = JSON.parse(localStorage.getItem('token'))
        let list_id = render.listLinkId()
        users.createTask(title, description, list_id, token)
    })
}

function updateButton () {
  Array.from(document.querySelectorAll('.update-button')).forEach(button => {
    button.addEventListener('click', (ev) => {
      ev.preventDefault()
      const listId = ev.target.dataset.listId
      const id = ev.target.parentNode.id

      const title = ev.target.parentNode.parentNode.querySelector('span').textContent
      const description = ev.target.parentNode.parentNode.querySelector('p').textContent
      console.log(title, description, listId, id)
      const cardContainer = ev.target.parentNode.parentNode
      cardContainer.innerHTML = tasks.taskUpdateCard(title, description)


      document.querySelector('.task-update').addEventListener('click', (ev) => {
        ev.preventDefault()
        const newTitle = document.querySelector('#update-title').value
        const newDesc = document.querySelector('#update-description').value
        const body = {title: newTitle, description: newDesc}
        const token = JSON.parse(localStorage.getItem('token'))
        users.updateTask(listId, id, body, token)
          .then(response => {
            render.listTasks()
          })
      })
    })
  })
}

function completeButton(){
    Array.from(document.querySelectorAll('.complete-button')).forEach(button => {
        button.addEventListener('click', function(ev) {
            ev.preventDefault()
            const listId = ev.target.dataset.listId
            const id = ev.target.parentNode.id
            const token = JSON.parse(localStorage.getItem('token'))
            users.completeTask(listId, id, token)
        })
    })
}

function deleteButton() {
    Array.from(document.querySelectorAll('.delete-button')).forEach(button => {
        button.addEventListener('click', function(ev) {
            ev.preventDefault()
            console.log('chello')
            const id = ev.target.parentNode.id
            console.log(id)
            const listId = ev.target.dataset.listId
            const token = JSON.parse(localStorage.getItem('token'))
            users.deleteTask(listId, id, token)
        })
    })
}

    function listLinks() {
        Array.from(document.querySelectorAll('.list-link')).forEach(link => {
            link.addEventListener('click', (ev) => {
                console.log(link.id)
                ev.preventDefault()
                Array.from(document.querySelectorAll('.list-link')).forEach(link => {
                    link.classList.remove('active')
                    link.children[0].classList.remove('hide')
                    link.classList.remove('blue')
                    link.classList.remove('darken-4')
                })
                link.classList.add('active')
                link.children[0].classList.add('hide')
                link.classList.add('blue')
                link.classList.add('darken-4')
                render.listLinkId(parseInt(link.id))
                location.hash = `/lists/${link.id}`
            })
            listDelete()
        })
    }

function listDelete(){
    Array.from(document.querySelectorAll('.list-delete-button')).forEach(button => {
        button.addEventListener('click', function(ev) {
            console.log('yoyo')
            const token = JSON.parse(localStorage.getItem('token'))
            const listId = ev.target.dataset.listId
            users.listDelete(listId, token)
        })
    })
}


module.exports = {
  navLinksMain,
  navLinksTasks,
  loginSubmit,
  signupSubmit,
  newListSubmit,
  completeButton,
  deleteButton,
  newTaskSubmit,
  listLinks,
  updateButton

}
