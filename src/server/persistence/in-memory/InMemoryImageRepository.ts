import type { Image } from "$model/Image"
import type { ImageRepository } from "../ImageRepository"

export class InMemoryImageRepository implements ImageRepository {
  private inMemory: Map<string, Image> = new Map<string, Image>()

  get = async (key: string): Promise<Image | undefined> => {
    return this.inMemory.get(key)
  }

  list = async (): Promise<Array<string>> => {
    return Array.from(this.inMemory.keys())
  }

  put = async(image: Image): Promise<void> => {
    this.inMemory.set(image.key, image)
  }
}