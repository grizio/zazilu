import type { ImageMetadata } from "$model/Image"

export type SearchParameters = {
  filename?: string
  nextSearchIdentifier?: string
}
export type SearchResult = {
  elements: Array<ImageMetadata>
  nextSearchIdentifier?: string
}
export interface ImageMetadataRepository {
  get(key: string): Promise<ImageMetadata | undefined>

  search(parameters: SearchParameters): Promise<SearchResult>

  put(image: ImageMetadata): Promise<void>
}