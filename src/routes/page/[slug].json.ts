import { app } from "../../app"
import type { AppResponse, GetRequest, PutRequest } from "../types"
import { pageValidation } from "../../model/validation/PageValidation"

type Params = { slug: string }

export async function get(req: GetRequest<Params>, res: AppResponse, next: () => void) {
  const pageContent = await app.pageRepository.get(req.params.slug)

  if (pageContent !== undefined) {
    res
      .writeHead(200, { "Content-Type": "application/json" })
      .end(JSON.stringify(pageContent))
  } else {
    res
      .writeHead(404, { "Content-Type": "application/json" })
      .end(JSON.stringify({ message: `Not found` }))
  }
}

export async function put(req: PutRequest<Params>, res: AppResponse, next: () => void) {
  console.log(req.body)
  const validation = pageValidation.validate(req.body)
  if (validation.ok) {
    if (validation.value.key === req.params.slug) {
      const existingPage = await app.pageRepository.get(req.params.slug)

      if (existingPage !== undefined) {
        await app.pageRepository.put(validation.value)
        res
          .writeHead(200, { "Content-Type": "application/json" })
          .end(JSON.stringify(validation.value))
      } else {
        res
          .writeHead(404, { "Content-Type": "application/json" })
          .end(JSON.stringify({ message: `Not found` }))
      }
    } else {
      res
        .writeHead(400, { "Content-Type": "application/json" })
        .end(JSON.stringify({ message: "key in body and slug in path do not match", path: "key" }))
    }
  } else {
    res
      .writeHead(400, { "Content-Type": "application/json" })
      .end(JSON.stringify(validation.errors))
  }
}
