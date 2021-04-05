import type { Page } from "$lib/model/Page"

export interface PageActions {
  getKey(): string

  updatePage(newPage: Page): void

  showError(message: string, ...params: Array<any>): void
}