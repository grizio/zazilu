import type { Conf } from "./Conf"
import { confValidator } from "./confValidator"
import dotenv from "dotenv"

export function loadConf(): Conf {
  dotenv.config()

  const validation = confValidator.validate({
    database: loadDatabaseConf(),
    fileStorage: loadFileStorageConf(),
  })

  if (validation.ok) {
    return validation.value
  } else {
    throw new Error(JSON.stringify(validation.errors))
  }
}

function loadDatabaseConf(): unknown {
  if (process.env["DATABASE_TYPE"] === "mongo") {
    return {
      type: "mongo",
      host: process.env["DATABASE_HOST"],
      port: process.env["DATABASE_PORT"],
      username: process.env["DATABASE_USERNAME"],
      password: process.env["DATABASE_PASSWORD"],
      database: process.env["DATABASE_DATABASE"],
    }
  } else {
    return {
      type: process.env["DATABASE_TYPE"] ?? "in-memory",
    }
  }
}

function loadFileStorageConf(): unknown {
  if (process.env["FILE_STORAGE_TYPE"] === "object-storage") {
    return {
      type: "object-storage",
      endpoint: process.env["FILE_STORAGE_ENDPOINT"],
      accessKeyId: process.env["FILE_STORAGE_ACCESS_KEY_ID"],
      secretAccessKey: process.env["FILE_STORAGE_SECRET_ACCESS_KEY"],
      bucket: process.env["FILE_STORAGE_BUCKET"],
    }
  } else {
    return {
      type: process.env["FILE_STORAGE_TYPE"] ?? "in-memory",
    }
  }
}