import { Permission } from "../../../behaviour/enums/Permission";
import { Role } from "../../../behaviour/enums/Role";

export type Claims = {
    id: string,
    email: string,
    permissions: Permission[]
    role: Role
}