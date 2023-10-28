import { combineEpics, Epic, ofType } from "redux-observable";
import { RootState } from "../../../behaviour/store";
import { catchError, debounceTime, endWith, from, mergeMap, of, startWith } from "rxjs";
import {
    GET_USER_BY_EMAIL_QUERY,
    GET_USERS_QUERY, GetUserByEmailInputType,
    GetUserByEmailResponseType,
    GetUsersDataType,
    GetUsersInputType
} from "../graphQL/users.queries";
import {
    CreateUserData,
    CreateUserInputType,
    RemoveUserInput,
    RemoveUserInputType,
    ResetUserPasswordDataResponse,
    ResetUserPasswordInputType,
    UpdateUserInput,
    UpdateUserInputType,
    USERS_CREATE_MUTATION,
    USERS_REMOVE_MUTATION,
    USERS_RESET_PASSWORD_MUTATION,
    USERS_UPDATE_MUTATION
} from "../graphQL/users.mutations";
import { usersActions } from "./users.slice";
import { notificationsActions } from "../../notifications/store/notifications.slice";
import { navigateActions } from "../../navigate/store/navigate.slice";
import { client } from "../../../behaviour/client";

export const getUsersEpic: Epic<ReturnType<typeof usersActions.getAsync>, any, RootState> = (action$, state$) => {
    return action$.pipe(
        ofType(usersActions.getAsync.type),
        mergeMap(action =>
            from(client.query<GetUsersDataType, GetUsersInputType>({
                query: GET_USERS_QUERY,
                variables: {
                    FilterData: state$.value.users.filter,
                    skip: action.payload.skip,
                    take: action.payload.take,
                }
            })).pipe(
                mergeMap(response => [
                    usersActions.addUsers(response.data.users.get.entities),
                    usersActions.updateUsersMetrics({
                        total: response.data.users.get.total,
                        pageSize: response.data.users.get.pageSize,
                    })
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(usersActions.setLoadingUsers(true)),
                endWith(usersActions.setLoadingUsers(false))
            )
        )
    )
}

export const getUsersForVacationsSelectEpic: Epic<ReturnType<typeof usersActions.fetchUsersInfinityLoad>,
    any, RootState> = (action$, state$) => {
        return action$.pipe(
            ofType(usersActions.fetchUsersInfinityLoad.type),
            debounceTime(100),
            mergeMap(action =>
                from(client.query<GetUsersDataType, GetUsersInputType>({
                    query: GET_USERS_QUERY,
                    variables: {
                        FilterData: state$.value.users.filter,
                        skip: action.payload.skip,
                        take: action.payload.take,
                    }
                })).pipe(
                    mergeMap(response => [
                        usersActions.addUsersInfinityLoad(response.data.users.get)
                    ]
                    ),
                    catchError(error => of(notificationsActions.addError(error.message))),
                    startWith(usersActions.setUsersForVacationLoading(true)),
                    endWith(usersActions.setUsersForVacationLoading(false)),
                )
            )
        )
    }

export const createUserEpic: Epic<ReturnType<typeof usersActions.createUser>,
    any, RootState> = (action$, state$) => {
        return action$.pipe(
            ofType(usersActions.createUser.type),
            mergeMap(action =>
                from(client.mutate<CreateUserData, CreateUserInputType>({
                    mutation: USERS_CREATE_MUTATION,
                    variables: {
                        UserData: action.payload
                    }
                })).pipe(
                    mergeMap(response => [
                        navigateActions.navigate(-1),
                        notificationsActions.addSuccess("User was created!"),
                        usersActions.clearUsersForVacationData(),
                        usersActions.getAsync({
                            take: state$.value.users.pageSize,
                            skip: state$.value.users.currentPage
                        })
                    ]),
                    catchError(error => of(notificationsActions.addError(error.message))),
                    startWith(usersActions.setCRUDLoading(true)),
                    endWith(usersActions.setCRUDLoading(false)),
                )
            )
        )
    }

export const removeUserEpic: Epic<ReturnType<typeof usersActions.removeUserAsync>,
    any, RootState> = (action$, state$) => {
        return action$.pipe(
            ofType(usersActions.removeUserAsync.type),
            mergeMap(action =>
                from(client.mutate<RemoveUserInput, RemoveUserInputType>({
                    mutation: USERS_REMOVE_MUTATION,
                    variables: {
                        RemoveData: action.payload
                    }
                })).pipe(
                    mergeMap(response => [
                        navigateActions.navigate(-1),
                        notificationsActions.addSuccess("User was deleted!"),
                        usersActions.getAsync({
                            take: state$.value.users.pageSize,
                            skip: state$.value.users.currentPage
                        })
                    ]),
                    catchError(error => of(notificationsActions.addError(error.message))),
                    startWith(usersActions.setCRUDLoading(true)),
                    endWith(usersActions.setCRUDLoading(false)),
                )
            )
        )
    }

export const updateUserEpic: Epic<ReturnType<typeof usersActions.updateUser>,
    any, RootState> = (action$, state$) => {
        return action$.pipe(
            ofType(usersActions.updateUser.type),
            mergeMap(action =>
                from(client.mutate<UpdateUserInput, UpdateUserInputType>({
                    mutation: USERS_UPDATE_MUTATION,
                    variables: {
                        UpdateData: action.payload
                    }
                })).pipe(
                    mergeMap(response => [
                        navigateActions.navigate(-1),
                        notificationsActions.addSuccess("User was updated!"),
                        usersActions.clearUsersForVacationData(),
                        usersActions.getAsync({ take: state$.value.users.pageSize, skip: state$.value.users.currentPage })
                    ]),
                    catchError(error => of(notificationsActions.addError(error.message))),
                    startWith(usersActions.setCRUDLoading(true)),
                    endWith(usersActions.setCRUDLoading(false)),
                )
            )
        )
    }

export const resetUserPasswordEpic: Epic<ReturnType<typeof usersActions.resetUserPassword>,
    any, RootState> = (action$, state$) => {
        return action$.pipe(
            ofType(usersActions.resetUserPassword.type),
            mergeMap(action =>
                from(client.mutate<ResetUserPasswordDataResponse, ResetUserPasswordInputType>({
                    mutation: USERS_RESET_PASSWORD_MUTATION,
                    variables: {
                        ResetRequestData: action.payload
                    }
                })).pipe(
                    mergeMap(response => [
                        navigateActions.navigate(-1),
                        notificationsActions.addSuccess("Password was updated successfully for " + response.data?.users.updatePassword.email),
                        usersActions.getAsync({ take: state$.value.users.pageSize, skip: state$.value.users.currentPage })
                    ]),
                    catchError(error => of(notificationsActions.addError(error.message))),
                    startWith(usersActions.setCRUDLoading(true)),
                    endWith(usersActions.setCRUDLoading(false)),
                )
            )
        )
    }


export const usersPageEpics = combineEpics(
    getUsersEpic,
    getUsersForVacationsSelectEpic,
    // @ts-ignore
    createUserEpic,
    removeUserEpic,
    updateUserEpic,
    resetUserPasswordEpic,
)
