import { combineEpics, Epic, ofType } from "redux-observable";
import { RootState } from "../../../behaviour/store";
import { catchError, endWith, from, map, mergeMap, of, startWith } from "rxjs";
import {
    SETTINGS_GET_FOR_ADMINISTRATOR_OR_HAVE_PERMISSION_UPDATE_QUERY,
    SETTINGS_GET_FOR_EMPLOYEE_QUERY,
    SettingsGetData,
    SettingsGetVars
} from "../graphQL/settings.queries";
import {
    SETTINGS_APPLICATION_UPDATE_MUTATION,
    SETTINGS_EMAIL_UPDATE_MUTATION,
    SETTINGS_EMPLOYMENT_UPDATE_MUTATION,
    SETTINGS_TASKS_UPDATE_MUTATION,
    SETTINGS_VACATION_REQUESTS_UPDATE_MUTATION,
    SettingsApplicationUpdateData,
    SettingsApplicationUpdateVars,
    SettingsEmailUpdateData,
    SettingsEmailUpdateVars,
    SettingsEmploymentUpdateData,
    SettingsEmploymentUpdateVars,
    SettingsTasksUpdateData,
    SettingsTasksUpdateVars,
    SettingsVacationRequestsUpdateData,
    SettingsVacationRequestsUpdateVars
} from "../graphQL/settings.mutations";
import { notificationsActions } from "../../notifications/store/notifications.slice";
import { settingsActions } from "./settings.slice";
import { client } from "../../../behaviour/client";
import { authActions } from "../../auth/store/auth.slice";

export const getForAdministratorOrHavePermissionUpdateEpic: Epic<ReturnType<typeof settingsActions.getForAdministratorOrHavePermissionUpdateAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(settingsActions.getForAdministratorOrHavePermissionUpdateAsync.type),
        mergeMap(action =>
            from(client.query<SettingsGetData, SettingsGetVars>({
                query: SETTINGS_GET_FOR_ADMINISTRATOR_OR_HAVE_PERMISSION_UPDATE_QUERY,
            })).pipe(
                map(response => settingsActions.setSettings(response.data.settings.get)),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(settingsActions.setLoadingGet(true)),
                endWith(settingsActions.setLoadingGet(false)),
            )
        )
    );

export const getSettingsForEmployeeEpic: Epic<ReturnType<typeof settingsActions.getForEmployee>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(settingsActions.getForEmployee.type),
        mergeMap(action =>
            from(client.query<SettingsGetData, SettingsGetVars>({
                query: SETTINGS_GET_FOR_EMPLOYEE_QUERY,
            })).pipe(
                map(response => settingsActions.setSettings(response.data.settings.get)),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(settingsActions.setLoadingGet(true)),
                endWith(settingsActions.setLoadingGet(false)),
            )
        )
    );

export const settingsEmploymentUpdateEpic: Epic<ReturnType<typeof settingsActions.updateEmploymentAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(settingsActions.updateEmploymentAsync.type),
        mergeMap(action =>
            from(client.mutate<SettingsEmploymentUpdateData, SettingsEmploymentUpdateVars>({
                mutation: SETTINGS_EMPLOYMENT_UPDATE_MUTATION,
                variables: { settingsEmploymentUpdateInputType: action.payload },
            })).pipe(
                mergeMap(response => [
                    settingsActions.setSettings(response.data?.settings.updateEmployment),
                    notificationsActions.addSuccess('Settings employment successfully saved')
                ]
                ),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(settingsActions.setLoadingUpdate(true)),
                endWith(settingsActions.setLoadingUpdate(false)),
            )
        )
    );

export const settingsApplicationUpdateEpic: Epic<ReturnType<typeof settingsActions.updateApplicationAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(settingsActions.updateApplicationAsync.type),
        mergeMap(action =>
            from(client.mutate<SettingsApplicationUpdateData, SettingsApplicationUpdateVars>({
                mutation: SETTINGS_APPLICATION_UPDATE_MUTATION,
                variables: { settingsApplicationUpdateInputType: action.payload },
            })).pipe(
                mergeMap(response => [
                    settingsActions.setSettings(response.data?.settings.updateApplication),
                    notificationsActions.addSuccess('Settings application successfully saved')
                ]
                ),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(settingsActions.setLoadingUpdate(true)),
                endWith(settingsActions.setLoadingUpdate(false)),
            )
        )
    );

export const settingsTasksUpdateEpic: Epic<ReturnType<typeof settingsActions.updateTasksAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(settingsActions.updateTasksAsync.type),
        mergeMap(action =>
            from(client.mutate<SettingsTasksUpdateData, SettingsTasksUpdateVars>({
                mutation: SETTINGS_TASKS_UPDATE_MUTATION,
                variables: { settingsTasksUpdateInputType: action.payload },
            })).pipe(
                mergeMap(response =>
                    response.data
                        ? [
                            settingsActions.setSettings(response.data.settings.updateTasks),
                            notificationsActions.addSuccess('Settings tasks successfully saved')
                        ]
                        : [notificationsActions.addError('Response is empty')]
                ),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(settingsActions.setLoadingUpdate(true)),
                endWith(settingsActions.setLoadingUpdate(false)),
            )
        )
    );


export const settingsEmailUpdateEpic: Epic<ReturnType<typeof settingsActions.updateEmailAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(settingsActions.updateEmailAsync.type),
        mergeMap(action =>
            from(client.mutate<SettingsEmailUpdateData, SettingsEmailUpdateVars>({
                mutation: SETTINGS_EMAIL_UPDATE_MUTATION,
                variables: { settingsEmailUpdateInputType: action.payload },
            })).pipe(
                mergeMap(response =>
                    response.data
                        ? [
                            settingsActions.setSettings(response.data.settings.updateEmail),
                            notificationsActions.addSuccess('Settings email successfully saved')
                        ]
                        : [notificationsActions.addError('Response is empty')]
                ),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(settingsActions.setLoadingUpdate(true)),
                endWith(settingsActions.setLoadingUpdate(false)),
            )
        )
    );


export const updateVacationRequestsEpic: Epic<ReturnType<typeof settingsActions.updateVacationRequestsAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(settingsActions.updateVacationRequestsAsync.type),
        mergeMap(action =>
            from(client.mutate<SettingsVacationRequestsUpdateData, SettingsVacationRequestsUpdateVars>({
                mutation: SETTINGS_VACATION_REQUESTS_UPDATE_MUTATION,
                variables: { settingsVacationRequestsUpdateInputType: action.payload },
            })).pipe(
                mergeMap(response =>
                    response.data
                        ? [
                            settingsActions.setSettings(response.data.settings.updateVacationRequests),
                            notificationsActions.addSuccess('Settings vacation requests successfully saved')
                        ]
                        : [notificationsActions.addError('Response is empty')]
                ),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(settingsActions.setLoadingUpdate(true)),
                endWith(settingsActions.setLoadingUpdate(false)),
            )
        )
    );

export const logoutAsyncEpic: Epic<ReturnType<typeof authActions.logoutAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(authActions.logoutAsync.type),
        map(action => settingsActions.reset())
    );

export const settingsEpics = combineEpics(
    getForAdministratorOrHavePermissionUpdateEpic,
    getSettingsForEmployeeEpic,
    // @ts-ignore
    settingsEmploymentUpdateEpic,
    settingsApplicationUpdateEpic,
    settingsTasksUpdateEpic,
    settingsEmailUpdateEpic,
    updateVacationRequestsEpic,
    logoutAsyncEpic,
)