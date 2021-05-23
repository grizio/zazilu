import type { Image } from "$model/Image"
import type { ImageRepository } from "../ImageRepository"

export class InMemoryImageRepository implements ImageRepository {
  private inMemory: Map<string, Image> = new Map<string, Image>()

  get = async (key: string): Promise<Image | undefined> => {
    return this.inMemory.get(key)
  }
}