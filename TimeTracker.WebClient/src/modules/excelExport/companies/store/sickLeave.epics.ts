import {combineEpics, Epic, ofType} from "redux-observable";
import {catchError, endWith, from, mergeMap, of, startWith} from "rxjs";
import {sickLeaveActions} from "./sickLeave.slice";
import {
    SICK_LEAVE_GET_BY_ID_QUERY, SICK_LEAVE_GET_QUERY,
    SickLeaveGetByIdData,
    SickLeaveGetByIdVars,
    SickLeaveGetData, SickLeaveGetVars
} from "../graphQL/sickLeave.queries";
import {
    SICK_LEAVE_CREATE_MUTATION,
    SICK_LEAVE_REMOVE_MUTATION,
    SICK_LEAVE_UPDATE_MUTATION,
    SICK_LEAVE_UPLOAD_FILES_MUTATION,
    SickLeaveCreateData,
    SickLeaveCreateVars,
    SickLeaveRemoveData,
    SickLeaveRemoveVars,
    SickLeaveUpdateData,
    SickLeaveUpdateVars, SickLeaveUploadFilesData, SickLeaveUploadFilesVars
} from "../graphQL/sickLeave.mutation";
import { RootState } from "../../../../behaviour/store";
import { client } from "../../../../behaviour/client";
import { notificationsActions } from "../../../notifications/store/notifications.slice";
import { navigateActions } from "../../../navigate/store/navigate.slice";


export const getByIdAsyncEpic: Epic<ReturnType<typeof sickLeaveActions.getByIdAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(sickLeaveActions.getByIdAsync.type),
        mergeMap(action =>
            from(client.query<SickLeaveGetByIdData, SickLeaveGetByIdVars>({
                query: SICK_LEAVE_GET_BY_ID_QUERY,
                variables: {id: action.payload.id}
            })).pipe(
                mergeMap(response => [
                    sickLeaveActions.getById(response.data.sickLeave.getById)
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(sickLeaveActions.setLoadingGetById(true)),
                endWith(sickLeaveActions.setLoadingGetById(false)),
            )
        )
    );

export const getAsyncEpic: Epic<ReturnType<typeof sickLeaveActions.getAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(sickLeaveActions.getAsync.type),
        mergeMap(action =>
            from(client.query<SickLeaveGetData, SickLeaveGetVars>({
                query: SICK_LEAVE_GET_QUERY,
                variables: {sickLeaveGetInputType: action.payload}
            })).pipe(
                mergeMap(response => [
                    sickLeaveActions.get(response.data.sickLeave.get),
                    sickLeaveActions.setSickLeaveGetInputType(action.payload)
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(sickLeaveActions.setLoadingGet(true)),
                endWith(sickLeaveActions.setLoadingGet(false)),
            )
        )
    );

export const createAsyncEpic: Epic<ReturnType<typeof sickLeaveActions.createAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(sickLeaveActions.createAsync.type),
        mergeMap(action =>
            from(client.query<SickLeaveCreateData, SickLeaveCreateVars>({
                query: SICK_LEAVE_CREATE_MUTATION,
                variables: {sickLeaveCreateInputType: action.payload}
            })).pipe(
                mergeMap(response => {
                    const sickLeaveGetInputType = state$.value.sickLeave.sickLeaveGetInputType;
                    return response.errors?.length
                        ? response.errors.map(error => notificationsActions.addError(error.message))
                        : [
                            sickLeaveGetInputType && sickLeaveActions.getAsync(sickLeaveGetInputType),
                            navigateActions.navigate(-1),
                        ]
                }),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(sickLeaveActions.setLoadingCreate(true)),
                endWith(sickLeaveActions.setLoadingCreate(false)),
            )
        )
    );

export const updateAsyncEpic: Epic<ReturnType<typeof sickLeaveActions.updateAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(sickLeaveActions.updateAsync.type),
        mergeMap(action =>
            from(client.query<SickLeaveUpdateData, SickLeaveUpdateVars>({
                query: SICK_LEAVE_UPDATE_MUTATION,
                variables: {sickLeaveUpdateInputType: action.payload}
            })).pipe(
                mergeMap(response => {
                    const sickLeaveGetInputType = state$.value.sickLeave.sickLeaveGetInputType;
                    return response.errors?.length
                        ? response.errors.map(error => notificationsActions.addError(error.message))
                        : [
                            sickLeaveGetInputType && sickLeaveActions.getAsync(sickLeaveGetInputType),
                            navigateActions.navigate(-1),
                        ]
                }),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(sickLeaveActions.setLoadingUpdate(true)),
                endWith(sickLeaveActions.setLoadingUpdate(false)),
            )
        )
    );

export const uploadFilesAsyncEpic: Epic<ReturnType<typeof sickLeaveActions.uploadFilesAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(sickLeaveActions.uploadFilesAsync.type),
        mergeMap(action =>
            from(client.query<SickLeaveUploadFilesData, SickLeaveUploadFilesVars>({
                query: SICK_LEAVE_UPLOAD_FILES_MUTATION,
                variables: {sickLeaveUploadFilesInputType: action.payload}
            })).pipe(
                mergeMap(response => {
                    const sickLeaveGetInputType = state$.value.sickLeave.sickLeaveGetInputType;
                    return response.errors?.length
                        ? response.errors.map(error => notificationsActions.addError(error.message))
                        : [
                            sickLeaveGetInputType && sickLeaveActions.getAsync(sickLeaveGetInputType),
                            navigateActions.navigate(-1),
                        ]
                }),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(sickLeaveActions.setLoadingUpdate(true)),
                endWith(sickLeaveActions.setLoadingUpdate(false)),
            )
        )
    );


export const removeAsyncEpic: Epic<ReturnType<typeof sickLeaveActions.removeAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(sickLeaveActions.removeAsync.type),
        mergeMap(action =>
            from(client.query<SickLeaveRemoveData, SickLeaveRemoveVars>({
                query: SICK_LEAVE_REMOVE_MUTATION,
                variables: {id: action.payload.id}
            })).pipe(
                mergeMap(response => {
                    const sickLeaveGetInputType = state$.value.sickLeave.sickLeaveGetInputType;
                    return response.errors?.length
                        ? response.errors.map(error => notificationsActions.addError(error.message))
                        : [
                            sickLeaveGetInputType && sickLeaveActions.getAsync(sickLeaveGetInputType),
                            notificationsActions.addSuccess('Sick leave days successfully removed')
                        ]
                }),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(sickLeaveActions.setLoadingRemove(true)),
                endWith(sickLeaveActions.setLoadingRemove(false)),
            )
        )
    );

export const sickLeaveEpics = combineEpics(
    getAsyncEpic,
    // @ts-ignore
    createAsyncEpic,
    getByIdAsyncEpic,
    updateAsyncEpic,
    uploadFilesAsyncEpic,
    removeAsyncEpic,
)