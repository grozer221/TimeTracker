import { combineEpics, Epic, ofType } from "redux-observable";
import { RootState } from "../../../behaviour/store";
import { catchError, from, mergeMap, of } from "rxjs";
import { notificationsActions } from "../../notifications/store/notifications.slice";
import { navigateActions } from "../../navigate/store/navigate.slice";
import { companiesActions } from "./slice";
import { client } from "../../../behaviour/client";
import { createCompanyMutation, getCompaniesQuery, getCompanyQuery, removeCompanyMutation, updateCompanyMutation } from "./queries";


export const getCompanyEpic: Epic<ReturnType<typeof companiesActions.getCompanyAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(companiesActions.getCompanyAsync.type),
        mergeMap(action =>
            from(client.query({
                query: getCompanyQuery,
                variables: action.payload,
            })).pipe(
                mergeMap(response => [
                    companiesActions.setCompany(response.data.companies.getById)
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const getCompaniesAsyncEpic: Epic<ReturnType<typeof companiesActions.getCompaniesAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(companiesActions.getCompaniesAsync.type),
        mergeMap(action =>
            from(client.query({
                query: getCompaniesQuery,
                variables: action.payload
            })).pipe(
                mergeMap(response => [
                    companiesActions.setCompanies(response.data.companies.get),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const createAsyncEpic: Epic<ReturnType<typeof companiesActions.createAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(companiesActions.createAsync.type),
        mergeMap(action =>
            from(client.query({
                query: createCompanyMutation,
                variables: action.payload,
            })).pipe(
                mergeMap(response => [navigateActions.navigate(-1)]),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const updateAsyncEpic: Epic<ReturnType<typeof companiesActions.updateAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(companiesActions.updateAsync.type),
        mergeMap(action =>
            from(client.query({
                query: updateCompanyMutation,
                variables: action.payload
            })).pipe(
                mergeMap(response => [navigateActions.navigate(-1)]),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const removeAsyncEpic: Epic<ReturnType<typeof companiesActions.removeAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(companiesActions.removeAsync.type),
        mergeMap(action =>
            from(client.query({
                query: removeCompanyMutation,
                variables: action.payload
            })).pipe(
                mergeMap(response => [
                    companiesActions.getCompaniesAsync({ paging: { pageNumber: 1, pageSize: 10 } }),
                    notificationsActions.addSuccess('Company successfully removed')
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const companiesEpics = combineEpics(
    getCompanyEpic,
    // @ts-ignore
    getCompaniesAsyncEpic,
    createAsyncEpic,
    updateAsyncEpic,
    removeAsyncEpic,
)