import { combineEpics, Epic, ofType } from "redux-observable";
import { RootState } from "../../../behaviour/store";
import { catchError, endWith, from, mergeMap, of, startWith } from "rxjs";
import { authActions } from "./auth.slice";
import {
    AUTH_CHANGE_PASSWORD_MUTATION, AUTH_LOG_IN_GOOGLE_MUTATION,
    AUTH_LOG_IN_MUTATION,
    AUTH_LOG_OUT_MUTATION,
    AUTH_REQUEST_RESET_PASSWORD_MUTATION,
    AUTH_RESET_PASSWORD_MUTATION,
    AuthChangePasswordData,
    AuthChangePasswordVars,
    AuthLoginData, AuthLoginGoogleData,
    AuthLoginVars,
    AuthRequestResetData,
    AuthRequestResetVars,
    AuthResetData,
    AuthResetVars
} from "../graphQL/auth.mutations";
import { AUTH_ME_QUERY, AuthMeData, AuthMeVars } from "../graphQL/auth.queries";
import { appActions } from "../../app/store/app.slice";
import { settingsActions } from "../../settings/store/settings.slice";
import { notificationsActions } from "../../notifications/store/notifications.slice";
import { navigateActions } from "../../navigate/store/navigate.slice";
import { Role } from "../../../behaviour/enums/Role";
import { Permission } from "../../../behaviour/enums/Permission";
import { client } from "../../../behaviour/client";

const getSettingsAction = (role?: Role, permissions?: Permission[]) => {
    if (!role && !permissions)
        return settingsActions.getForUnAuthenticatedAsync();
    if (role === Role.Administrator || permissions?.some(p => p === Permission.UpdateSettings))
        return settingsActions.getForAdministratorOrHavePermissionUpdateAsync();
    return settingsActions.getForEmployee();
}

export const loginEpic: Epic<ReturnType<typeof authActions.userLoginAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(authActions.userLoginAsync.type),
        mergeMap(action =>
            from(client.mutate<AuthLoginData, AuthLoginVars>({
                mutation: AUTH_LOG_IN_MUTATION,
                variables: { authLoginInputType: action.payload }
            })).pipe(
                mergeMap(response => [
                    settingsActions.getForAdministratorOrHavePermissionUpdateAsync(),
                    authActions.setAuthedUser({
                        user: response.data?.auth.login.user,
                        token: response.data?.auth.login.token
                    }),
                    navigateActions.navigate(-2),
                    getSettingsAction(response.data?.auth.login.user.role, response.data?.auth.login.user.permissions),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const loginGoogleEpic: Epic<ReturnType<typeof authActions.userLoginGoogleAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(authActions.userLoginGoogleAsync.type),
        mergeMap(action =>
            from(client.mutate<AuthLoginGoogleData>({
                mutation: AUTH_LOG_IN_GOOGLE_MUTATION,
                variables: { googleJWT: action.payload }
            })).pipe(
                mergeMap(response => [
                    settingsActions.getForAdministratorOrHavePermissionUpdateAsync(),
                    authActions.setAuthedUser({
                        user: response.data?.auth.loginGoogle.user,
                        token: response.data?.auth.loginGoogle.token
                    }),
                    navigateActions.navigate(-2),
                    getSettingsAction(response.data?.auth.loginGoogle.user.role, response.data?.auth.loginGoogle.user.permissions),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );


export const meEpic: Epic<ReturnType<typeof authActions.meAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(authActions.meAsync.type),
        mergeMap(action =>
            from(client.query<AuthMeData, AuthMeVars>({
                query: AUTH_ME_QUERY,
            })).pipe(
                mergeMap(response => [
                    appActions.setInitialised(true),
                    authActions.setAuthedUser({ user: response.data.auth.me.user, token: response.data.auth.me.token }),
                    getSettingsAction(response.data?.auth.me.user.role, response.data?.auth.me.user.permissions),
                ]),
                catchError(error => of(
                    appActions.setInitialised(true),
                    getSettingsAction(),
                )),
                startWith(authActions.setLoadingMe(true)),
                endWith(authActions.setLoadingMe(false)),
            )
        )
    );

export const logoutEpic: Epic<ReturnType<typeof authActions.logoutAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(authActions.logoutAsync.type),
        mergeMap(action =>
            from(client.mutate<AuthMeData>({
                mutation: AUTH_LOG_OUT_MUTATION,
            })).pipe(
                mergeMap(response => [
                    authActions.setAuthedUser({ user: null, token: null }),
                    navigateActions.navigate("/auth/login")
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const requestResetPasswordEpic: Epic<ReturnType<typeof authActions.requestResetPasswordAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(authActions.requestResetPasswordAsync.type),
        mergeMap(action =>
            from(client.mutate<AuthRequestResetData, AuthRequestResetVars>({
                mutation: AUTH_REQUEST_RESET_PASSWORD_MUTATION,
                variables: { authRequestResetPasswordInputType: action.payload }
            })).pipe(
                mergeMap(response => [
                    notificationsActions.addSuccess("Confirmation link send on your email.")
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const resetPasswordEpic: Epic<ReturnType<typeof authActions.resetPasswordAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(authActions.resetPasswordAsync.type),
        mergeMap(action =>
            from(client.mutate<AuthResetData, AuthResetVars>({
                mutation: AUTH_RESET_PASSWORD_MUTATION,
                variables: { authResetPasswordInputType: action.payload }
            })).pipe(
                mergeMap(response => [
                    notificationsActions.addSuccess("Password changed!"),
                    navigateActions.navigate("../login")
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const changePasswordEpic: Epic<ReturnType<typeof authActions.changePasswordAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(authActions.changePasswordAsync.type),
        mergeMap(action =>
            from(client.mutate<AuthChangePasswordData, AuthChangePasswordVars>({
                mutation: AUTH_CHANGE_PASSWORD_MUTATION,
                variables: { authChangePasswordInputType: action.payload }
            })).pipe(
                mergeMap(response => [
                    notificationsActions.addSuccess("Password successfully changed!"),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(authActions.setLoadingChangePassword(true)),
                endWith(authActions.setLoadingChangePassword(false)),
            )
        )
    );

export const authEpics = combineEpics(
    loginEpic,
    // @ts-ignore
    meEpic,
    logoutEpic,
    requestResetPasswordEpic,
    resetPasswordEpic,
    changePasswordEpic,
    loginGoogleEpic
)