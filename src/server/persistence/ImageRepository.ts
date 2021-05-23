import type { Image } from "$model/Image"

export interface ImageRepository {
  get(key: string): Promise<Image | undefined>

  list(): Promise<Array<string>>

  put(image: Image): Promise<void>
}