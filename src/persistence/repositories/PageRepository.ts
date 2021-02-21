import type { Page } from "../../model/Page"

const defaultHomePage: Page = {
  key: "home",
  title: "Home",
  content: [
    { type: "p", content: "Welcome here!" },
    { type: "p", content: "The application is started." }
  ]
}

export class PageRepository {
  private inMemory: Map<string, Page> = new Map<string, Page>([
    ["home", defaultHomePage]
  ])

  get = async (key: string): Promise<Page | undefined> => {
    return this.inMemory.get(key)
  }

  post = async (page: Page): Promise<void> => {
    if (this.inMemory.has(page.key)) {
      // TODO: error
    } else {
      this.inMemory.set(page.key, page)
    }
  }

  put = async (page: Page): Promise<void> => {
    if (this.inMemory.has(page.key)) {
      this.inMemory.set(page.key, page)
    } else {
      // TODO: error
    }
  }

  remove = async (page: Page): Promise<void> => {
    if (this.inMemory.has(page.key)) {
      this.inMemory.delete(page.key)
    } else {
      // TODO: error
    }
  }
}