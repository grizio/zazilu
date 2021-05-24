import type { ImageMetadata } from "$model/Image"
import type { ImageMetadataRepository } from "../ImageMetadataRepository"

export class InMemoryImageMetadataRepository implements ImageMetadataRepository {
  private inMemory: Map<string, ImageMetadata> = new Map<string, ImageMetadata>()

  get = async (key: string): Promise<ImageMetadata | undefined> => {
    return this.inMemory.get(key)
  }

  search = async (filename: string): Promise<Array<ImageMetadata>> => {
    const lowerCaseFilename = filename.toLocaleLowerCase()
    return Array.from(this.inMemory.values())
      .filter(_ => _.filename.toLocaleLowerCase().includes(lowerCaseFilename))
  }

  put = async(image: ImageMetadata): Promise<void> => {
    this.inMemory.set(image.key, image)
  }
}