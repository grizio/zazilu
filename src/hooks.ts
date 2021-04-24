import type { Incoming, Request, Response } from "@sveltejs/kit"
import { extractUser } from "$server/api/authentication"
import buildRouter from "$server/api/router"
import type { Context, Session } from "$model/context"

export async function getContext(incoming: Incoming): Promise<Context> {
  const user = await extractUser(incoming)
  if (user !== undefined) {
    return { authenticatedUser: user }
  } else {
    return {}
  }
}

export function getSession({ context }: { context: Context }): Session {
  if (context.authenticatedUser !== undefined) {
    return {
      authenticatedUser: {
        email: context.authenticatedUser.email,
        role: context.authenticatedUser.role
      }
    }
  } else {
    return {}
  }
}

const router = buildRouter()
export async function handle({ request, render }: { request: Request<Context, Session>, render: (request: Request<Context, Session>) => Promise<Response> }): Promise<Response> {
  const response = router.process(request)
  if (response !== undefined) {
    return response
  } else {
    return render(request)
  }
}