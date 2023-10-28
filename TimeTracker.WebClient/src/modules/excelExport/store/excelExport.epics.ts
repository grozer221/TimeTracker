import { combineEpics, Epic, ofType } from "redux-observable";
import { excelExportActions } from "../store/excelExport.slice";
import { RootState } from "../../../behaviour/store";
import { catchError, from, mergeMap, of } from "rxjs";
import {
    EXCEL_EXPORT_CREATE_QUERY,
    ExcelExportData,
    ExcelExportVars
} from "../graphQL/excelExport.queries";
import { notificationsActions } from "../../notifications/store/notifications.slice";
import { client } from "../../../behaviour/client";

export const createReport: Epic<ReturnType<typeof excelExportActions.createReportAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(excelExportActions.createReportAsync.type),
        mergeMap(action =>
            from(client.query<ExcelExportData, ExcelExportVars>({
                query: EXCEL_EXPORT_CREATE_QUERY,
                variables: { excelExportInputType: action.payload }
            })).pipe(
                mergeMap(response => [
                    excelExportActions.saveReport({ excelExport: { createReport: response.data.excelExport.createReport } }),
                    notificationsActions.addSuccess("File start downloading")
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        )
    );

export const excelEpics = combineEpics(
    createReport
)