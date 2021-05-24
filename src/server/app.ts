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

import AWS from "aws-sdk"
import type { ImageRepository } from "./persistence/ImageRepository"
import { ObjectStorageImageRepository } from "./persistence/object-storage/ObjectStorageImageRepository"
import { ImageController } from "./api/ImageController"
import { ObjectStorage } from "./persistence/object-storage/ObjectStorage"
import { InMemoryImageRepository } from "./persistence/in-memory/InMemoryImageRepository"
import { ImageService } from "./service/ImageService"
import type { ImageMetadataRepository } from "./persistence/ImageMetadataRepository"
import { MongoImageMetadataRepository } from "./persistence/mongo/MongoImageMetadataRepository"
import { InMemoryImageMetadataRepository } from "./persistence/in-memory/InMemoryImageMetadataRepository"

export type App = {
  authentication: Authentication
  router: Router
}

export function buildApp(): App {
  const conf = loadConf()
  const { imageMetadataRepository, pageRepository, userRepository } = buildMongoOrInMemoryRepositories(conf)
  const { imageRepository } = buildObjectStorageRepositories(conf)

  const imageService = new ImageService({ imageMetadataRepository, imageRepository })

  const authentication = new Authentication({ userRepository })

  const loginController = new LoginController({ userRepository })
  const pageController = new PageController({ authentication, pageRepository })
  const imageController = new ImageController({ imageService })

  const router = buildRouter({ loginController, pageController, imageController })

  return { authentication, router }
}

type MongoOrInMemoryRepositories = {
  imageMetadataRepository: ImageMetadataRepository
  pageRepository: PageRepository
  userRepository: UserRepository
}
function buildMongoOrInMemoryRepositories(conf: Conf): MongoOrInMemoryRepositories {
  if (conf.database.type === "mongo") {
    const mongoDb = new MongoDb(conf.database)
    return {
      imageMetadataRepository: new MongoImageMetadataRepository({ mongoDb }),
      pageRepository: new MongoPageRepository({ mongoDb }),
      userRepository: new MongoUserRepository({ mongoDb }),
    }
  } else {
    return {
      imageMetadataRepository: new InMemoryImageMetadataRepository(),
      pageRepository: new InMemoryPageRepository(),
      userRepository: new InMemoryUserRepository(),
    }
  }
}

type ObjectStorageRepositories = {
  imageRepository: ImageRepository
}
function buildObjectStorageRepositories(conf: Conf): ObjectStorageRepositories {
  if (conf.fileStorage.type === "object-storage") {
    const objectStorage = new ObjectStorage({ conf: conf.fileStorage })
    return {
      imageRepository: new ObjectStorageImageRepository({ objectStorage })
    }
  } else {
    return {
      imageRepository: new InMemoryImageRepository()
    }
  }
}