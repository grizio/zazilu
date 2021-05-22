import type { Conf } from "./conf/Conf"
import { loadConf } from "./conf/confLoader"

import { Authentication } from "./api/Authentication"
import { LoginController } from "./api/LoginController"
import { PageController } from "./api/PageController"
import type { Router } from "./api/RouterBuilder"
import buildRouter from "./api/router"

import type { PageRepository } from "./persistence/PageRepository"
import type { UserRepository } from "./persistence/UserRepository"

import { InMemoryPageRepository } from "./persistence/in-memory/InMemoryPageRepository"
import { InMemoryUserRepository } from "./persistence/in-memory/InMemoryUserRepository"

import { MongoPageRepository } from "./persistence/mongo/MongoPageRepository"
import { MongoUserRepository } from "./persistence/mongo/MongoUserRepository"
import { MongoDb } from "./persistence/mongo/MongoDb"

export type App = {
  authentication: Authentication
  router: Router
}

export function buildApp(): App {
  const conf = loadConf()
  const { userRepository, pageRepository } = buildRepositories(conf)

  const authentication = new Authentication({ userRepository })

  const loginController = new LoginController({ userRepository })
  const pageController = new PageController({ authentication, pageRepository })

  const router = buildRouter({ loginController, pageController })

  return { authentication, router }
}

type Repositories = {
  pageRepository: PageRepository,
  userRepository: UserRepository
}
function buildRepositories(conf: Conf): Repositories {
  if (conf.database.type === "mongo") {
    const mongoDb = new MongoDb(conf.database)
    return {
      pageRepository: new MongoPageRepository({ mongoDb }),
      userRepository: new MongoUserRepository({ mongoDb }),
    }
  } else {
    return {
      pageRepository: new InMemoryPageRepository(),
      userRepository: new InMemoryUserRepository(),
    }
  }
}