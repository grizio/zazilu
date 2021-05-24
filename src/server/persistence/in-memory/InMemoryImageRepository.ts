import type { ImageObject } from "$model/Image"
import type { ImageRepository } from "../ImageRepository"

export class InMemoryImageRepository implements ImageRepository {
  private inMemory: Map<string, ImageObject> = new Map<string, ImageObject>()

  get = async (key: string): Promise<ImageObject | undefined> => {
    return this.inMemory.get(key)
  }

  put = async(image: ImageObject): Promise<void> => {
    this.inMemory.set(image.key, image)
  }
}