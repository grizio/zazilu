import { app } from "~/app"
import { onAuthenticated } from "~/security/authentication"
import type { AppRequest, AppResponse } from "~/utils/requests"
import { ok } from "~/utils/requests"

export async function get(req: AppRequest, res: AppResponse, next: () => void) {
  await onAuthenticated(req, res, async (user) => {
    const pages = await app.pageRepository.getAll()
    ok(res, pages)
  })
}
