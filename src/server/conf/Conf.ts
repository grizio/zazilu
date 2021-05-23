export type Conf = {
  database: DatabaseConf
  fileStorage: FileStorageConf
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

export type FileStorageConf = InMemoryFileStorageConf | ObjectStorageConf

export type InMemoryFileStorageConf = {
  type: "in-memory"
}

export type ObjectStorageConf = {
  type: "object-storage"
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
}