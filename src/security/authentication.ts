import { app } from "~/app"
import type { Role, User } from "~/model/User"
import type { AppRequest, AppResponse } from "~/utils/requests"
import { forbidden, unauthenticated } from "~/utils/requests"

export async function onAuthenticated(req: AppRequest, res: AppResponse, process: (user: User) => Promise<void>): Promise<void> {
  const user = await extractUser(req)
  if (user !== undefined) {
    await process(user)
  } else {
    unauthenticated(res, undefined, { cookies: { auth: null } })
  }
}

export async function onAuthenticatedWithRole(req: AppRequest, res: AppResponse, role: Role, process: (user: User) => Promise<void>): Promise<void> {
  await onAuthenticated(req, res, async user => {
    if (user.role === role) {
      await process(user)
    } else {
      forbidden(res, undefined)
    }
  })
}

export async function onAuthenticatedAdmin(req: AppRequest, res: AppResponse, process: (user: User) => Promise<void>): Promise<void> {
  await onAuthenticatedWithRole(req, res, "admin", process)
}

export async function extractUser(req: AppRequest): Promise<User | undefined> {
  const authCookie = req.signedCookies?.["auth"]
  if (authCookie !== undefined) {
    return await app.userRepository.get(authCookie)
  } else {
    return undefined
  }
}