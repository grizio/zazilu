import type { Request, Response } from "@sveltejs/kit"
import { buildApp } from "$server/app"
import type { Locals } from "$server/api/RouterBuilder"
import type { Session } from "$model/context"
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders"

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

const { authentication, router } = buildApp()
export async function handle({ request, render }: { request: Request, render: (request: Request) => Promise<Response> }): Promise<Response> {
  request.locals.authenticatedUser = await authentication.extractUser(request)

  const response = router.process(request)
  if (response !== undefined) {
    return response
  } else {
    return render(request)
  }
}