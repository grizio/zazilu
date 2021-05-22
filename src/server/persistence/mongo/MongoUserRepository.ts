import type { Collection } from "mongodb"
import type { User } from "$model/User"
import type { UserRepository } from "../UserRepository"
import type { MongoDb } from "./MongoDb"

type Dependencies = {
  mongoDb: MongoDb
}
export class MongoUserRepository implements UserRepository {
  private readonly mongoDb: MongoDb

  constructor({ mongoDb }: Dependencies) {
    this.mongoDb = mongoDb
  }

  get = async (email: string): Promise<User | undefined> => {
    const collection = await this.getCollection()
    const result = await collection.findOne({ email })
    return result ?? undefined
  }

  private getCollection = async (): Promise<Collection<User>> => {
    return this.mongoDb.getDb().then(_ => _.collection("user"))
  }
}