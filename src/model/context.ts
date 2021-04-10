import type { User } from "$model/User"

export type Context = {
  authenticatedUser?: User
}

export type Session = {
  authenticatedUser?: Pick<User, "email" | "role">
}
