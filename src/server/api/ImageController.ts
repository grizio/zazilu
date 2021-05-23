import type { Response } from "@sveltejs/kit"
import type { ActionRequest } from "$server/api/RouterBuilder"
import type { ImageRepository } from "$server/persistence/ImageRepository"
import { created, notFound, ok } from "./responses"
import { randomUUID } from "crypto"

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

  list = async (_request: ActionRequest): Promise<Response> => {
    const list = await this.imageRepository.list()
    return ok(list)
  }

  upload = async (request: ActionRequest<{}, { filename: string, contentType: string }, string>): Promise<Response> => {
    const key = `${randomUUID()}_${request.query.filename}`
    await this.imageRepository.put({
      key: key,
      contentType: request.query.contentType,
      content: Buffer.from(request.request.body, "base64"),
    })
    return created(key)
  }
}
