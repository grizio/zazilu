import { PageRepository } from "$lib/persistence/repositories/PageRepository"
import { UserRepository } from "$lib/persistence/repositories/UserRepository"

export interface App {
  pageRepository: PageRepository
  userRepository: UserRepository
}

function build(): App {
  const pageRepository = new PageRepository()
  const userRepository = new UserRepository()
  return {
    pageRepository,
    userRepository,
  }
}

export const app: App = build()