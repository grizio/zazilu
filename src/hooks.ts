import type { Incoming, Request, Response } from "@sveltejs/kit"
import { extractUser } from "$server/api/authentication"
import buildRouter from "$server/api/router"
import type { Context, Session } from "$model/context"
import type { Locals } from "$server/api/RouterBuilder"

export function getSession(request: Request<Locals>): Session {
  if (request.locals.authenticatedUser !== undefined) {
    return {
      authenticatedUser: {
        email: request.locals.authenticatedUser.email,
        role: request.locals.authenticatedUser.role
      }
    }
  } else {
    return {}
  }
}

const router = buildRouter()
export async function handle({ request, render }: { request: Request, render: (request: Request) => Promise<Response> }): Promise<Response> {
  request.locals.authenticatedUser = await extractUser(request)

  const response = router.process(request)
  if (response !== undefined) {
    return response
  } else {
    return render(request)
  }
}