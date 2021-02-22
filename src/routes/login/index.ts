import bcrypt from "bcrypt"
import { app } from "../../app"
import type { AppResponse, GetRequest } from "../types"

export async function post(req: GetRequest, res: AppResponse, next: () => void) {
  // @ts-ignore
  const { email, password } = req.body

  if (email !== undefined && password !== undefined) {
    const user = await app.userRepository.get(email)
    if (user !== undefined) {
      if (await bcrypt.compare(password, user.password)) {
        res
          .cookie("auth", user.email, { signed: true })
          .writeHead(200)
          .end(JSON.stringify({ email: user.email, role: user.role }))
      } else {
        res
          .writeHead(400, { "Content-Type": "application/json" })
          .end(JSON.stringify("Unknown user or password"))
      }
    } else {
      res
        .writeHead(400, { "Content-Type": "application/json" })
        .end(JSON.stringify("Unknown user or password"))
    }
  } else {
    res
      .writeHead(400, { "Content-Type": "application/json" })
      .end(JSON.stringify("Expected email and password"))
  }
}
