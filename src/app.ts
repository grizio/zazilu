import { PageRepository } from "./persistence/repositories/PageRepository"

export interface App {
  pageRepository: PageRepository
}

function build(): App {
  const pageRepository = new PageRepository()
  return {
    pageRepository
  }
}

export const app: App = build()