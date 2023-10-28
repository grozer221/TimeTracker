import { Permission } from "../behaviour/enums/Permission";
import { Role } from "../behaviour/enums/Role";
import { store } from "../behaviour/store";

export const isAuthenticated = (): boolean => {
    return store.getState().auth.isAuth
}

export const isAdministrator = (): boolean => {
    const auth = store.getState().auth;
    return isAuthenticated() && (auth.authedUser?.role === Role.Administrator || auth.authedUser?.role === Role.SuperAdmin)
}

export const isHavePermission = (permissions: Permission[]): boolean => {
    const intersectedPermissions = store.getState().auth.authedUser?.permissions?.filter(p => permissions.includes(p));
    return JSON.stringify(intersectedPermissions) === JSON.stringify(permissions);
}

export const isAdministratorOrHavePermissions = (permissions: Permission[]): boolean => {
    return isAdministrator() || isHavePermission(permissions);
}