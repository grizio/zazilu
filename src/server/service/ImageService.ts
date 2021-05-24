import type { Image, ImageMetadata } from "$model/Image"
import type { ImageRepository } from "$server/persistence/ImageRepository"
import type { ImageMetadataRepository } from "$server/persistence/ImageMetadataRepository"
import { ManagedBlockchain } from "aws-sdk"

type Dependencies = {
  imageRepository: ImageRepository
  imageMetadataRepository: ImageMetadataRepository
}
export class ImageService {
  private readonly imageRepository: ImageRepository
  private readonly imageMetadataRepository: ImageMetadataRepository

  constructor({ imageRepository, imageMetadataRepository }: Dependencies) {
    this.imageRepository = imageRepository
    this.imageMetadataRepository = imageMetadataRepository
  }

  get = async (key: string): Promise<Image | undefined> => {
    const [imageMetadata, imageObject] = await Promise.all([
      this.imageMetadataRepository.get(key),
      this.imageRepository.get(key)
    ])
    if (imageMetadata !== undefined && imageObject !== undefined) {
      return { ...imageMetadata, ...imageObject }
    } else if (imageMetadata !== undefined) {
      console.warn(`Image object is undefined while image metadata is not for key "${key}".`)
      return undefined
    } else if (imageObject !== undefined) {
      console.warn(`Image metadata is undefined while image object is not for key "${key}".`)
      return undefined
    } else {
      return undefined
    }
  }

  search = async (filename: string): Promise<Array<ImageMetadata>> => {
    return this.imageMetadataRepository.search(filename)
  }

  put = async (image: Image): Promise<void> => {
    await this.imageRepository.put({
      key: image.key,
      contentType: image.contentType,
      contentLength: image.contentLength,
      etag: image.etag,
      content: image.content,
    })
    await this.imageMetadataRepository.put({
      key: image.key,
      filename: image.filename,
    })
  }
}