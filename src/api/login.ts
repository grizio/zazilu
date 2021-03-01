import bcrypt from "bcrypt"
import { object } from "idonttrustlikethat"
import { app } from "~/app"
import { nonEmptyString } from "~/utils/validators"
import { badRequest, noContent, ok, Request, Response } from "./action"

const bodyValidation = object({
  email: nonEmptyString,
  password: nonEmptyString
})

export async function postLogin(request: Request): Promise<Response> {
  const body = bodyValidation.validate(request.body)

  if (body.ok) {
    const { email, password } = body.value
    const user = await app.userRepository.get(email)
    if (user !== undefined) {
      if (await bcrypt.compare(password, user.password)) {
        return ok({ email: user.email, role: user.role }, { cookies: { auth: user.email } })
      } else {
        return badRequest("Unknown user or password")
      }
    } else {
      return badRequest("Unknown user or password")
    }
  } else {
    return badRequest("Expected email and password")
  }
}

export async function postLogout(req: Request): Promise<Response> {
  return noContent({ cookies: { auth: null } })
}