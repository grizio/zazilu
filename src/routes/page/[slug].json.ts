import type { SapperRequest, SapperResponse } from "@sapper/server"
import { app } from "../../app"

export async function get(req: SapperRequest, res: SapperResponse, next: () => void) {
  const { slug } = req.params

  const pageContent = await app.pageRepository.get(slug)

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
