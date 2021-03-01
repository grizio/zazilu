import { app } from "~/app"
import type { Role, User } from "~/model/User"
import { forbidden, Request, Response, unauthenticated } from "./action"

export async function onAuthenticated(request: Request, process: (user: User) => Promise<Response>): Promise<Response> {
  const user = await extractUser(request)
  if (user !== undefined) {
    return await process(user)
  } else {
    return unauthenticated(undefined, { cookies: { auth: null } })
  }
}

export async function onAuthenticatedWithRole(request: Request, role: Role, process: (user: User) => Promise<Response>): Promise<Response> {
  return await onAuthenticated(request, async user => {
    if (user.role === role) {
      return await process(user)
    } else {
      return forbidden(undefined)
    }
  })
}

export async function onAuthenticatedAdmin(request: Request, process: (user: User) => Promise<Response>): Promise<Response> {
  return await onAuthenticatedWithRole(request, "admin", process)
}

export async function extractUser(request: Request): Promise<User | undefined> {
  const authCookie = request.signedCookies?.["auth"]
  if (authCookie !== undefined) {
    return await app.userRepository.get(authCookie)
  } else {
    return undefined
  }
}