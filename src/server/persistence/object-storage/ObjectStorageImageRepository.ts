import type { ImageObject } from "$model/Image"
import type { ImageRepository } from "../ImageRepository"
import type { ObjectStorage } from "./ObjectStorage"

type Dependencies = {
  objectStorage: ObjectStorage
}
export class ObjectStorageImageRepository implements ImageRepository {
  private readonly objectStorage: ObjectStorage

  constructor({ objectStorage }: Dependencies) {
    this.objectStorage = objectStorage
  }

  get = async (key: string): Promise<ImageObject | undefined> => {
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

  put = async(image: ImageObject): Promise<void> => {
    this.objectStorage.putObject({
      Key: image.key,
      ContentType: image.contentType,
      Body: image.content,
    })
  }
}