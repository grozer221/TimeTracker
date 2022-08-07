import {combineEpics, Epic, ofType} from "redux-observable";
import {RootState} from "../../../store/store";
import {catchError, debounceTime, from, mergeMap, of} from "rxjs";
import {client} from "../../../graphQL/client";
import {GET_USERS_QUERY, GetUsersDataType, GetUsersInputType} from "../graphQL/users.queries";
import {
    CreateUserData,
    CreateUserInputType,
    RemoveUserInput,
    RemoveUserInputType,
    ResetUserPasswordDataResponse,
    ResetUserPasswordInput,
    ResetUserPasswordInputType,
    UpdateUserInput,
    UpdateUserInputType,
    USERS_CREATE_MUTATION,
    USERS_REMOVE_MUTATION,
    USERS_RESET_PASSWORD_MUTATION,
    USERS_UPDATE_MUTATION
} from "../graphQL/users.mutations";
import {usersActions} from "./users.slice";
import {notificationsActions} from "../../notifications/store/notifications.slice";
import {navigateActions} from "../../navigate/store/navigate.slice";

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
                ])
            )
        ),
        catchError(error => of(notificationsActions.addError(error.message)))
    )
}

export const getUsersForVacationsSelectEpic: Epic<ReturnType<typeof usersActions.fetchUsersForVacationsSelect>,
    any, RootState> = (action$, state$) => {
    return action$.pipe(
        ofType(usersActions.fetchUsersForVacationsSelect.type),
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
                        usersActions.setUsersForVacationLoading(false),
                        usersActions.addUsersForVacationsSelect({
                            users: response.data.users.get.entities,
                            total: response.data.users.get.total
                        })]
                )
            )
        ),
        catchError(error => of(notificationsActions.addError(error.message)))
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
                ])
            )
        ),
        catchError(error => of(notificationsActions.addError(error.message))),
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
                ])
            )
        ),
        catchError(error => of(notificationsActions.addError(error.message))),
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
                    usersActions.getAsync({take: state$.value.users.pageSize, skip: state$.value.users.currentPage})
                ])
            )
        ),
        catchError(error => of(notificationsActions.addError(error.message))),
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
                    usersActions.getAsync({take: state$.value.users.pageSize, skip: state$.value.users.currentPage})
                ])
            )
        ),
        catchError(error => of(notificationsActions.addError(error.message))),
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
