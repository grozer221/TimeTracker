import { gql } from "@apollo/client";

export const SETTINGS_EMPLOYMENT_FRAGMENT = gql`
    fragment SettingsEmploymentFragment on SettingsEmploymentType {
        workdayStartAt
        hoursInWorkday
    }
`

export const SETTINGS_APPLICATION_FRAGMENT = gql`
    fragment SettingsApplicationFragment on SettingsApplicationType {
        title
        faviconUrl
        logoUrl
    }
`

export const SETTINGS_EMAIL_FRAGMENT = gql`
    fragment SettingsEmailFragment on SettingsEmailType {
        name
        address
    }
`

export const SETTINGS_VACATION_REQUESTS_FRAGMENT = gql`
    fragment SettingsVacationRequestsFragment on SettingsVacationRequestsType {
        amountDaysPerYear
    }
`

export const SETTINGS_FRAGMENT = gql`
    ${SETTINGS_EMPLOYMENT_FRAGMENT}
    ${SETTINGS_APPLICATION_FRAGMENT}
    ${SETTINGS_EMAIL_FRAGMENT}
    ${SETTINGS_VACATION_REQUESTS_FRAGMENT}
    fragment SettingsFragment on SettingsType {
        id
        employment {
            ...SettingsEmploymentFragment
        }
        application {
            ...SettingsApplicationFragment
        }
        email {
            ...SettingsEmailFragment
        }
        vacationRequests {
            ...SettingsVacationRequestsFragment
        }
        createdAt
        updatedAt
    }
`