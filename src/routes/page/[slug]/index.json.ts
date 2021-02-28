import { app } from "~/app"
import { pageValidation } from "~/model/validation/PageValidation"
import { onAuthenticatedAdmin } from "~/security/authentication"
import { badRequest, conflict, created, notFound, ok } from "~/utils/requests"
import type { AppResponse, GetRequest, PostRequest, PutRequest } from "~/utils/requests"

type Params = { slug: string }

export async function get(req: GetRequest<Params>, res: AppResponse) {
  const pageContent = await app.pageRepository.get(req.params.slug)

  if (pageContent !== undefined) {
    ok(res, pageContent)
  } else {
    notFound(res, { message: `Not found` })
  }
}

export async function post(req: PostRequest<Params>, res: AppResponse) {
  await onAuthenticatedAdmin(req, res, async () => {
    const validation = pageValidation.validate(req.body)
    if (validation.ok) {
      const page = validation.value
      if (page.key === req.params.slug) {
        const existingPage = await app.pageRepository.get(page.key)
        if (existingPage === undefined) {
          await app.pageRepository.post(page)
          created(res, page)
        } else {
          conflict(res, { message: "The page already exist" })
        }
      } else {
        badRequest(res, { message: "key in body and slug in path do not match", path: "key" })
      }
    } else {
      badRequest(res, validation.errors)
    }
  })
}

export async function put(req: PutRequest<Params>, res: AppResponse) {
  await onAuthenticatedAdmin(req, res, async () => {
    const validation = pageValidation.validate(req.body)
    if (validation.ok) {
      if (validation.value.key === req.params.slug) {
        const existingPage = await app.pageRepository.get(req.params.slug)

        if (existingPage !== undefined) {
          await app.pageRepository.put(validation.value)
          ok(res, validation.value)
        } else {
          notFound(res, { message: `Not found` })
        }
      } else {
        badRequest(res, { message: "key in body and slug in path do not match", path: "key" })
      }
    } else {
      badRequest(res, validation.errors)
    }
  })
}
