import {Permission} from "../../../graphQL/enums/Permission";
import {Role} from "../../../graphQL/enums/Role";

export type User = {
    id: string,
    firstName: string,
    lastName: string,
    middleName: string,
    email: string,
    role: Role,
    permissions: Permission[],
    amountHoursPerMonth: number,
    createdAt: string,
    updatedAt: string,
}

export type UserFilter = {
    firstName?: string,
    lastName?: string,
    middleName?: string,
    email?: string,
    permissions?: Permission[]
    roles?: Role[]
}