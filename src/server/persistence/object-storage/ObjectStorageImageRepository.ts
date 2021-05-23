import type { Image } from "$model/Image"
import type { ImageRepository } from "../ImageRepository"
import type { ObjectStorage } from "./ObjectStorage"
import { isDefined } from "$lib/utils/arrays"

type Dependencies = {
  objectStorage: ObjectStorage
}
export class ObjectStorageImageRepository implements ImageRepository {
  private readonly objectStorage: ObjectStorage

  constructor({ objectStorage }: Dependencies) {
    this.objectStorage = objectStorage
  }

  get = async (key: string): Promise<Image | undefined> => {
    const object = await this.objectStorage.getObject(key)
    if (object.Body !== undefined) {
      return {
        key: key,
        contentType: object.ContentType,
        contentLength: object.ContentLength,
        etag: object.ETag,
        content: object.Body as Buffer,
      }
    } else {
      return undefined
    }
  }

  list = async (): Promise<Array<string>> => {
    const list = await this.objectStorage.list()
    if (list.Contents !== undefined) {
      return list.Contents.map(_ => _.Key).filter(isDefined)
    } else {
      return []
    }
  }

  put = async(image: Image): Promise<void> => {
    this.objectStorage.putObject({
      Key: image.key,
      ContentType: image.contentType,
      //ContentLength: image.contentLength,
      Body: image.content,
    })
  }
}