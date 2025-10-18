export class LabelsPage {
  constructor(page) {
    this.page = page
    this.createLabelButton = page.getByRole('link', { name: 'Create' })
    this.createLabelForm = {
      nameLabelInput: this.page.locator('input[name="name"]'),
      save: this.page.getByRole('button', { name: 'save' }),
    }
    this.deleteRowButton = this.page.getByRole('button', { name: 'Delete' })
    this.checkboxAll = page.getByRole('checkbox', { name: 'Select all' })
  }

  async createOrEditLabel(labelName) {
    await this.createLabelForm.nameLabelInput.fill(labelName)
    await this.createLabelForm.save.click()
  }

  getRowLabelInList(labelName) {
    return this.page.locator('tbody tr').filter({ has: this.page.locator('td.column-name', { hasText: labelName }) })
  }

  async goEditLabel(labelName) {
    const labelRow = this.getRowLabelInList(labelName)
    await labelRow.click()
  }

  async selectLabelRow(labelName) {
    const labelRow = this.getRowLabelInList(labelName)
    const checkbox = labelRow.locator('td >> input[type="checkbox"]')
    await checkbox.check()
  }

  async deleteLabel(labelName) {
    await this.selectLabelRow(labelName)
    await this.deleteRowButton.click()
  }

  async selectAllRows() {
    await this.checkboxAll.check()
  }
}
