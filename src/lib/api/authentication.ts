import type { Incoming, Request, Response } from "@sveltejs/kit"
import { app } from "$lib/app"
import { unsignCookie } from "$lib/utils/crypto"
import type { Role, User } from "$lib/model/User"
import { forbidden, unauthenticated } from "./responses"
import type { ActionRequest } from "./RouterBuilder"

export async function onAuthenticated(request: ActionRequest, process: (user: User) => Promise<Response>): Promise<Response> {
  if (request.request.context.authenticatedUser !== undefined) {
    return await process(request.request.context.authenticatedUser)
  } else {
    return unauthenticated(undefined, { cookies: { auth: null } })
  }
}

export async function onAuthenticatedWithRole(request: ActionRequest, role: Role, process: (user: User) => Promise<Response>): Promise<Response> {
  return await onAuthenticated(request, async user => {
    if (user.role === role) {
      return await process(user)
    } else {
      return forbidden(undefined)
    }
  })
}

export async function onAuthenticatedAdmin(request: ActionRequest, process: (user: User) => Promise<Response>): Promise<Response> {
  return await onAuthenticatedWithRole(request, "admin", process)
}

export async function extractUser(incoming: Incoming): Promise<User | undefined> {
  const cookieHeader = incoming.headers["cookie"]
  if (cookieHeader !== undefined) {
    const cookies = parseCookie(cookieHeader)
    const signedAuthCookie = cookies["auth"]
    if (signedAuthCookie !== undefined) {
      const authCookie = unsignCookie(signedAuthCookie)
      if (authCookie !== undefined) {
        return await app.userRepository.get(authCookie)
      } else {
        return undefined
      }
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}

function parseCookie(cookie: string): Record<string, string> {
  const result: Record<string, string> = {}

  cookie.split(";").forEach(pair => {
    const indexOfEqual = pair.indexOf("=")
    if (indexOfEqual !== -1) {
      const key = pair.substring(0, indexOfEqual).trim()
      const value = pair.substring(indexOfEqual + 1).trim()
      if (key.length > 0 && value.length > 0) {
        if (value[0] === '"' && value[value.length - 1] === '"') {
          result[key] = decodeURIComponent(value.substring(1, value.length - 1))
        } else {
          result[key] = decodeURIComponent(value)
        }
      }
    }
  })

  return result
}