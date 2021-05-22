import type { Page } from "$model/Page"

export interface PageRepository {
  get(key: string): Promise<Page | undefined>

  getAll(): Promise<Array<Page>>

  post(page: Page): Promise<void>

  put(page: Page): Promise<void>

  remove(key: string): Promise<void>
}