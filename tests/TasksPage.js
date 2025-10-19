export class TasksPage {
  constructor(page) {
    this.page = page
    this.createTaskButton = page.getByRole('link', { name: 'Create' })
    this.createTaskForm = {
      assignee: this.page.getByLabel('Assignee'),
      title: this.page.locator('input[name="title"]'),
      content: this.page.locator('textarea[name="content"]'),
      status: this.page.getByLabel('Status'),
      label: this.page.getByLabel('Label'),
      save: this.page.getByRole('button', { name: 'Save' }),
    }
    this.filters = {
      assignee: this.page.getByLabel('Assignee'),
      status: this.page.getByLabel('Status'),
      label: this.page.getByLabel('Label'),
    }
    this.deleteTaskButton = this.page.getByRole('button', { name: 'Delete' })
  }

  async createTaskShort(assignee, title, status) {
    await this.createTaskForm.assignee.click()
    await this.page.getByRole('option', { name: assignee }).click()
    await this.createTaskForm.title.fill(title)
    await this.createTaskForm.status.click()
    await this.page.getByRole('option', { name: status }).click()
    await this.createTaskForm.save.click()
  }

  async createOrEditTaskFull(assignee, title, content, status, label) {
    await this.createTaskForm.assignee.click()
    await this.page.getByRole('option', { name: assignee }).click()
    await this.createTaskForm.title.fill(title)
    await this.createTaskForm.content.fill(content)
    await this.createTaskForm.status.click()
    await this.page.getByRole('option', { name: status }).click()
    await this.createTaskForm.label.click()
    await this.page.getByRole('option', { name: label }).click()
    await this.page.keyboard.press('Escape')
    await this.createTaskForm.save.click()
  }

  getCard(titleTask) {
    return this.page.locator('.MuiCard-root', { hasText: titleTask })
  }

  getColumn(statusName) {
    return this.page.locator('div', { hasText: statusName }, { exact: true })
  }

  getEditButton(titleTask) {
    const card = this.page.locator('.MuiCard-root', { hasText: titleTask })
    return card.getByRole('link', { name: 'Edit' })
  }

  async goEditTask(titleTask) {
    const editButton = this.getEditButton(titleTask)
    await editButton.click()
  }

  async deleteTask(titleTask) {
    await this.goEditTask(titleTask)
    await this.deleteTaskButton.click()
  }

  async filterByAssignee(assignee) {
    await this.filters.assignee.click()
    await this.page.getByRole('option', { name: assignee }).click()
  }

  async filterByStatus(status) {
    await this.filters.status.click()
    await this.page.getByRole('option', { name: status }).click()
  }

  async filterByLabel(label) {
    await this.filters.label.click()
    await this.page.getByRole('option', { name: label }).click()
  }

  async clearFilterAssignee() {
    await this.filters.assignee.click()
    await this.page.getByRole('option', { name: 'Clear value' }).click()
  }

  async clearFilterStatus() {
    await this.filters.status.click()
    await this.page.getByRole('option', { name: 'Clear value' }).click()
  }

  async clearFilterLabel() {
    await this.filters.label.click()
    await this.page.getByRole('option', { name: 'Clear value' }).click()
  }
}
