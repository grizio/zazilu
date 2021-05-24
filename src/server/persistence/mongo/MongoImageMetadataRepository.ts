import { omit, removeUndefinedKeys } from "$lib/utils/objects"
import type { ImageMetadata } from "$model/Image"
import type { Collection } from "mongodb"
import mongodb from "mongodb"
import type { ImageMetadataRepository, SearchParameters, SearchResult } from "../ImageMetadataRepository"
import type { MongoDb } from "./MongoDb"

type Dependencies = {
  mongoDb: MongoDb
}
export class MongoImageMetadataRepository implements ImageMetadataRepository {
  private readonly mongoDb: MongoDb

  constructor({ mongoDb }: Dependencies) {
    this.mongoDb = mongoDb
  }

  get = async (key: string): Promise<ImageMetadata | undefined> => {
    const collection = await this.getCollection()
    const result = await collection.findOne({ key })
    return result ?? undefined
  }

  search = async ({ filename, nextSearchIdentifier }: SearchParameters): Promise<SearchResult> => {
    const collection = await this.getCollection()

    const filter = removeUndefinedKeys({
      _id: nextSearchIdentifier !== undefined ? { $gt: new mongodb.ObjectId(nextSearchIdentifier) } : undefined,
      filename: filename !== undefined ? new RegExp(`.*${filename}.*`, "gi") : undefined,
    })
    const elements = await collection.find(filter).limit(20).toArray()

    if (elements.length === 0) {
      return { elements: [] }
    } else {
      return {
        elements: elements.map(element => omit(element, "_id")),
        nextSearchIdentifier: elements[elements.length - 1]._id.toHexString(),
      }
    }
  }

  put = async (image: ImageMetadata): Promise<void> => {
    const collection = await this.getCollection()
    await collection.updateOne({ key: image.key }, { $set: image }, { upsert: true })
  }

  private getCollection = async (): Promise<Collection<ImageMetadata & { _id: mongodb.ObjectID }>> => {
    return this.mongoDb.getDb().then(_ => _.collection("imageMetadata"))
  }
}