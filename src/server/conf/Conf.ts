export type Conf = {
  database: DatabaseConf
}

export type DatabaseConf = InMemoryDatabaseConf | MongoDatabaseConf

export type InMemoryDatabaseConf = {
  type: "in-memory"
}

export type MongoDatabaseConf = {
  type: "mongo"
  host: string
  port: number
  username: string
  password: string
  database: string
}