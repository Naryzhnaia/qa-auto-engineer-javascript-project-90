import { test, expect } from '@playwright/test'
import { LoginPage } from './LoginPage.js'
import { DashboardPage } from './DashboardPage.js'
import { UsersPage } from './UsersPage.js'
import { TaskStatusesPage } from './TaskStatusesPage.js'

let loginPage
let dashboardPage
let userPage
let taskStatusesPage

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

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173')
  loginPage = new LoginPage(page)
  dashboardPage = new DashboardPage(page)
  userPage = new UsersPage(page)
  taskStatusesPage = new TaskStatusesPage(page)
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
