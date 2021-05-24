import type { ImageMetadata } from "$model/Image"
import type { Collection } from "mongodb"
import type { ImageMetadataRepository } from "../ImageMetadataRepository"
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

  search = async (filename: string): Promise<Array<ImageMetadata>> => {
    const collection = await this.getCollection()
    if (filename === "") {
      return collection.find().toArray()
    } else {
      return collection.find({ filename: new RegExp(`.*${filename}.*`, "gi") }).toArray()
    }
  }

  put = async (image: ImageMetadata): Promise<void> => {
    const collection = await this.getCollection()
    await collection.updateOne({ key: image.key }, { $set: image }, { upsert: true })
  }

  private getCollection = async (): Promise<Collection<ImageMetadata>> => {
    return this.mongoDb.getDb().then(_ => _.collection("imageMetadata"))
  }
}