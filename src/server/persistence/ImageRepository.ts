import type { Image } from "$model/Image"

export interface ImageRepository {
  get(key: string): Promise<Image | undefined>
}