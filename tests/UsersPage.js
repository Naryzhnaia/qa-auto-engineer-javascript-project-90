export class UsersPage {
  constructor(page) {
    this.page = page
    this.createUserButton = page.getByRole('link', { name: 'Create' })
    this.createUserForm = {
      emailInput: this.page.locator('input[name="email"]'),
      firstNameInput: this.page.locator('input[name="firstName"]'),
      lastNameInput: this.page.locator('input[name="lastName"]'),
      save: this.page.getByRole('button', { name: 'save' }),
    }
    this.deleteRowButton = this.page.getByRole('button', { name: 'Delete' })
    this.checkboxAll = page.getByRole('checkbox', { name: 'Select all' })
  }

  async createUser(email, firstName, lastName) {
    await this.createUserForm.emailInput.fill(email)
    await this.createUserForm.lastNameInput.fill(lastName)
    await this.createUserForm.firstNameInput.fill(firstName)
    await this.createUserForm.save.click()
  }

  getRowUserInList(email, firstName, lastName) {
    let rows = this.page.locator('tbody tr')
    rows = rows.filter({ has: this.page.locator('td.column-email', { hasText: email }) })
    rows = rows.filter({ has: this.page.locator('td.column-firstName', { hasText: firstName }) })
    rows = rows.filter({ has: this.page.locator('td.column-lastName', { hasText: lastName }) })
    return rows
  }

  async goEditUser(email, firstName, lastName) {
    const userRow = this.getRowUserInList(email, firstName, lastName)
    await userRow.click()
  }

  async editUser(email, firstName, lastName) {
    await this.createUserForm.emailInput.fill(email)
    await this.createUserForm.lastNameInput.fill(lastName)
    await this.createUserForm.firstNameInput.fill(firstName)
    await this.createUserForm.save.click()
  }

  async selectUserRow(email, firstName, lastName) {
    const userRow = this.getRowUserInList(email, firstName, lastName)
    const checkbox = userRow.locator('td >> input[type="checkbox"]')
    await checkbox.check()
  }

  async deleteUser(email, firstName, lastName) {
    await this.selectUserRow(email, firstName, lastName)
    await this.deleteRowButton.click()
  }

  async selectAllRows() {
    await this.checkboxAll.check()
  }
}
