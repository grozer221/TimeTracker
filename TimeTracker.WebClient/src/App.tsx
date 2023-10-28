import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./modules/auth/store/auth.slice";
import { RootState } from "./behaviour/store";
import { Notifications } from "./modules/notifications/components/Notifications/Notifications";
import { NavigateTo } from "./modules/navigate/components/NavigateTo/NavigateTo";
import { Loading } from "./components/Loading/Loading";
import { CalendarPage } from "./modules/calendar/pages/CalendarPage/CalendarPage";
import { CalendarDaysCreatePage } from "./modules/calendarDays/pages/CalendarDaysCreatePage/CalendarDaysCreatePage";
import { Error } from "./components/Error/Error";
import { CalendarDaysUpdatePage } from "./modules/calendarDays/pages/CalendarDaysUpdatePage/CalendarDaysUpdatePage";
import { CalendarDaysRemovePage } from "./modules/calendarDays/pages/CalendarDaysRemovePage/CalendarDaysRemovePage";
import { AppLayout } from "./components/AppLayout/AppLayout";
import { CalendarDaysViewPage } from "./modules/calendarDays/pages/CalendarDaysViewPage/CalendarDaysViewPage";
import { AuthLoginPage } from './modules/auth/pages/AuthLoginPage/AuthLoginPage';
import { SettingsPage } from "./modules/settings/pages/SettingsPage/SettingsPage";
import { Settings } from "./modules/settings/components/Settings/Settings";
import 'antd/dist/antd.css';
import './App.css';
import './assets/Table.css';
import './assets/AntDesignOverride.css';
import { FileManagerGetInFolderPage } from "./modules/fileManager/pages/FileManagerGetInFolderPage/FileManagerGetInFolderPage";
import {
    FileManagerCreateFolder
} from "./modules/fileManager/components/FileManagerCreateFolder/FileManagerCreateFolder";
import { FileManagerUploadFile } from "./modules/fileManager/components/FileManagerUploadFile/FileManagerUploadFile";
import { AuthRequestResetPasswordPage } from "./modules/auth/pages/AuthRequestResetPasswordPage";
import { AuthResetPasswordPage } from "./modules/auth/pages/AuthResetPaswordPage";
import { UsersPage } from "./modules/users/pages/UsersPage/UsersPage";
import { CreateUserModal } from "./modules/users/components/CreateUserModal/CreateUserModal";
import { MySettingsPage } from "./modules/settings/pages/MySettingsPage/MySettingsPage";
import {
    VacationRequestsIndexPage
} from "./modules/vacationRequests/pages/VacationRequestsIndexPage/VacationRequestsIndexPage";
import {
    VacationRequestsCreatePage
} from "./modules/vacationRequests/pages/VacationRequestsCreatePage/VacationRequestsCreatePage";
import {
    VacationRequestsUpdatePage
} from "./modules/vacationRequests/pages/VacationRequestsUpdatePage/VacationRequestsUpdatePage";
import { TrackerPage } from "./modules/timeTracker/pages/TrackerPage/TrackerPage";
import { RemoveUserModal } from "./modules/users/components/RemoveUserModal/RemoveUserModal";
import { UpdateUserModal } from "./modules/users/components/UpdateUserModal/UpdateUserModal";
import { CreateReportModal } from "./modules/excelExport/components/CreateReportModal";
import { ResetPasswordUserModal } from "./modules/users/components/ResetPassword/ResetPasswordUserModal";
import { SickLeaveIndexPage } from "./modules/sickLeave/pages/SickLeaveIndexPage";
import { SickLeaveCreatePage } from "./modules/sickLeave/pages/SickLeaveCreatePage";
import { SickLeaveUpdatePage } from "./modules/sickLeave/pages/SickLeaveUpdatePage";
import { UsersProfilePage } from "./modules/users/pages/UsersProfilePage/UsersProfilePage";
import { CreateTrackModal } from "./modules/users/components/CreateTrackModal/CreateTrackModal";
import { SickLeaveUploadFilesPage } from "./modules/sickLeave/pages/SickLeaveUploadFilesPage";
import { CompaniesIndexPage } from './modules/companies/pages/CompaniesIndexPage';
import { CompaniesCreatePage } from './modules/companies/pages/CompaniesCreatePage';
import { CompaniesUpdatePage } from './modules/companies/pages/CompaniesUpdatePage';

export const App = () => {
    const initialised = useSelector((state: RootState) => state.app.initialised)
    const isAuth = useSelector((state: RootState) => state.auth.isAuth)
    const dispatch = useDispatch()
    const location = useLocation();
    // @ts-ignore
    const popup = location.state && location.state.popup;

    useEffect(() => {
        dispatch(authActions.meAsync())
    }, [])


    if (!initialised)
        return <Loading />

    return (
        <>
            <Settings />
            <Notifications />
            <NavigateTo />
            {isAuth
                ? <AppLayout>
                    <Routes location={popup || location}>
                        <Route index element={<Navigate to={'/time-tracker'} />} />
                        <Route path={'calendar/*'} element={<CalendarPage />}>
                            <Route path={'*'} element={<Error />} />
                        </Route>
                        <Route path={'users/*'}>
                            <Route index element={<UsersPage />} />
                            <Route path={'profile/:email'} element={<UsersProfilePage />} />
                            <Route path={'*'} element={<Error />} />
                        </Route>
                        <Route path={'settings/:tab'} element={<SettingsPage />} />
                        <Route path={'my-settings/:tab'} element={<MySettingsPage />} />
                        <Route path={"auth/*"}>
                            <Route path="login" element={<Navigate to={'/time-tracker'} />} />
                            <Route path="reset-password/:token" element={<Navigate to={'/time-tracker'} />} />
                        </Route>
                        <Route path={"tools/*"}>
                            <Route path={"file-manager/*"}>
                                <Route index element={<FileManagerGetInFolderPage />} />
                            </Route>
                        </Route>
                        <Route path={'time-tracker/*'} element={<TrackerPage />} />
                        <Route path={"vacation-requests/*"} element={<VacationRequestsIndexPage />} />
                        <Route path={"sick-leave-days/*"} element={<SickLeaveIndexPage />} />
                        <Route path={"companies/*"} element={<CompaniesIndexPage />} />
                        <Route path={'error'} element={<Error />} />
                        <Route path={'error/:statusCode'} element={<Error />} />
                        <Route path={'*'} element={<Error />} />
                    </Routes>
                    {popup && (
                        <Routes>
                            <Route path={'calendar/*'}>
                                <Route path={'days/*'}>
                                    <Route path=":date" element={<CalendarDaysViewPage />} />
                                    <Route path="create" element={<CalendarDaysCreatePage />} />
                                    <Route path="update/:date" element={<CalendarDaysUpdatePage />} />
                                    <Route path="remove" element={<CalendarDaysRemovePage />} />
                                    <Route path="remove/:date" element={<CalendarDaysRemovePage />} />
                                </Route>
                            </Route>
                            <Route path={'users/*'}>
                                <Route path="create" element={<CreateUserModal />} />
                                <Route path="remove/:email" element={<RemoveUserModal />} />
                                <Route path="update/:email" element={<UpdateUserModal />} />
                                <Route path="reset-password/:id" element={<ResetPasswordUserModal />} />
                                <Route path="profile/:email/create-track" element={<CreateTrackModal />} />
                                <Route path="createReport" element={<CreateReportModal />} />
                            </Route>
                            <Route path={"tools/*"}>
                                <Route path={"file-manager/*"}>
                                    <Route path="create-folder" element={<FileManagerCreateFolder />} />
                                    <Route path="upload-files" element={<FileManagerUploadFile />} />
                                </Route>
                            </Route>
                            <Route path={"vacation-requests/*"}>
                                <Route path={'create'} element={<VacationRequestsCreatePage />} />
                                <Route path={'update/:id'} element={<VacationRequestsUpdatePage />} />
                            </Route>
                            <Route path={'sick-leave-days/*'}>
                                <Route path={'create'} element={<SickLeaveCreatePage />} />
                                <Route path={'update/:id'} element={<SickLeaveUpdatePage />} />
                                <Route path={'upload-files/:id'} element={<SickLeaveUploadFilesPage />} />
                            </Route>
                            <Route path={'companies/*'}>
                                <Route path={'create'} element={<CompaniesCreatePage />} />
                                <Route path={'update/:id'} element={<CompaniesUpdatePage />} />
                            </Route>
                            <Route path={'time-tracker/*'}>
                                {/*<Route path={'create'} element={<TrackCreatePage/>}/>*/}
                            </Route>
                        </Routes>
                    )}
                </AppLayout>
                : <Routes>
                    <Route path={"auth/*"}>
                        <Route path="login" element={<AuthLoginPage />} />
                        <Route path="request-reset-password" element={<AuthRequestResetPasswordPage />} />
                        <Route path="reset-password/:token" element={<AuthResetPasswordPage />} />
                    </Route>
                    <Route path={'*'} element={<Navigate to={'/auth/login'} />} />
                </Routes>
            }
        </>
    );
}