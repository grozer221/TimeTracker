import React, {useEffect} from 'react';
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authActions} from "./modules/auth/store/auth.actions";
import {RootState} from "./store/store";
import {Notifications} from "./modules/notifications/components/Notifications/Notifications";
import {NavigateTo} from "./modules/navigate/components/NavigateTo/NavigateTo";
import {Loading} from "./components/Loading/Loading";
import {CalendarPage} from "./modules/calendar/pages/CalendarPage/CalendarPage";
import {CalendarDaysCreatePage} from "./modules/calendarDays/pages/CalendarDaysCreatePage/CalendarDaysCreatePage";
import {Error} from "./components/Error/Error";
import {CalendarDaysUpdatePage} from "./modules/calendarDays/pages/CalendarDaysUpdatePage/CalendarDaysUpdatePage";
import {CalendarDaysRemovePage} from "./modules/calendarDays/pages/CalendarDaysRemovePage/CalendarDaysRemovePage";
import {AppLayout} from "./components/AppLayout/AppLayout";
import {CalendarDaysViewPage} from "./modules/calendarDays/pages/CalendarDaysViewPage/CalendarDaysViewPage";
import {AuthLoginPage} from './modules/auth/pages/AuthLoginPage/AuthLoginPage';
import {SettingsPage} from "./modules/settings/pages/SettingsPage/SettingsPage";
import {Settings} from "./modules/settings/components/Settings/Settings";
import 'antd/dist/antd.css';
import './App.css';
import './assets/Table.css';
import './assets/AntDesignOverride.css';
import {FileManagerGetInFolderPage} from "./modules/fileManager/pages/FileManagerGetInFolderPage/FileManagerGetInFolderPage";
import {FileManagerCreateFolder} from "./modules/fileManager/components/FileManagerCreateFolder/FileManagerCreateFolder";
import {FileManagerUploadFile} from "./modules/fileManager/components/FileManagerUploadFile/FileManagerUploadFile";

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
        return <Loading/>

    return (
        <>
            <Settings/>
            <Notifications/>
            <NavigateTo/>
            {isAuth
                ? <AppLayout>
                    <Routes location={popup || location}>
                        <Route index element={<Navigate to={'/time-tracker'}/>}/>
                        <Route path={'calendar/*'} element={<CalendarPage/>}>
                            <Route path={'*'} element={<Error/>}/>
                        </Route>
                        <Route path={'settings/:tab'} element={<SettingsPage/>}/>
                        <Route path={"auth/*"}>
                            <Route path="login" element={<Navigate to={'/time-tracker'}/>}/>
                        </Route>
                        <Route path={"tools/*"}>
                            <Route path={"file-manager/*"}>
                                <Route index element={<FileManagerGetInFolderPage/>}/>
                            </Route>
                        </Route>
                        <Route path={'error'} element={<Error/>}/>
                        <Route path={'error/:statusCode'} element={<Error/>}/>
                        <Route path={'*'} element={<Error/>}/>
                    </Routes>
                    {popup && (
                        <Routes>
                            <Route path={'calendar/*'}>
                                <Route path={'days/*'}>
                                    <Route path=":date" element={<CalendarDaysViewPage/>}/>
                                    <Route path="create" element={<CalendarDaysCreatePage/>}/>
                                    <Route path="update/:date" element={<CalendarDaysUpdatePage/>}/>
                                    <Route path="remove" element={<CalendarDaysRemovePage/>}/>
                                    <Route path="remove/:date" element={<CalendarDaysRemovePage/>}/>
                                </Route>
                            </Route>
                            <Route path={"tools/*"}>
                                <Route path={"file-manager/*"}>
                                    <Route path="create-folder" element={<FileManagerCreateFolder/>}/>
                                    <Route path="upload-files" element={<FileManagerUploadFile/>}/>
                                </Route>
                            </Route>
                        </Routes>
                    )}
                </AppLayout>
                : <Routes>
                    <Route path={"auth/*"}>
                        <Route path="login" element={<AuthLoginPage/>}/>
                    </Route>
                    <Route path={'*'} element={<Navigate to={'/auth/login'}/>}/>
                </Routes>
            }
        </>
    );
}