import { test, expect } from '@playwright/test'
import { LoginPage } from './LoginPage.js'

let loginPage
const user = {
  login: 'user',
  password: 'qwerty',
}

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173')
  loginPage = new LoginPage(page)
})

test('Приложение загружается без ошибок', async ({ page }) => {
  await expect(page.locator('#root')).toBeVisible()
})

test('Успешная авторизация', async ({ page }) => {
  await loginPage.signIn(user.login, user.password)
  expect(page.getByText(/Welcome to the administration/)).toBeVisible()
  expect(loginPage.profile).toBeVisible()
})

test('Успешный выход из приложения', async () => {
  await loginPage.signIn(user.login, user.password)
  await loginPage.logout()
  expect(loginPage.signInButton).toBeVisible()
})
