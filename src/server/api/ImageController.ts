import type { Response } from "@sveltejs/kit"
import type { ActionRequest } from "$server/api/RouterBuilder"
import type { ImageService } from "$server/service/ImageService"
import { created, notFound, ok } from "./responses"
import { randomUUID } from "crypto"
import { object, string } from "idonttrustlikethat"
import { buildUrl } from "$lib/utils/url"

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

  static searchQuery = object({
    filename: string.optional(),
    next: string.optional()
  })
  search = async (request: ActionRequest<{}, typeof ImageController.searchQuery["T"]>): Promise<Response> => {
    const result = await this.imageService.search({ filename: request.query.filename, nextSearchIdentifier: request.query.next })
    return ok({
      elements: result.elements,
      next: result.next !== undefined ? buildUrl("/images", { filename: request.query.filename, next: result.next }) : undefined,
    })
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
