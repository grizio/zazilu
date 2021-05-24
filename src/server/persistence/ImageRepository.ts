import type { ImageObject } from "$model/Image"

export interface ImageRepository {
  get(key: string): Promise<ImageObject | undefined>

  put(image: ImageObject): Promise<void>
}