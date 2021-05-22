import type { User } from "$model/User"
import type { UserRepository } from "../UserRepository"

const defaultAdmin: User = {
  email: "admin@admin.test",
  // "password"
  password: "$2b$12$BEgv6KJbbYsqFiiBFpbn1.DzldNCfAXLitK.oU5b46RkTcE1ULbw.",
  role: "admin",
}

export class InMemoryUserRepository implements UserRepository {
  private inMemory: Map<string, User> = new Map<string, User>([
    [defaultAdmin.email, defaultAdmin]
  ])

  get = async (key: string): Promise<User | undefined> => {
    return this.inMemory.get(key)
  }
}