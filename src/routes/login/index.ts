import bcrypt from "bcrypt"
import { object } from "idonttrustlikethat"
import { app } from "~/app"
import type { AppResponse, GetRequest } from "~/utils/requests"
import { badRequest, ok } from "~/utils/requests"
import { nonEmptyString } from "~/utils/validators"

const bodyValidation = object({
  email: nonEmptyString,
  password: nonEmptyString
})

export async function post(req: GetRequest, res: AppResponse) {
  const body = bodyValidation.validate(req.body)

  if (body.ok) {
    const { email, password } = body.value
    const user = await app.userRepository.get(email)
    if (user !== undefined) {
      if (await bcrypt.compare(password, user.password)) {
        ok(res, { email: user.email, role: user.role }, { cookies: { auth: user.email } })
      } else {
        badRequest(res, "Unknown user or password")
      }
    } else {
      badRequest(res, "Unknown user or password")
    }
  } else {
    badRequest(res, "Expected email and password")
  }
}
