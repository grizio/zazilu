import type { Response } from "@sveltejs/kit"
import type { ActionRequest } from "$server/api/RouterBuilder"
import type { ImageService } from "$server/service/ImageService"
import { created, notFound, ok } from "./responses"
import { randomUUID } from "crypto"

type Dependencies = {
  imageService: ImageService
}
export class ImageController {
  private readonly imageService: ImageService

  constructor({ imageService }: Dependencies) {
    this.imageService = imageService
  }

  get = async (request: ActionRequest<{ key: string }>): Promise<Response> => {
    const { key } = request.params
    const image = await this.imageService.get(key)
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

  search = async (request: ActionRequest<{}, { filename?: string }>): Promise<Response> => {
    const list = await this.imageService.search(request.query.filename ?? "")
    return ok(list)
  }

  upload = async (request: ActionRequest<{}, { filename: string, contentType: string }, string>): Promise<Response> => {
    const key = `${randomUUID()}_${request.query.filename}`
    await this.imageService.put({
      key: key,
      filename: request.query.filename,
      contentType: request.query.contentType,
      content: Buffer.from(request.request.body, "base64"),
    })
    return created(key)
  }
}
