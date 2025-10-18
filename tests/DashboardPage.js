export class DashboardPage {
  constructor(page) {
    this.page = page
    this.title = page.locator('#react-admin-title')
    this.profile = page.getByRole('button', { name: /Profile/ })
    this.menu = {
      dashboard: this.page.getByRole('menuitem', { name: /Dashboard/ }),
      tasks: this.page.getByRole('menuitem', { name: /Tasks/ }),
      users: this.page.getByRole('menuitem', { name: /Users/ }),
      labels: this.page.getByRole('menuitem', { name: /Labels/ }),
      taskStatuses: this.page.getByRole('menuitem', { name: /Task statuses/ }),
    }
  }
}
