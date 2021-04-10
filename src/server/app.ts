import { PageRepository } from "$server/persistence/PageRepository"
import { UserRepository } from "$server/persistence/UserRepository"

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