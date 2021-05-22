import { PageRepository } from "$server/persistence/PageRepository"
import { UserRepository } from "$server/persistence/UserRepository"
import { Authentication } from "./api/Authentication"
import { LoginController } from "./api/LoginController"
import { PageController } from "./api/PageController"
import buildRouter from "./api/router"
import type { Router } from "./api/RouterBuilder"

export type App = {
  authentication: Authentication
  router: Router
}
export function buildApp(): App {
  const pageRepository = new PageRepository()
  const userRepository = new UserRepository()

  const authentication = new Authentication({ userRepository })

  const loginController = new LoginController({ userRepository })
  const pageController = new PageController({ authentication, pageRepository })

  const router = buildRouter({ loginController, pageController })

  return { authentication, router }
}