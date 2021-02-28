import type { Page } from "~/model/Page"

export interface PageActions {
  getKey(): string

  updatePage(newPage: Page): void

  showError(message: string, ...params: Array<any>): void
}