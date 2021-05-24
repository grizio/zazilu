import type { ImageMetadata } from "$model/Image"

export interface ImageMetadataRepository {
  get(key: string): Promise<ImageMetadata | undefined>

  search(filename: string): Promise<Array<ImageMetadata>>

  put(image: ImageMetadata): Promise<void>
}