import { app } from "../../app"
import type { AppRequest, AppResponse } from "../types"
import { onAuthenticated } from "../../security/authentication"

export async function get(req: AppRequest, res: AppResponse, next: () => void) {
  await onAuthenticated(req, res, async (user) => {
    const pages = await app.pageRepository.getAll()
    res
      .writeHead(200, { "Content-Type": "application/json" })
      .end(JSON.stringify(pages))
  })
}
