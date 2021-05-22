import type { Page } from "$model/Page"
import { replace } from "$lib/utils/arrays"
import { badRequest, conflict, created, noContent, notFound, ok } from "./responses"
import type { Authentication } from "./Authentication"
import type { ActionRequest } from "./RouterBuilder"
import type { Response } from "@sveltejs/kit"
import type { PageRepository } from "$server/persistence/PageRepository"
import { pageActionValidator, processPageAction } from "$server/service/PageActionService"

type Dependencies = {
  authentication: Authentication
  pageRepository: PageRepository
}
export class PageController {
  private readonly authentication: Authentication
  private readonly pageRepository: PageRepository

  constructor({ authentication, pageRepository }: Dependencies) {
    this.authentication = authentication
    this.pageRepository = pageRepository
  }

  getAllPages = async (request: ActionRequest): Promise<Response> => {
    return this.authentication.onAuthenticatedAdmin(request, async () => {
      const pages = await this.pageRepository.getAll()
      return ok(pages)
    })
  }

  getPage = async (request: ActionRequest<{ slug: string }>): Promise<Response> => {
    const pageContent = await this.pageRepository.get(request.params.slug)

    if (pageContent === undefined) {
      return notFound({ message: "Not found" })
    } else {
      return ok(pageContent)
    }
  }

  postPage = async (request: ActionRequest<{ slug: string }, Page>): Promise<Response> => {
    return await this.authentication.onAuthenticatedAdmin(request, async () => {
      if (request.body.key !== request.params.slug) {
        return badRequest({ message: "key in body and slug in path do not match", path: "key" })
      } else {
        const existingPage = await this.pageRepository.get(request.body.key)
        if (existingPage !== undefined) {
          return conflict({ message: "The page already exist" })
        } else {
          await this.pageRepository.post(request.body)
          return created(request.body)
        }
      }
    })
  }

  putPage = async (request: ActionRequest<{ slug: string }, Page>): Promise<Response> => {
    return await this.authentication.onAuthenticatedAdmin(request, async () => {
      if (request.body.key !== request.params.slug) {
        return badRequest({ message: "key in body and slug in path do not match", path: "key" })
      } else {
        const existingPage = await this.pageRepository.get(request.params.slug)
        if (existingPage === undefined) {
          return notFound({ message: `Not found` })
        } else {
          await this.pageRepository.put(request.body)
          return ok(request.body)
        }
      }
    })
  }

  deletePage = async (request: ActionRequest<{ slug: string }>): Promise<Response> => {
    return await this.authentication.onAuthenticatedAdmin(request, async () => {
      if (request.params.slug === "home") {
        return badRequest({ message: "You cannot remove the homepage" })
      } else {
        await this.pageRepository.remove(request.params.slug)
        return noContent()
      }
    })
  }

  postAction = async (request: ActionRequest<{ slug: string }>): Promise<Response> => {
    const validation = pageActionValidator.validate(request.body)
    if (!validation.ok) {
      return badRequest(validation.errors)
    } else {
      const page = await this.pageRepository.get(request.params.slug)
      if (page === undefined) {
        return notFound({ message: "Page not found" })
      } else {
        const blocIndex = page.content.findIndex(_ => _.id === validation.value.bloc)
        if (blocIndex === -1) {
          return notFound({ message: "Bloc not found" })
        } else {
          const result = processPageAction(validation.value, page.content[blocIndex])
          if (!result.ok) {
            return badRequest(result.errors)
          } else {
            const updatedPage = {
              ...page,
              content: replace(page.content, blocIndex, result.value)
            }
            await this.pageRepository.put(updatedPage)
            return ok(updatedPage)
          }
        }
      }
    }
  }
}