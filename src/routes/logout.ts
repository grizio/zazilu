import type { GetRequest, AppResponse } from "~/routes/types"

export async function post(req: GetRequest, res: AppResponse, next: () => void) {
  res
    .clearCookie("auth")
    .writeHead(204)
    .end()
}
