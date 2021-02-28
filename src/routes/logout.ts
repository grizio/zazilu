import { AppResponse, GetRequest, noContent } from "~/utils/requests"

export async function post(req: GetRequest, res: AppResponse) {
  noContent(res, { cookies: { auth: null } })
}
