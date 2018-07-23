const events = require('./event-listeners')
const { listsTemp, nav, page, tasks, users } = require('../templates')
let linkId = 0

function renderTaskPage () {
  const events = require('./event-listeners')
  const { lists, nav, page, tasks, users} = require('../templates')
  const loginCheck = JSON.parse(localStorage.getItem('token'))
  if (loginCheck) {
    const container = document.querySelector('.general')
    const navButtons = document.querySelector('#nav-mobile')
    container.innerHTML = page.taskPage()
    navButtons.innerHTML = nav.taskNav()
    events.navLinksTasks()
    const users = require('../requests/users')
    users.getLists(loginCheck)
      .then(lists => {
        renderTasks(lists)
        events.completeButton()
        events.deleteButton()
        events.newTaskSubmit()
        events.listLinks()
      })
  } else {
      //error
  }
}

function renderLogin () {
  const events = require('./event-listeners')
  const { lists, nav, page, tasks, users} = require('../templates')
  const navButtons = document.querySelector('#nav-mobile')
  const container = document.querySelector('.general')
  navButtons.innerHTML = nav.mainNav()
  container.innerHTML = users.login() + users.signup()
  events.navLinksMain()
  events.loginSubmit()
  events.signupSubmit()
}

function renderTasks(lists) {
  const listLinks = document.querySelector('.collection')
  listTasks(lists.data.lists)
  lists.data.lists.forEach(list => {
    listLinks.innerHTML += listsTemp.listLinks(list)
  })
    if(linkId === 0) {
      let activeLink = listLinks.children[0]
      activeLink.classList.add('active')
      linkId = listLinks.children[0].id
  }
  listTasks()
}

function listTasks() {
  const loginCheck = JSON.parse(localStorage.getItem('token'))
  const users = require('../requests/users')
  users.getLists(loginCheck)
      .then(lists => {
        console.log(lists.data.lists)
        let listTasks = lists.data.lists[linkId].tasks
        // console.log(linkId)
        // console.log(lists.data.lists[linkId].tasks)
        listTasks.forEach(task => {
          const tasks = require('../templates')
          const doingTasks = document.querySelector('.doing-tasks')
          const doneTasks = document.querySelector('.done-tasks')
          if(task.completed === false) {
            // console.log(task)
            doingTasks.innerHTML += tasks.tasks.taskCard(task)
          }
          if(task.completed === true) {
           doneTasks.innerHTML += tasks.tasks.doneTaskCard(task)
          }
       })
      })
}

function renderNewListForm(){
  const container = document.querySelector('.general')
  container.innerHTML = listsTemp.newListForm()
}

function listLinkId(id) {
  if(!id) {
    renderTaskPage()
    return linkId
  } else {
    renderTaskPage()
    linkId = Number(id)
    return linkId
  } 
//  listTasks()
}


// function renderSignup () {
//   const navButtons = document.querySelector('#nav-mobile')
//   const container = document.querySelector('.general')
//   navButtons.innerHTML = nav.mainNav()
//   container.innerHTML = users.signup()
// }



module.exports = {
  renderTaskPage,
  renderLogin,
  renderTasks,
  renderNewListForm,
  listLinkId,
  linkId,
  listTasks
}
