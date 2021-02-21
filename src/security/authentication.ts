import type { User } from "../model/User"
import type { AppResponse, AppRequest } from "../routes/types"
import { app } from "../app"

export async function onAuthenticated(req: AppRequest, res: AppResponse, process: (user: User) => void): Promise<void> {
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

export async function extractUser(req: AppRequest): Promise<User | undefined> {
  const authCookie = req.signedCookies?.["auth"]
  if (authCookie !== undefined) {
    return await app.userRepository.get(authCookie)
  } else {
    return undefined
  }
}