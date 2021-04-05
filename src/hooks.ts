import type { Incoming, Request, Response } from "@sveltejs/kit"
import type { User } from "$lib/model/User"
import { extractUser } from "./lib/api/authentication"
import buildRouter from "$lib/api/router"

export type Context = {
  authenticatedUser?: User
}

export type Session = {
  authenticatedUser?: Pick<User, "email" | "role">
}

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
export async function handle(request: Request<Context, Session>, render: (request: Request<Context, Session>) => Promise<Response>): Promise<Response> {
  console.log("handle", request.method, request.path)
  const response = router.process(request)
  if (response !== undefined) {
    return response
  } else {
    return render(request)
  }
}