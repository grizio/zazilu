import type { User } from "$model/User"

export interface UserRepository {
  get(key: string): Promise<User | undefined>
}