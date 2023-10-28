import { configureStore } from '@reduxjs/toolkit'
import { appReducer } from "../modules/app/store/app.slice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authReducer } from "../modules/auth/store/auth.slice";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { authEpics } from "../modules/auth/store/auth.epics";
import { calendarDaysEpics } from "../modules/calendarDays/store/calendarDays.epics";
import { settingsEpics } from "../modules/settings/store/settings.epics";
import { fileManagerEpics } from "../modules/fileManager/store/fileManager.epics";
import { calendarDaysReducer } from "../modules/calendarDays/store/calendarDays.slice";
import { navigateReducer } from "../modules/navigate/store/navigate.slice";
import { notificationsReducer } from "../modules/notifications/store/notifications.slice";
import { settingsReducer } from "../modules/settings/store/settings.slice";
import { usersPageEpics } from "../modules/users/store/usersPage.epics";
import { cacheEpics } from "../modules/cache/store/cache.epics";
import { cacheReducer } from "../modules/cache/store/cache.slice";
import { fileManagerReducer } from "../modules/fileManager/store/fileManager.slice";
import { usersReducer } from "../modules/users/store/users.slice";
import { vacationRequestsEpics } from "../modules/vacationRequests/store/vacationRequests.epics";
import { vacationRequestsReducer } from "../modules/vacationRequests/store/vacationRequests.slice";
import { tracksReducer } from "../modules/tracks/store/tracks.slice";
import { tracksPageEpics } from "../modules/tracks/store/tracksPage.epics";
import { excelExportReducer } from "../modules/excelExport/store/excelExport.slice";
import { excelEpics } from "../modules/excelExport/store/excelExport.epics";
import { sickLeaveReducer } from "../modules/sickLeave/store/sickLeave.slice";
import { sickLeaveEpics } from "../modules/sickLeave/store/sickLeave.epics";
import { usersProfilePageEpics } from "../modules/users/store/usersProfilePage.epics.";
import { statisticReducer } from "../modules/timeTracker/userStatistic/store/statistic.slice";
import { statisticEpics } from "../modules/timeTracker/userStatistic/store/statistic.epics";
import { companiesReducer } from "../modules/companies/behaviour/slice";
import { companiesEpics } from "../modules/companies/behaviour/epics";


const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
    reducer: {
        app: appReducer,
        auth: authReducer,
        calendarDays: calendarDaysReducer,
        notifications: notificationsReducer,
        navigate: navigateReducer,
        settings: settingsReducer,
        cache: cacheReducer,
        fileManager: fileManagerReducer,
        users: usersReducer,
        vacationRequests: vacationRequestsReducer,
        tracks: tracksReducer,
        statistic: statisticReducer,
        excel: excelExportReducer,
        sickLeave: sickLeaveReducer,
        companies: companiesReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({ thunk: false }).concat(epicMiddleware),
    devTools: true,
})

const rootEpic = combineEpics(
    authEpics,
    // @ts-ignore
    calendarDaysEpics,
    settingsEpics,
    cacheEpics,
    usersPageEpics,
    fileManagerEpics,
    vacationRequestsEpics,
    tracksPageEpics,
    statisticEpics,
    excelEpics,
    sickLeaveEpics,
    usersProfilePageEpics,
    companiesEpics,
);
// @ts-ignore
epicMiddleware.run(rootEpic);


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector