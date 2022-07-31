import {DayOfWeek} from "../../../graphQL/enums/DayOfWeek";

export type Settings = {
    id: string,
    employment: SettingsEmployment,
    application: SettingsApplication,
    tasks: SettingsTasks,
    email: SettingsEmail,
    vacationRequests: SettingsVacationRequests,
    createdAt: string,
    updatedAt: string,
}

export type SettingsVacationRequests = {
    amountDaysPerYear: number,
}

export type SettingsEmployment = {
    workdayStartAt: string,
    hoursInWorkday: number,
}

export type SettingsApplication = {
    title?: string,
    faviconUrl?: string,
    logoUrl?: string,
}

export type SettingsTasks = {
    autoCreateTracks: SettingsTasks_autoCreateTracks,
    autoCreateDaysOff: SettingsTasks_AutoCreateDaysOff,
}

export type SettingsTasks_AutoCreateDaysOff = {
    isEnabled: boolean,
    dayOfWeekWhenCreate: DayOfWeek,
    timeWhenCreate: string,
    daysOfWeek: DayOfWeek[],
}

export type SettingsTasks_autoCreateTracks = {
    isEnabled: boolean,
    timeWhenCreate: string,
}

export type SettingsEmail = {
    name: string,
    address: string,
}