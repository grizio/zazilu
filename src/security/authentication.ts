import type { Role, User } from "../model/User"
import type { AppRequest, AppResponse } from "../routes/types"
import { app } from "../app"

export async function onAuthenticated(req: AppRequest, res: AppResponse, process: (user: User) => Promise<void>): Promise<void> {
  const user = await extractUser(req)
  if (user !== undefined) {
    await process(user)
  } else {
    res.cookie("auth", undefined, { signed: true })
    res
      .writeHead(401, "Unauthenticated")
      .end()
  }
}

export async function onAuthenticatedWithRole(req: AppRequest, res: AppResponse, role: Role, process: (user: User) => Promise<void>): Promise<void> {
  await onAuthenticated(req, res, async user => {
    if (user.role === role) {
      await process(user)
    } else {
      res
        .writeHead(403, "Forbidden")
        .end()
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