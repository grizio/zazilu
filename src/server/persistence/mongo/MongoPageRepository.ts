import type { Collection } from "mongodb"
import type { Page } from "$model/Page"
import type { PageRepository } from "../PageRepository"
import type { MongoDb } from "./MongoDb"

type Dependencies = {
  mongoDb: MongoDb
}
export class MongoPageRepository implements PageRepository {
  private readonly mongoDb: MongoDb

  constructor({ mongoDb }: Dependencies) {
    this.mongoDb = mongoDb
  }

  get = async (key: string): Promise<Page | undefined> => {
    const collection = await this.getCollection()
    const result = await collection.findOne({ key })
    return result ?? undefined
  }

  getAll = async (): Promise<Array<Page>> => {
    const collection = await this.getCollection()
    return collection.find().toArray()
  }

  post = async (page: Page): Promise<void> => {
    const collection = await this.getCollection()
    await collection.insert(page)
  }

  put = async (page: Page): Promise<void> => {
    const collection = await this.getCollection()
    await collection.updateOne({ key: page.key }, { $set: page })
  }

  remove = async (key: string): Promise<void> => {
    const collection = await this.getCollection()
    await collection.remove({ key })
  }

  private getCollection = async (): Promise<Collection<Page>> => {
    return this.mongoDb.getDb().then(_ => _.collection("page"))
  }
}