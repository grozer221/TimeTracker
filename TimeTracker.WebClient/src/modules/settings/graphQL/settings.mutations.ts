import { gql } from '@apollo/client';
import { SETTINGS_FRAGMENT } from "./settings.fragments";
import { Settings } from "./settings.types";
import { DayOfWeek } from "../../../behaviour/enums/DayOfWeek";

export type SettingsEmploymentUpdateData = { settings: { updateEmployment: Settings } }
export type SettingsEmploymentUpdateVars = { settingsEmploymentUpdateInputType: SettingsEmploymentUpdateInputType }
export type SettingsEmploymentUpdateInputType = {
    workdayStartAt: string,
    hoursInWorkday: number,
}
export const SETTINGS_EMPLOYMENT_UPDATE_MUTATION = gql`
    ${SETTINGS_FRAGMENT}
    mutation SettingsUpdateEmployment($settingsEmploymentUpdateInputType: SettingsEmploymentUpdateInputType!){
        settings {
            updateEmployment(settingsEmploymentUpdateInputType: $settingsEmploymentUpdateInputType) {
                ...SettingsFragment
            }
        }
    }
`;


export type SettingsApplicationUpdateData = { settings: { updateApplication: Settings } }
export type SettingsApplicationUpdateVars = { settingsApplicationUpdateInputType: SettingsApplicationUpdateInputType }
export type SettingsApplicationUpdateInputType = {
    title?: string,
    faviconUrl?: string,
    logoUrl?: string,
}
export const SETTINGS_APPLICATION_UPDATE_MUTATION = gql`
    ${SETTINGS_FRAGMENT}
    mutation SettingsUpdateApplication($settingsApplicationUpdateInputType: SettingsApplicationUpdateInputType!){
        settings {
            updateApplication(settingsApplicationUpdateInputType: $settingsApplicationUpdateInputType) {
                ...SettingsFragment
            }
        }
    }
`;


export type SettingsEmailUpdateData = { settings: { updateEmail: Settings } }
export type SettingsEmailUpdateVars = { settingsEmailUpdateInputType: SettingsEmailUpdateInputType }
export type SettingsEmailUpdateInputType = {
    name?: string,
    address?: string,
}
export const SETTINGS_EMAIL_UPDATE_MUTATION = gql`
    ${SETTINGS_FRAGMENT}
    mutation SettingsUpdateEmail($settingsEmailUpdateInputType: SettingsEmailUpdateInputType!){
        settings {
            updateEmail(settingsEmailUpdateInputType: $settingsEmailUpdateInputType) {
                ...SettingsFragment
            }
        }
    }
`;

export type SettingsVacationRequestsUpdateData = { settings: { updateVacationRequests: Settings } }
export type SettingsVacationRequestsUpdateVars = { settingsVacationRequestsUpdateInputType: SettingsVacationRequestsUpdateInputType }
export type SettingsVacationRequestsUpdateInputType = {
    amountDaysPerYear: number,
}
export const SETTINGS_VACATION_REQUESTS_UPDATE_MUTATION = gql`
    ${SETTINGS_FRAGMENT}
    mutation SettingsUpdateEmail($settingsVacationRequestsUpdateInputType: SettingsVacationRequestsUpdateInputType!){
        settings {
            updateVacationRequests(settingsVacationRequestsUpdateInputType: $settingsVacationRequestsUpdateInputType) {
                ...SettingsFragment
            }
        }
    }
`;