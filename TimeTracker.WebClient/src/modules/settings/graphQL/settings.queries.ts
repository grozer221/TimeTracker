import {gql} from '@apollo/client';
import {
    SETTINGS_APPLICATION_FRAGMENT,
    SETTINGS_EMPLOYMENT_FRAGMENT,
    SETTINGS_FRAGMENT,
    SETTINGS_VACATION_REQUESTS_FRAGMENT
} from "./settings.fragments";
import {Settings} from "./settings.types";

export type SettingsGetData = { settings: { get: Settings } }
export type SettingsGetVars = {}
export const SETTINGS_GET_FOR_ADMINISTRATOR_OR_HAVE_PERMISSION_UPDATE_QUERY = gql`
    ${SETTINGS_FRAGMENT}
    query SettingsGet {
        settings {
            get {
                ...SettingsFragment
            }
        }
    }
`;

export const SETTINGS_GET_FOR_EMPLOYEE_QUERY = gql`
    ${SETTINGS_APPLICATION_FRAGMENT}
    ${SETTINGS_EMPLOYMENT_FRAGMENT}
    ${SETTINGS_VACATION_REQUESTS_FRAGMENT}
    query SettingsGet {
        settings {
            get {
                application {
                    ...SettingsApplicationFragment
                }
                employment {
                    ...SettingsEmploymentFragment
                }
                vacationRequests {
                    ...SettingsVacationRequestsFragment
                }
            }
        }
    }
`;