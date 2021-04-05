import type { Response } from "@sveltejs/kit"
import bcrypt from "bcrypt"
import { object } from "idonttrustlikethat"
import { app } from "$lib/app"
import type { ActionRequest } from "$lib/api/RouterBuilder"
import { nonEmptyString } from "$lib/utils/validators"
import { badRequest, noContent, ok } from "./responses"

export const postLoginBody = object({
  email: nonEmptyString,
  password: nonEmptyString
})

export async function postLogin(request: ActionRequest<{}, typeof postLoginBody["T"]>): Promise<Response> {
  const { email, password } = request.body
  const user = await app.userRepository.get(email)
  if (user === undefined) {
    return badRequest("Unknown user or password")
  } else if (await bcrypt.compare(password, user.password)) {
    return ok({ authenticatedUser: { email: user.email, role: user.role } }, { cookies: { auth: user.email } })
  } else {
    return badRequest("Unknown user or password")
  }
}

export async function postLogout(request: ActionRequest): Promise<Response> {
  console.log("logout")
  return noContent({ cookies: { auth: null } })
}