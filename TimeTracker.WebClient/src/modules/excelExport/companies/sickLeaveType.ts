import { User } from "../../users/graphQL/users.types"

export type SickLeaveType = {
    id: string,
    startDate: string,
    endDate: string,
    comment?: string,
    userId: string,
    createdAt: string,
    updatedAt: string,
    user: User
    files: string[]
}

export type SickLeaveFilter = {
    kind: SickLeaveFilterKind
}

export enum SickLeaveFilterKind {
    mine = "MINE",
    all = "ALL"
}