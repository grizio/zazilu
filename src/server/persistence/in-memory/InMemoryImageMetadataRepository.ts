import { keepAfter, slice } from "$lib/utils/arrays"
import type { ImageMetadata } from "$model/Image"
import type { ImageMetadataRepository, SearchParameters, SearchResult } from "../ImageMetadataRepository"

export class InMemoryImageMetadataRepository implements ImageMetadataRepository {
  private inMemory: Map<string, ImageMetadata> = new Map<string, ImageMetadata>()

  get = async (key: string): Promise<ImageMetadata | undefined> => {
    return this.inMemory.get(key)
  }

  search = async ({ filename, nextSearchIdentifier }: SearchParameters): Promise<SearchResult> => {
    const allImages = Array.from(this.inMemory.values())

    const filteredResult = filename === undefined ? allImages : allImages.filter(image => image.filename.includes(filename))

    const skippedResult = nextSearchIdentifier === undefined ? filteredResult : keepAfter(filteredResult, _ => _.key === nextSearchIdentifier)

    const finalResult = slice(skippedResult, 0, 20)

    return {
      elements: finalResult,
      nextSearchIdentifier: finalResult.length === 0 ? undefined : finalResult[finalResult.length - 1].key
    }
  }

  put = async(image: ImageMetadata): Promise<void> => {
    this.inMemory.set(image.key, image)
  }
}