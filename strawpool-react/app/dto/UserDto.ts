import type { Role } from "./Role"

export type UserDto = {
    email: string,
    roles: Role[]
}