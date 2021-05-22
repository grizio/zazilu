import { literal, object, union, Validator } from "idonttrustlikethat"
import { nonEmptyString, permissiveInt } from "$lib/utils/validators"
import type { Conf, DatabaseConf, InMemoryDatabaseConf, MongoDatabaseConf } from "./Conf"

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

export const databaseConf: Validator<DatabaseConf> = union(inMemoryDatabaseConfValidator, mongoDatabaseConfValidator)

export const confValidator: Validator<Conf> = object({
  database: databaseConf
})