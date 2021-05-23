import { literal, object, union, Validator } from "idonttrustlikethat"
import { nonEmptyString, permissiveInt } from "$lib/utils/validators"
import type { Conf, DatabaseConf, FileStorageConf, InMemoryDatabaseConf, InMemoryFileStorageConf, MongoDatabaseConf, ObjectStorageConf } from "./Conf"

export const inMemoryDatabaseConfValidator: Validator<InMemoryDatabaseConf> = object({
  type: literal("in-memory")
})

export const mongoDatabaseConfValidator: Validator<MongoDatabaseConf> = object({
  type: literal("mongo"),
  host: nonEmptyString,
  port: permissiveInt,
  username: nonEmptyString,
  password: nonEmptyString,
  database: nonEmptyString,
})

export const databaseConfValidator: Validator<DatabaseConf> = union(inMemoryDatabaseConfValidator, mongoDatabaseConfValidator)

export const inMemoryFileStorageConfValidator: Validator<InMemoryFileStorageConf> = object({
  type: literal("in-memory")
})

export const objectStorageConfValidator: Validator<ObjectStorageConf> = object({
  type: literal("object-storage"),
    endpoint: nonEmptyString,
    accessKeyId: nonEmptyString,
    secretAccessKey: nonEmptyString,
    bucket: nonEmptyString,
})

export const fileStorageConfValidator: Validator<FileStorageConf> = union(inMemoryFileStorageConfValidator, objectStorageConfValidator)

export const confValidator: Validator<Conf> = object({
  database: databaseConfValidator,
  fileStorage: fileStorageConfValidator,
})