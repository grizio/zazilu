export type User = {
  email: string
  password: string
  role: Role
}

export type Role = "user" | "admin"

export type AuthenticatedUser = {
  email: string
  role: Role
}