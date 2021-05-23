import type { Response } from "@sveltejs/kit"
import type { ActionRequest } from "$server/api/RouterBuilder"
import type { ImageRepository } from "$server/persistence/ImageRepository"
import { notFound, ok } from "./responses"

type Dependencies = {
  imageRepository: ImageRepository
}
export class ImageController {
  private readonly imageRepository: ImageRepository

  constructor({ imageRepository }: Dependencies) {
    this.imageRepository = imageRepository
  }

  get = async (request: ActionRequest<{ key: string }>): Promise<Response> => {
    const { key } = request.params
    const image = await this.imageRepository.get(key)
    if (image === undefined) {
      return notFound(undefined)
    } else {
      return ok(
        image.content,
        {
          headers: {
            "Content-Type": image.contentType,
            "Content-Length": image.contentLength?.toString(),
            "ETag": image.etag
          }
        }
      )
    }
  }
}
