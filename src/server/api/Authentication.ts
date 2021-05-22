import type { Request, Response } from "@sveltejs/kit"
import { unsignCookie } from "$lib/utils/crypto"
import type { Role, User } from "$model/User"
import { forbidden, unauthenticated } from "./responses"
import type { ActionRequest } from "./RouterBuilder"
import type { UserRepository } from "$server/persistence/UserRepository"

type Dependencies = {
  userRepository: UserRepository
}
export class Authentication {
  private readonly userRepository: UserRepository

  constructor({ userRepository }: Dependencies) {
    this.userRepository = userRepository
  }

  onAuthenticated = async (request: ActionRequest, process: (user: User) => Promise<Response>): Promise<Response> => {
    if (request.request.locals.authenticatedUser !== undefined) {
      return await process(request.request.locals.authenticatedUser)
    } else {
      return unauthenticated(undefined, { cookies: { auth: null } })
    }
  }

  onAuthenticatedWithRole = async (request: ActionRequest, role: Role, process: (user: User) => Promise<Response>): Promise<Response> => {
    return await this.onAuthenticated(request, async user => {
      if (user.role === role) {
        return await process(user)
      } else {
        return forbidden(undefined)
      }
    })
  }

  onAuthenticatedAdmin = async (request: ActionRequest, process: (user: User) => Promise<Response>): Promise<Response> => {
    return await this.onAuthenticatedWithRole(request, "admin", process)
  }

  extractUser = async (request: Request): Promise<User | undefined> => {
    const cookieHeader = request.headers["cookie"]
    if (cookieHeader !== undefined) {
      const cookies = this.parseCookie(cookieHeader)
      const signedAuthCookie = cookies["auth"]
      if (signedAuthCookie !== undefined) {
        const authCookie = unsignCookie(signedAuthCookie)
        if (authCookie !== undefined) {
          return await this.userRepository.get(authCookie)
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

  private parseCookie = (cookie: string): Record<string, string> => {
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
}
