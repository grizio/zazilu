import type { Db } from "mongodb"
import mongoDb from "mongodb"
import type { MongoDatabaseConf } from "$server/conf/Conf"

export class MongoDb {
  private readonly db: Promise<Db>

  constructor(conf: MongoDatabaseConf) {
    this.db = mongoDb.MongoClient.connect(
      `mongodb://${conf.host}:${conf.port}`,
      {
        auth: {
          user: conf.username,
          password: conf.password
        },
        useUnifiedTopology: true
      }
    )
      .then(mongoClient => mongoClient.db(conf.database))
  }

  getDb = async (): Promise<Db> => this.db
}