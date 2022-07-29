import {combineEpics, Epic, ofType} from "redux-observable";
import {RootState} from "../../../store/store";
import {catchError, debounceTime, from, mergeMap, of} from "rxjs";
import {client} from "../../../graphQL/client";
import {GET_USERS_QUERY, GetUsersDataType, GetUsersInputType} from "../graphQL/users.queries";
import {
    CreateUserData,
    CreateUserInputType,
    RemoveUserInput,
    RemoveUserInputType, UpdateUserInput, UpdateUserInputType,
    USERS_CREATE_MUTATION, USERS_REMOVE_MUTATION, USERS_UPDATE_MUTATION
} from "../graphQL/users.mutations";
import {usersActions} from "./users.slice";
import {notificationsActions} from "../../notifications/store/notifications.slice";

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

export const getUsersForVocationsSelectEpic: Epic<ReturnType<typeof usersActions.fetchUsersForVocationsSelect>,
    any, RootState> = (action$, state$) => {
    return action$.pipe(
        ofType(usersActions.fetchUsersForVocationsSelect.type),
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
                    usersActions.addUsersForVocationsSelect(response.data.users.get.entities)
                ])
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
                mergeMap(response => {
                    history.back()
                    return [
                    notificationsActions.addSuccess("User was created!")
                ]})
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
                mergeMap(response => {
                    history.back()
                    return [
                        notificationsActions.addSuccess("User was deleted!"),
                        usersActions.getAsync({take: state$.value.users.pageSize, skip: state$.value.users.currentPage})
                    ]
                })
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
                mergeMap(response => {
                    history.back()
                    return [
                        notificationsActions.addSuccess("User was updated!"),
                        usersActions.getAsync({take: state$.value.users.pageSize, skip: state$.value.users.currentPage})
                    ]
                })
            )
        ),
        catchError(error => of(notificationsActions.addError(error.message))),
    )
}

export const usersPageEpics = combineEpics(
    getUsersEpic,
    getUsersForVocationsSelectEpic,
    // @ts-ignore
    createUserEpic,
    removeUserEpic,
    updateUserEpic,
)
