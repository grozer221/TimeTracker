import { combineEpics, Epic, ofType } from "redux-observable";
import { RootState } from "../../../behaviour/store";
import { catchError, endWith, from, map, mergeMap, of, startWith } from "rxjs";
import {
    FILE_MANAGER_GET_IN_FOLDER_QUERY,
    FileManagerGetInFolderData,
    FileManagerGetInFolderVars
} from "../graphQL/fileManager.queries";
import {
    FILE_MANAGER_CREATE_FOLDER_MUTATION,
    FILE_MANAGER_REMOVE_MUTATION, FILE_MANAGER_RENAME_FILE_MUTATION,
    FILE_MANAGER_UPLOAD_FILES_MUTATION,
    FileManagerCreateFolderData,
    FileManagerCreateFolderVars,
    FileManagerRemoveData,
    FileManagerRemoveVars,
    FileManagerRenameFileData,
    FileManagerRenameFileVars,
    FileManagerUploadFilesData,
    FileManagerUploadFilesVars
} from "../graphQL/fileManager.mutations";
import { fileManagerActions } from "./fileManager.slice";
import { notificationsActions } from "../../notifications/store/notifications.slice";
import { client } from "../../../behaviour/client";

export const getInFolderEpic: Epic<ReturnType<typeof fileManagerActions.getInFolderAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(fileManagerActions.getInFolderAsync.type),
        mergeMap(action =>
            from(client.query<FileManagerGetInFolderData, FileManagerGetInFolderVars>({
                query: FILE_MANAGER_GET_IN_FOLDER_QUERY,
                variables: { folderPath: action.payload }
            })).pipe(
                map(response => fileManagerActions.setItems(response.data.fileManager.getInFolder)),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(fileManagerActions.setLoadingGetInFolder(true)),
                endWith(fileManagerActions.setLoadingGetInFolder(false)),
            )
        )
    );

export const createFolderEpic: Epic<ReturnType<typeof fileManagerActions.createFolderAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(fileManagerActions.createFolderAsync.type),
        mergeMap(action =>
            from(client.mutate<FileManagerCreateFolderData, FileManagerCreateFolderVars>({
                mutation: FILE_MANAGER_CREATE_FOLDER_MUTATION,
                variables: { fileManagerCreateFolderInputType: action.payload }
            })).pipe(
                mergeMap(response => [
                    fileManagerActions.getInFolderAsync(state$.value.fileManager.folderPath),
                    fileManagerActions.setIsCreateFolderPageVisible(false),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(fileManagerActions.setLoadingCreateFolder(true)),
                endWith(fileManagerActions.setLoadingCreateFolder(false)),
            )
        )
    );

export const uploadFilesEpic: Epic<ReturnType<typeof fileManagerActions.uploadFilesAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(fileManagerActions.uploadFilesAsync.type),
        mergeMap(action =>
            from(client.mutate<FileManagerUploadFilesData, FileManagerUploadFilesVars>({
                mutation: FILE_MANAGER_UPLOAD_FILES_MUTATION,
                variables: { fileManagerUploadFilesInputType: action.payload }
            })).pipe(
                mergeMap(response => [
                    fileManagerActions.getInFolderAsync(state$.value.fileManager.folderPath),
                    fileManagerActions.setIsUploadFilesPageVisible(false),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(fileManagerActions.setLoadingUploadFiles(true)),
                endWith(fileManagerActions.setLoadingUploadFiles(false)),
            )
        )
    );

export const renameFileEpic: Epic<ReturnType<typeof fileManagerActions.renameFileAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(fileManagerActions.renameFileAsync.type),
        mergeMap(action =>
            from(client.mutate<FileManagerRenameFileData, FileManagerRenameFileVars>({
                mutation: FILE_MANAGER_RENAME_FILE_MUTATION,
                variables: { fileManagerRenameInputType: action.payload }
            })).pipe(
                mergeMap(response => [
                    fileManagerActions.getInFolderAsync(state$.value.fileManager.folderPath),
                    fileManagerActions.setIsRenameFilePageVisible(false),
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(fileManagerActions.setLoadingRenameFile(true)),
                endWith(fileManagerActions.setLoadingRenameFile(false)),
            )
        )
    );

export const removeEpic: Epic<ReturnType<typeof fileManagerActions.removeAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(fileManagerActions.removeAsync.type),
        mergeMap(action =>
            from(client.mutate<FileManagerRemoveData, FileManagerRemoveVars>({
                mutation: FILE_MANAGER_REMOVE_MUTATION,
                variables: { fileManagerRemoveInputType: action.payload }
            })).pipe(
                map(response => fileManagerActions.getInFolderAsync(state$.value.fileManager.folderPath)),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(fileManagerActions.setLoadingRemove(true)),
                endWith(fileManagerActions.setLoadingRemove(false)),
            )
        )
    );

export const fileManagerEpics = combineEpics(
    getInFolderEpic,
    // @ts-ignore
    createFolderEpic,
    uploadFilesEpic,
    renameFileEpic,
    removeEpic,
)