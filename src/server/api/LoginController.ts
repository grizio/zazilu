import type { Response } from "@sveltejs/kit"
import bcrypt from "bcrypt"
import { object } from "idonttrustlikethat"
import type { ActionRequest } from "$server/api/RouterBuilder"
import { nonEmptyString } from "$lib/utils/validators"
import { badRequest, noContent, ok } from "./responses"
import type { UserRepository } from "$server/persistence/UserRepository"

type Dependencies = {
  userRepository: UserRepository
}
export class LoginController {
  private readonly userRepository: UserRepository

  constructor({ userRepository }: Dependencies) {
    this.userRepository = userRepository
  }

  static loginBody = object({
    email: nonEmptyString,
    password: nonEmptyString
  })
  login = async (request: ActionRequest<{}, typeof LoginController.loginBody["T"]>): Promise<Response> => {
    const { email, password } = request.body
    const user = await this.userRepository.get(email)
    if (user === undefined) {
      return badRequest("Unknown user or password")
    } else if (await bcrypt.compare(password, user.password)) {
      return ok({ authenticatedUser: { email: user.email, role: user.role } }, { cookies: { auth: user.email } })
    } else {
      return badRequest("Unknown user or password")
    }
  }

  logout = async (request: ActionRequest): Promise<Response> => {
    return noContent({ cookies: { auth: null } })
  }
}
