export class TaskStatusesPage {
  constructor(page) {
    this.page = page
    this.createStatusButton = page.getByRole('link', { name: 'Create' })
    this.createStatusForm = {
      nameStatusInput: this.page.locator('input[name="name"]'),
      slugInput: this.page.locator('input[name="slug"]'),
      save: this.page.getByRole('button', { name: 'save' }),
    }
    this.deleteRowButton = this.page.getByRole('button', { name: 'Delete' })
    this.checkboxAll = page.getByRole('checkbox', { name: 'Select all' })
  }

  async createOrEditStatus(statustName, slug) {
    await this.createStatusForm.nameStatusInput.fill(statustName)
    await this.createStatusForm.slugInput.fill(slug)
    await this.createStatusForm.save.click()
  }

  getRowStatusInList(statustName, slug) {
    let rows = this.page.locator('tbody tr')
    rows = rows.filter({ has: this.page.locator('td.column-name', { hasText: statustName }) })
    rows = rows.filter({ has: this.page.locator('td.column-slug', { hasText: slug }) })
    return rows
  }

  async goEditStatus(statusName, slug) {
    const statusRow = this.getRowStatusInList(statusName, slug)
    await statusRow.click()
  }

  async selectStatusRow(statusName, slug) {
    const statusRow = this.getRowStatusInList(statusName, slug)
    const checkbox = statusRow.locator('td >> input[type="checkbox"]')
    await checkbox.check()
  }

  async deleteStatus(statusName, slug) {
    await this.selectStatusRow(statusName, slug)
    await this.deleteRowButton.click()
  }

  async selectAllRows() {
    await this.checkboxAll.check()
  }
}
