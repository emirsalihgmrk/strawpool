import type { PollType } from "~/components/domain/PollType"
import type { OptionDto } from "./OptionDto"
import type { UserDto } from "./UserDto"

export type PollDto = {
    id: string | null,
    title: string,
    description: string | null,
    pollType: PollType,
    options: OptionDto[],
    user: UserDto | null,
    anonymousId: string | null
}