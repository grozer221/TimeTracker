import { combineEpics, Epic, ofType } from "redux-observable";
import { RootState } from "../../../behaviour/store";
import { catchError, endWith, from, mergeMap, of, startWith } from "rxjs";
import { vacationRequestsActions } from "./vacationRequests.slice";
import {
    VACATION_REQUESTS_GET_AVAILABLE_DAYS_QUERY,
    VACATION_REQUESTS_GET_BY_ID_QUERY,
    VACATION_REQUESTS_GET_QUERY,
    VacationRequestsGetAvailableDaysData,
    VacationRequestsGetAvailableDaysVars,
    VacationRequestsGetByIdData,
    VacationRequestsGetByIdVars,
    VacationRequestsGetData,
    VacationRequestsGetVars
} from "../graphQL/vacationRequests.queries";
import { notificationsActions } from "../../notifications/store/notifications.slice";
import {
    VACATION_REQUESTS_CREATE_MUTATION,
    VACATION_REQUESTS_REMOVE_MUTATION,
    VACATION_REQUESTS_UPDATE_STATUS_MUTATION,
    VacationRequestsCreateData,
    VacationRequestsCreateVars,
    VacationRequestsRemoveData,
    VacationRequestsRemoveVars,
    VacationRequestsUpdateStatusData,
    VacationRequestsUpdateStatusVars
} from "../graphQL/vacationRequests.mutations";
import { navigateActions } from "../../navigate/store/navigate.slice";
import { client } from "../../../behaviour/client";

export const getAvailableDaysAsyncEpic: Epic<ReturnType<typeof vacationRequestsActions.getAvailableDaysAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(vacationRequestsActions.getAvailableDaysAsync.type),
        mergeMap(action =>
            from(client.query<VacationRequestsGetAvailableDaysData, VacationRequestsGetAvailableDaysVars>({
                query: VACATION_REQUESTS_GET_AVAILABLE_DAYS_QUERY,
            })).pipe(
                mergeMap(response => [
                    vacationRequestsActions.setAvailableDays(response.data.vacationRequests.getAvailableDays),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(vacationRequestsActions.setLoadingGetAvailableDays(true)),
                endWith(vacationRequestsActions.setLoadingGetAvailableDays(false)),
            )
        )
    );

export const getByIdAsyncEpic: Epic<ReturnType<typeof vacationRequestsActions.getByIdAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(vacationRequestsActions.getByIdAsync.type),
        mergeMap(action =>
            from(client.query<VacationRequestsGetByIdData, VacationRequestsGetByIdVars>({
                query: VACATION_REQUESTS_GET_BY_ID_QUERY,
                variables: { id: action.payload.id }
            })).pipe(
                mergeMap(response => [
                    vacationRequestsActions.setVacationRequests({
                        total: 1,
                        entities: [response.data.vacationRequests.getById],
                        pageSize: 0,
                    })
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(vacationRequestsActions.setLoadingGetById(true)),
                endWith(vacationRequestsActions.setLoadingGetById(false)),
            )
        )
    );

export const getAsyncEpic: Epic<ReturnType<typeof vacationRequestsActions.getAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(vacationRequestsActions.getAsync.type),
        mergeMap(action =>
            from(client.query<VacationRequestsGetData, VacationRequestsGetVars>({
                query: VACATION_REQUESTS_GET_QUERY,
                variables: { vacationRequestsGetInputType: action.payload }
            })).pipe(
                mergeMap(response => {
                    return response.errors?.length
                        ? response.errors.map(error => notificationsActions.addError(error.message))
                        : [
                            vacationRequestsActions.setVacationRequestsGetInputType(action.payload),
                            vacationRequestsActions.setVacationRequests(response.data.vacationRequests.get)
                        ]
                }),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(vacationRequestsActions.setLoadingGet(true)),
                endWith(vacationRequestsActions.setLoadingGet(false)),
            )
        )
    );


export const createAsyncEpic: Epic<ReturnType<typeof vacationRequestsActions.createAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(vacationRequestsActions.createAsync.type),
        mergeMap(action =>
            from(client.query<VacationRequestsCreateData, VacationRequestsCreateVars>({
                query: VACATION_REQUESTS_CREATE_MUTATION,
                variables: { vacationRequestsCreateInputType: action.payload }
            })).pipe(
                mergeMap(response => {
                    const vacationRequestsGetInputType = state$.value.vacationRequests.vacationRequestsGetInputType;
                    return response.errors?.length
                        ? response.errors.map(error => notificationsActions.addError(error.message))
                        : [
                            vacationRequestsGetInputType && vacationRequestsActions.getAsync(vacationRequestsGetInputType),
                            navigateActions.navigate(-1),
                            vacationRequestsActions.getAvailableDaysAsync(),
                        ]
                }),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(vacationRequestsActions.setLoadingCreate(true)),
                endWith(vacationRequestsActions.setLoadingCreate(false)),
            )
        )
    );

export const updateStatusAsyncEpic: Epic<ReturnType<typeof vacationRequestsActions.updateStatusAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(vacationRequestsActions.updateStatusAsync.type),
        mergeMap(action =>
            from(client.query<VacationRequestsUpdateStatusData, VacationRequestsUpdateStatusVars>({
                query: VACATION_REQUESTS_UPDATE_STATUS_MUTATION,
                variables: { vacationRequestsUpdateStatusInputType: action.payload }
            })).pipe(
                mergeMap(response => {
                    const vacationRequestsGetInputType = state$.value.vacationRequests.vacationRequestsGetInputType;
                    return response.errors?.length
                        ? response.errors.map(error => notificationsActions.addError(error.message))
                        : [
                            vacationRequestsGetInputType && vacationRequestsActions.getAsync(vacationRequestsGetInputType),
                            navigateActions.navigate(-1),
                            vacationRequestsActions.getAvailableDaysAsync(),
                        ]
                }),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(vacationRequestsActions.setLoadingUpdate(true)),
                endWith(vacationRequestsActions.setLoadingUpdate(false)),
            )
        )
    );


export const removeAsyncEpic: Epic<ReturnType<typeof vacationRequestsActions.removeAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(vacationRequestsActions.removeAsync.type),
        mergeMap(action =>
            from(client.query<VacationRequestsRemoveData, VacationRequestsRemoveVars>({
                query: VACATION_REQUESTS_REMOVE_MUTATION,
                variables: { id: action.payload.id }
            })).pipe(
                mergeMap(response => {
                    const vacationRequestsGetInputType = state$.value.vacationRequests.vacationRequestsGetInputType;
                    return response.errors?.length
                        ? response.errors.map(error => notificationsActions.addError(error.message))
                        : [
                            vacationRequestsGetInputType && vacationRequestsActions.getAsync(vacationRequestsGetInputType),
                            notificationsActions.addSuccess('Vacation request successfully removed'),
                            vacationRequestsActions.getAvailableDaysAsync(),
                        ]
                }),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(vacationRequestsActions.setLoadingCreate(true)),
                endWith(vacationRequestsActions.setLoadingCreate(false)),
            )
        )
    );


export const vacationRequestsEpics = combineEpics(
    getAvailableDaysAsyncEpic,
    // @ts-ignore
    getByIdAsyncEpic,
    getAsyncEpic,
    createAsyncEpic,
    updateStatusAsyncEpic,
    removeAsyncEpic,
)