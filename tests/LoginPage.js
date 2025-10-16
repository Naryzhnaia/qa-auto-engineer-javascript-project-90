export class LoginPage {
  constructor(page) {
    this.page = page
    this.inputLogin = this.page.locator('input[name="username"]')
    this.inputPassword = this.page.locator('input[name="password"]')
    this.signInButton = page.getByRole('button', { name: /Sign in/ })
    this.profile = page.getByRole('button', { name: /Profile/ })
    this.logOutButton = page.getByRole('menuitem', { name: /Logout/ })
  }

  async signIn(login, password) {
    await this.inputLogin.fill(login)
    await this.inputPassword.fill(password)
    await this.signInButton.click()
  }

  async logout() {
    await this.profile.click()
    await this.logOutButton.click()
  }
}
