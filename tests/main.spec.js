import { test, expect } from '@playwright/test'
import { LoginPage } from './LoginPage.js'
import { DashboardPage } from './DashboardPage.js'
import { UsersPage } from './UsersPage.js'
import { TaskStatusesPage } from './TaskStatusesPage.js'
import { LabelsPage } from './LabelsPage.js'
import { TasksPage } from './TasksPage.js'

let loginPage
let dashboardPage
let userPage
let taskStatusesPage
let labelsPage
let tasksPage

const user = {
  login: 'user',
  password: 'qwerty',
}
const newUser = {
  email: 'anna@mail.com',
  firstName: 'Anna',
  lastName: 'Nar',
}
const newStatus = {
  name: 'To do',
  slug: 'to_do',
}

const newLabel = {
  name: 'incident',
}

const newTask = {
  title: 'Fix bug',
  content: 'fix major prod bug',
}

const userCard2 = {
  email: 'email@inbox.com',
  firstName: 'User2',
  lastName: 'FamilyName2',
  title: 'Create feature',
  content: 'implement feature',
  status: 'reopen',
  statusSlug: 'reopened',
  label: 'implementation',
}

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173')
  loginPage = new LoginPage(page)
  dashboardPage = new DashboardPage(page)
  userPage = new UsersPage(page)
  taskStatusesPage = new TaskStatusesPage(page)
  labelsPage = new LabelsPage(page)
  tasksPage = new TasksPage(page)
})

test.describe('Проверки авторизации и выхода из аккаунта', async () => {
  test('Приложение загружается без ошибок', async ({ page }) => {
    await expect(page.locator('#root')).toBeVisible()
  })

  test('Успешная авторизация', async () => {
    await loginPage.signIn(user.login, user.password)
    await expect(dashboardPage.title).toHaveText(/Welcome to the administration/)
    expect(loginPage.profile).toBeVisible()
  })

  test('Успешный выход из приложения', async () => {
    await loginPage.signIn(user.login, user.password)
    await loginPage.logout()
    expect(loginPage.signInButton).toBeVisible()
  })
})

test.describe('Проверки работы с пользователями', async () => {
  test.beforeEach(async () => {
    await loginPage.signIn(user.login, user.password)
    await dashboardPage.menu.users.click()
  })

  test('Успешное создание пользователя', async () => {
    await userPage.createUserButton.click()
    await userPage.createUser(newUser.email, newUser.firstName, newUser.lastName)
    await dashboardPage.menu.users.click()
    const userRow = await userPage.getRowUserInList(newUser.email, newUser.firstName, newUser.lastName)
    await expect(userRow).toBeVisible()
  })

  test('Успешное редактирование пользователя', async () => {
    await userPage.createUserButton.click()
    await userPage.createUser(newUser.email, newUser.firstName, newUser.lastName)
    await dashboardPage.menu.users.click()
    await userPage.goEditUser(newUser.email, newUser.firstName, newUser.lastName)
    await userPage.editUser('editedEmail@mail.com', 'editedAnna', 'editedNar')
    await dashboardPage.menu.users.click()
    const oldUserRow = await userPage.getRowUserInList(newUser.email, newUser.firstName, newUser.lastName)
    const userRow = await userPage.getRowUserInList('editedEmail@mail.com', 'editedAnna', 'editedNar')
    await expect(userRow).toBeVisible()
    await expect(oldUserRow).not.toBeVisible()
  })

  test('Успешное удаление одного пользователя', async () => {
    await userPage.createUserButton.click()
    await userPage.createUser(newUser.email, newUser.firstName, newUser.lastName)
    await dashboardPage.menu.users.click()
    await userPage.deleteUser(newUser.email, newUser.firstName, newUser.lastName)
    const userRow = await userPage.getRowUserInList(newUser.email, newUser.firstName, newUser.lastName)
    await expect(userRow).not.toBeVisible()
  })

  test('Успешное удаление всех пользователей', async ({ page }) => {
    await userPage.selectAllRows()
    await userPage.deleteRowButton.click()
    await expect(page.getByText(/No Users yet/)).toBeVisible()
  })
})

test.describe('Проверки работы со статусами задач', async () => {
  test.beforeEach(async () => {
    await loginPage.signIn(user.login, user.password)
    await dashboardPage.menu.taskStatuses.click()
  })

  test('Успешное создание статуса', async () => {
    await taskStatusesPage.createStatusButton.click()
    await taskStatusesPage.createOrEditStatus(newStatus.name, newStatus.slug)
    await dashboardPage.menu.taskStatuses.click()
    const statusRow = await taskStatusesPage.getRowStatusInList(newStatus.name, newStatus.slug)
    await expect(statusRow).toBeVisible()
  })

  test('Успешное редактирование статуса', async () => {
    await taskStatusesPage.createStatusButton.click()
    await taskStatusesPage.createOrEditStatus(newStatus.name, newStatus.slug)
    await dashboardPage.menu.taskStatuses.click()
    await taskStatusesPage.goEditStatus(newStatus.name, newStatus.slug)
    await taskStatusesPage.createOrEditStatus('editedstatus', 'editedslug')
    await dashboardPage.menu.taskStatuses.click()
    const oldStatusRow = await taskStatusesPage.getRowStatusInList(newStatus.name, newStatus.slug)
    const statusRow = await taskStatusesPage.getRowStatusInList('editedstatus', 'editedslug')
    await expect(statusRow).toBeVisible()
    await expect(oldStatusRow).not.toBeVisible()
  })

  test('Успешное удаление одного статуса', async () => {
    await taskStatusesPage.createStatusButton.click()
    await taskStatusesPage.createOrEditStatus(newStatus.name, newStatus.slug)
    await dashboardPage.menu.taskStatuses.click()
    await taskStatusesPage.deleteStatus(newStatus.name, newStatus.slug)
    const statusRow = await taskStatusesPage.getRowStatusInList(newStatus.name, newStatus.slug)
    await expect(statusRow).not.toBeVisible()
  })

  test('Успешное удаление всех статусов', async ({ page }) => {
    await taskStatusesPage.selectAllRows()
    await taskStatusesPage.deleteRowButton.click()
    await expect(page.getByText(/No Task statuses yet/)).toBeVisible()
  })
})

test.describe('Проверки работы с метками', async () => {
  test.beforeEach(async () => {
    await loginPage.signIn(user.login, user.password)
    await dashboardPage.menu.labels.click()
  })

  test('Успешное создание метки', async () => {
    await labelsPage.createLabelButton.click()
    await labelsPage.createOrEditLabel(newLabel.name)
    await dashboardPage.menu.labels.click()
    const labelRow = await labelsPage.getRowLabelInList(newLabel.name)
    await expect(labelRow).toBeVisible()
  })

  test('Успешное редактирование метки', async () => {
    await labelsPage.createLabelButton.click()
    await labelsPage.createOrEditLabel(newLabel.name)
    await dashboardPage.menu.labels.click()
    await labelsPage.goEditLabel(newLabel.name)
    await labelsPage.createOrEditLabel('editedincident')
    await dashboardPage.menu.labels.click()
    const labelRow = await labelsPage.getRowLabelInList('editedincident')
    await expect(labelRow).toBeVisible()
  })

  test('Успешное удаление одной метки', async () => {
    await labelsPage.createLabelButton.click()
    await labelsPage.createOrEditLabel(newLabel.name)
    await dashboardPage.menu.labels.click()
    await labelsPage.deleteLabel(newLabel.name)
    const labelRow = await labelsPage.getRowLabelInList(newLabel.name)
    await expect(labelRow).not.toBeVisible()
  })

  test('Успешное удаление всех меток', async ({ page }) => {
    await labelsPage.selectAllRows()
    await labelsPage.deleteRowButton.click()
    await expect(page.getByText(/No Labels yet/)).toBeVisible()
  })
})

test.describe('Проверки работы с задачами', async () => {
  test.beforeEach(async () => {
    await loginPage.signIn(user.login, user.password)
    await dashboardPage.menu.users.click()
    await userPage.createUserButton.click()
    await userPage.createUser(newUser.email, newUser.firstName, newUser.lastName)
    await dashboardPage.menu.taskStatuses.click()
    await taskStatusesPage.createStatusButton.click()
    await taskStatusesPage.createOrEditStatus(newStatus.name, newStatus.slug)
    await dashboardPage.menu.labels.click()
    await labelsPage.createLabelButton.click()
    await labelsPage.createOrEditLabel(newLabel.name)
    await dashboardPage.menu.tasks.click()
  })

  test('Успешное создание задачи только с обязательными полями', async () => {
    await tasksPage.createTaskButton.click()
    await tasksPage.createTaskShort(newUser.email, newTask.title, newStatus.name)
    await dashboardPage.menu.tasks.click()
    await expect(tasksPage.getColumn(newStatus.name).getByText(newTask.title)).toBeVisible()
    await expect(tasksPage.getCard(newTask.title)).toBeVisible()
  })

  test('Успешное создание задачи только со всеми полями', async () => {
    await tasksPage.createTaskButton.click()
    await tasksPage.createOrEditTaskFull(newUser.email, newTask.title, newTask.content, newStatus.name, newLabel.name)
    await dashboardPage.menu.tasks.click()
    await expect(tasksPage.getColumn(newStatus.name).getByText(newTask.title)).toBeVisible()
    await expect(tasksPage.getCard(newTask.title)).toBeVisible()
  })

  test('Успешное редактирование задачи', async () => {
    await tasksPage.createTaskButton.click()
    await tasksPage.createOrEditTaskFull(newUser.email, newTask.title, newTask.content, newStatus.name, newLabel.name)
    await dashboardPage.menu.tasks.click()
    await tasksPage.goEditTask(newTask.title)
    await tasksPage.createOrEditTaskFull(newUser.email, 'editedtitle', 'editedContent', newStatus.name, newLabel.name)
    await dashboardPage.menu.tasks.click()
    const oldCard = await tasksPage.getColumn(newStatus.name).getByText(newTask.title)
    const card = await tasksPage.getColumn(newStatus.name).getByText('editedTitle')
    await expect(card).toBeVisible()
    await expect(oldCard).not.toBeVisible()
  })

  test('Успешное удаление задачи', async () => {
    await tasksPage.createTaskButton.click()
    await tasksPage.createOrEditTaskFull(newUser.email, newTask.title, newTask.content, newStatus.name, newLabel.name)
    await dashboardPage.menu.tasks.click()
    await tasksPage.deleteTask(newTask.title)
    const card = await tasksPage.getColumn(newStatus.name).getByText(newTask.title)
    await expect(card).not.toBeVisible()
  })

  test('Отображаются задачи по фильтру "Assignee", "Status", "Label"', async ({ page }) => {
    await dashboardPage.menu.users.click()
    await userPage.createUserButton.click()
    await userPage.createUser(userCard2.email, userCard2.firstName, userCard2.lastName)
    await dashboardPage.menu.taskStatuses.click()
    await taskStatusesPage.createStatusButton.click()
    await taskStatusesPage.createOrEditStatus(userCard2.status, userCard2.statusSlug)
    await dashboardPage.menu.labels.click()
    await labelsPage.createLabelButton.click()
    await labelsPage.createOrEditLabel(userCard2.label)
    await dashboardPage.menu.tasks.click()

    await tasksPage.createTaskButton.click()
    await tasksPage.createOrEditTaskFull(newUser.email, newTask.title, newTask.content, newStatus.name, newLabel.name)
    await dashboardPage.menu.tasks.click()
    await tasksPage.createTaskButton.click()
    await tasksPage.createOrEditTaskFull(userCard2.email, userCard2.title, userCard2.content, userCard2.status, userCard2.label)
    await dashboardPage.menu.tasks.click()
    await tasksPage.filterByAssignee(newUser.email)
    const card = await tasksPage.getColumn(newStatus.name).getByText(newTask.title)
    const card2 = await tasksPage.getColumn(userCard2.status).getByText(userCard2.title)
    await expect(card).toBeVisible()
    await expect(card2).not.toBeVisible()

    await tasksPage.clearFilterAssignee()
    await tasksPage.filterByStatus(userCard2.status)
    await expect(card2).toBeVisible()
    await expect(card).not.toBeVisible()

    await tasksPage.clearFilterStatus()
    await tasksPage.filterByLabel(newLabel.name)
    await expect(card).toBeVisible()
    await expect(card2).not.toBeVisible()
  })
})
