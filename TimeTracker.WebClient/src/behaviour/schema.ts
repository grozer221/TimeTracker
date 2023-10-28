import {gql} from '@apollo/client';

export const schema = gql`
    schema {
        query: Queries
        mutation: Mutations
    }

    type Queries {
        auth: AuthQueries!
        tracks: TracksQueries!
        users: UsersQueries!
        calendarDays: CalendarDaysQueries!
        settings: SettingsQueries!
        fileManager: FileManagerQueries!
        vacationRequests: VacationRequestsQueries!
        excelExport: ExcelExportQueries!
        sickLeave: SickLeaveQueries!
    }

    type AuthQueries {
        me: AuthResponseType!
    }

    type AuthResponseType {
        user: UserType!
        token: String!
    }

    type UserType {
        id: Guid!
        createdAt: DateTime!
        updatedAt: DateTime!
        firstName: String
        lastName: String
        middleName: String
        email: String!
        role: Role!
        permissions: [Permission]!
        employment: Employment
        usersWhichCanApproveVacationRequest: [UserType]!
    }

    scalar Guid

    """
    The \`DateTime\` scalar type represents a date and time. \`DateTime\` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard.
    """
    scalar DateTime

    enum Role {
        EMPLOYEE
        ADMINISTRATOR
    }

    enum Permission {
        UPDATE_USERS
        UPDATE_OTHERS_TIME_TRACKER
        NOTE_THE_ABSENCE_AND_VACATION
        UPDATE_CALENDAR
        UPDATE_SETTINGS
        UPDATE_FILE_MANAGER
        EXPORT_USERS_TO_EXCEL
    }

    enum Employment {
        FULL_TIME
        PART_TIME
    }

    type TracksQueries {
        get(
            """
            Argument for a search
            """
            like: String!

            """
            Argument represent count of tracks on page
            """
            pageSize: Int! = 0

            """
            Argument represnt page number
            """
            pageNumber: Int! = 0

            """
            Argument for kind filter
            """
            kind: TrackKind
        ): GetTrackResponseType
        getUserTracks(
            """
            Argument for a search
            """
            like: String!

            """
            Argument represent count of tracks on page
            """
            pageSize: Int! = 0

            """
            Argument represnt page number
            """
            pageNumber: Int! = 0

            """
            Argument for kind filter
            """
            kind: TrackKind
        ): GetTrackResponseType
        getTracksByUserId(
            """
            Argument for a search
            """
            like: String!

            """
            Argument represent count of tracks on page
            """
            pageSize: Int! = 0

            """
            Argument represnt page number
            """
            pageNumber: Int! = 0

            """
            Argument for kind filter
            """
            kind: TrackKind

            """
            Argument for a search iser tracks
            """
            userId: Guid! = "00000000-0000-0000-0000-000000000000"
        ): GetTrackResponseType
        getCurrentTrack: TrackType
        getById(
            """
            Id of track
            """
            id: Guid! = "00000000-0000-0000-0000-000000000000"
        ): TrackType
        getTracksByUserIdAndDate(
            """
            User id
            """
            userId: Guid! = "00000000-0000-0000-0000-000000000000"

            """
            year and month for tracks
            """
            date: DateTime! = "0001-01-01T00:00:00"
        ): [TrackType]
    }

    type GetTrackResponseType {
        entities: [TrackType]!
        total: Int!
        pageSize: Int!
        trackKind: TrackKind
    }

    type TrackType {
        id: Guid!
        createdAt: DateTime!
        updatedAt: DateTime!
        userId: Guid!
        title: String
        kind: TrackKind!
        startTime: DateTime
        endTime: DateTime
    }

    enum TrackKind {
        WORKING
        VACATION
        SICK
    }

    type UsersQueries {
        get(
            """
            Filter for a search by multiple parameters
            """
            filter: UserFilterType!

            """
            Argument represent count of tracks on page
            """
            take: Int! = 0

            """
            Argument represnt page number
            """
            skip: Int! = 0
        ): GetUserResponseType!
        getById(
            """
            Id of user
            """
            id: Guid! = "00000000-0000-0000-0000-000000000000"
        ): UserType!
        getByEmail(
            """
            Email of user
            """
            email: String!
        ): UserType!
    }

    type GetUserResponseType {
        entities: [UserType]!
        total: Int!
        pageSize: Int!
        trackKind: TrackKind
    }

    input UserFilterType {
        email: String
        firstName: String
        lastName: String
        middleName: String
        permissions: [Permission]
        roles: [Role]
        employments: [Employment]
    }

    type CalendarDaysQueries {
        get(
            """
            Argument for get From calendar days
            """
            calendarDaysGetInputType: CalendarDaysGetInputType!
        ): [CalendarDayType]!
        getByDate(
            """
            Argument for get calendar day
            """
            date: Date! = "0001-01-01"
        ): CalendarDayType!
        getWorkingHoursInThisMonth: Int!
    }

    type CalendarDayType {
        id: Guid!
        createdAt: DateTime!
        updatedAt: DateTime!
        date: Date!
        title: String
        kind: DayKind!
        workHours: Int!
    }

    """
    The \`Date\` scalar type represents a year, month and day in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard.
    """
    scalar Date

    enum DayKind {
        DAY_OFF
        HOLIDAY
        SHORT_DAY
    }

    input CalendarDaysGetInputType {
        from: Date!
        to: Date!
    }

    type SettingsQueries {
        get: SettingsType!
    }

    type SettingsType {
        id: Guid!
        createdAt: DateTime!
        updatedAt: DateTime!
        employment: SettingsEmploymentType!
        application: SettingsApplicationType!
        tasks: SettingsTasksType!
        email: SettingsEmailType!
        vacationRequests: SettingsVacationRequestsType!
    }

    type SettingsEmploymentType {
        workdayStartAt: DateTime
        hoursInWorkday: Int!
    }

    type SettingsApplicationType {
        title: String
        faviconUrl: String
        logoUrl: String
    }

    type SettingsTasksType {
        autoCreateTracks: SettingsTasksAutoCreateTracksType
        autoCreateDaysOff: SettingsTasksAutoCreateDaysOffType
    }

    type SettingsTasksAutoCreateTracksType {
        isEnabled: Boolean
        timeWhenCreate: DateTime
    }

    type SettingsTasksAutoCreateDaysOffType {
        isEnabled: Boolean
        dayOfWeekWhenCreate: DayOfWeek
        timeWhenCreate: DateTime
        daysOfWeek: [DayOfWeek]
    }

    enum DayOfWeek {
        SUNDAY
        MONDAY
        TUESDAY
        WEDNESDAY
        THURSDAY
        FRIDAY
        SATURDAY
    }

    type SettingsEmailType {
        name: String
        address: String
    }

    type SettingsVacationRequestsType {
        amountDaysPerYear: Int
    }

    type FileManagerQueries {
        getInFolder(
            """
            Argument for get in directory
            """
            folderPath: String!
        ): [FileManagerItemType]!
    }

    type FileManagerItemType {
        name: String!
        path: String
        createdAt: String
        kind: FileManagerItemKind!
        permissions: FileManagerItemPermissions!
    }

    enum FileManagerItemKind {
        FILE
        FOLDER
    }

    enum FileManagerItemPermissions {
        READ
        READ_AND_WRITE
    }

    type VacationRequestsQueries {
        getAvailableDays: Int!
        get(
            """
            Argument represent count of tracks on page
            """
            vacationRequestsGetInputType: VacationRequestsGetInputType!
        ): GetVacationRequestResponseType!
        getById(
            """
            Id of user
            """
            id: Guid! = "00000000-0000-0000-0000-000000000000"
        ): VacationRequestType!
    }

    type GetVacationRequestResponseType {
        entities: [VacationRequestType]!
        total: Int!
        pageSize: Int!
        trackKind: TrackKind
    }

    type VacationRequestType {
        id: Guid!
        createdAt: DateTime!
        updatedAt: DateTime!
        dateStart: Date!
        dateEnd: Date!
        comment: String
        status: VacationRequestStatus!
        userId: Guid!
        user: UserType!
    }

    enum VacationRequestStatus {
        NEW
        APPROVED
        NOT_APPROVED
    }

    input VacationRequestsGetInputType {
        pageNumber: Int!
        pageSize: Int!
        filter: VacationRequestsFilterInputType!
    }

    input VacationRequestsFilterInputType {
        statuses: [VacationRequestStatus]!
        userIds: [Guid]!
        kind: VacationRequestsFilterKind!
    }

    enum VacationRequestsFilterKind {
        MINE
        CAN_APPROVE
        ALL
    }

    type ExcelExportQueries {
        createReport(
            """
            Argument for create excel report
            """
            excelExportInputType: ExcelExportInputType!
        ): [Byte]
    }

    scalar Byte

    input ExcelExportInputType {
        filter: UserFilterType!
        date: DateTime!
    }

    type SickLeaveQueries {
        get(
            """
            Argument represent sick leave model for get
            """
            sickLeaveGetInputType: SickLeaveGetInputType!
        ): GetSickLeaveResponseType!
        getById(
            """
            Id of sick leave day
            """
            id: Guid! = "00000000-0000-0000-0000-000000000000"
        ): SickLeaveType!
    }

    type GetSickLeaveResponseType {
        entities: [SickLeaveType]!
        total: Int!
        pageSize: Int!
        trackKind: TrackKind
    }

    type SickLeaveType {
        id: Guid!
        createdAt: DateTime!
        updatedAt: DateTime!
        startDate: Date!
        endDate: Date!
        comment: String
        userId: Guid!
        user: UserType!
    }

    input SickLeaveGetInputType {
        pageNumber: Int!
        pageSize: Int!
        filter: SickLeaveFilterType!
    }

    input SickLeaveFilterType {
        kind: SickLeaveFilterKind!
    }

    enum SickLeaveFilterKind {
        MINE
        ALL
    }

    type Mutations {
        auth: AuthMutations!
        tracks: TracksMutation!
        users: UsersMutations!
        calendarDays: CalendarDaysMutations!
        settings: SettingsMutations!
        cache: CacheMutations!
        fileManager: FileManagerMutations!
        vacationRequests: VacationRequestsMutations!
        sickLeave: SickLeaveMutations!
    }

    type AuthMutations {
        login(
            """
            Argument for login User
            """
            authLoginInputType: AuthLoginInputType!
        ): AuthResponseType!
        logout: Boolean!
        register(
            """
            Argument for register User
            """
            authRegisterInputType: AuthRegisterInputType!
        ): AuthResponseType!
        changePassword(
            """
            Argument for change User password
            """
            authChangePasswordInputType: AuthChangePasswordInputType!
        ): Boolean!
        impersonate(
            """
            Argument for Impersonate User
            """
            userId: Guid! = "00000000-0000-0000-0000-000000000000"
        ): AuthResponseType!
        requestResetPassword(
            authRequestResetPasswordInputType: AuthRequestResetPasswordInputType!
        ): Boolean!
        resetPassword(
            authResetPasswordInputType: AuthResetPasswordInputType!
        ): Boolean!
    }

    input AuthLoginInputType {
        email: String!
        password: String!
    }

    input AuthRegisterInputType {
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        middleName: String!
    }

    input AuthChangePasswordInputType {
        oldPassword: String!
        newPassword: String!
    }

    input AuthRequestResetPasswordInputType {
        email: String!
    }

    input AuthResetPasswordInputType {
        password: String!
        token: String!
    }

    type TracksMutation {
        create(
            """
            Argument for create track
            """
            trackInput: TrackInputType!
        ): TrackType!
        createOther(
            """
            Argument for create track
            """
            trackInput: TrackOtherInputType!
        ): TrackType!
        remove(
            """
            Argument for delete track
            """
            trackInput: TrackRemoveInputType!
        ): String
        update(
            """
            Argument for update track
            """
            trackInput: TrackUpdateInputType!
        ): TrackType!
    }

    input TrackInputType {
        title: String
        kind: TrackKind!
        startTime: DateTime
        endTime: DateTime
    }

    input TrackOtherInputType {
        userId: Guid!
        title: String
        kind: TrackKind!
        startTime: DateTime!
        endTime: DateTime!
    }

    input TrackRemoveInputType {
        id: Guid!
    }

    input TrackUpdateInputType {
        id: Guid!
        title: String
        kind: TrackKind!
        startTime: DateTime
        endTime: DateTime
    }

    type UsersMutations {
        create(
            """
            Argument for create user
            """
            usersCreateInputType: UsersCreateInputType!
        ): UserType!
        update(
            """
            Argument for update user
            """
            usersUpdateInputType: UsersUpdateInputType!
        ): UserType!
        updatePassword(
            """
            Arguments for update password for user
            """
            usersUpdatePasswordInputType: UsersUpdatePasswordInputType!
        ): UserType!
        remove(
            """
            Argument for remove user
            """
            usersRemoveInputType: UsersRemoveInputType!
        ): UserType!
    }

    input UsersCreateInputType {
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        middleName: String!
        permissions: [Permission]!
        employment: Employment!
        usersWhichCanApproveVacationRequestIds: [Guid]!
    }

    input UsersUpdateInputType {
        id: Guid!
        email: String!
        firstName: String!
        lastName: String!
        middleName: String!
        employment: Employment!
        permissions: [Permission]!
        usersWhichCanApproveVacationRequestIds: [Guid]!
    }

    input UsersUpdatePasswordInputType {
        id: Guid!
        password: String!
        confirmPassword: String!
    }

    input UsersRemoveInputType {
        email: String!
    }

    type CalendarDaysMutations {
        create(
            """
            Argument for create calendar day
            """
            calendarDaysCreateInputType: CalendarDaysCreateInputType!
        ): CalendarDayType!
        createRange(
            """
            Argument for create calendar day
            """
            calendarDaysCreateRangeInputType: CalendarDaysCreateRangeInputType!
        ): [CalendarDayType]!
        update(
            """
            Argument for update calendar day
            """
            calendarDaysUpdateInputType: CalendarDaysUpdateInputType!
        ): CalendarDayType!
        remove(
            """
            Argument for remove calendar day
            """
            date: Date! = "0001-01-01"
        ): CalendarDayType!
        removeRange(
            """
            Argument for remove calendar day
            """
            calendarDaysRemoveRangeInputType: CalendarDaysRemoveRangeInputType!
        ): [CalendarDayType]!
    }

    input CalendarDaysCreateInputType {
        title: String
        date: Date!
        kind: DayKind!
        workHours: Int!
        override: Boolean!
    }

    input CalendarDaysCreateRangeInputType {
        title: String
        from: Date!
        to: Date!
        daysOfWeek: [DayOfWeek]!
        kind: DayKind!
        workHours: Int!
        override: Boolean!
    }

    input CalendarDaysUpdateInputType {
        id: Guid!
        title: String
        date: Date!
        kind: DayKind!
        workHours: Int!
    }

    input CalendarDaysRemoveRangeInputType {
        from: Date!
        to: Date!
        daysOfWeek: [DayOfWeek]!
    }

    type SettingsMutations {
        updateEmployment(
            """
            Argument for update employment settings
            """
            settingsEmploymentUpdateInputType: SettingsEmploymentUpdateInputType!
        ): SettingsType!
        updateApplication(
            """
            Argument for update application settings
            """
            settingsApplicationUpdateInputType: SettingsApplicationUpdateInputType!
        ): SettingsType!
        updateTasks(
            """
            Argument for update tasks settings
            """
            settingsTasksUpdateInputType: SettingsTasksUpdateInputType!
        ): SettingsType!
        updateEmail(
            """
            Argument for update tasks settings
            """
            settingsEmailUpdateInputType: SettingsEmailUpdateInputType!
        ): SettingsType!
        updateVacationRequests(
            """
            Argument for update tasks settings
            """
            settingsVacationRequestsUpdateInputType: SettingsVacationRequestsUpdateInputType!
        ): SettingsType!
    }

    input SettingsEmploymentUpdateInputType {
        workdayStartAt: TimeOnly
        hoursInWorkday: Int!
    }

    """
    The \`Time\` scalar type represents a time in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard. Format is \`HH:mm:ss.FFFFFFF\`.
    """
    scalar TimeOnly

    input SettingsApplicationUpdateInputType {
        title: String
        faviconUrl: String
        logoUrl: String
    }

    input SettingsTasksUpdateInputType {
        autoCreateTracks: SettingsTasksAutoCreateTracksInputType
        autoCreateDaysOff: SettingsTasksAutoCreateDaysOffInputType
    }

    input SettingsTasksAutoCreateTracksInputType {
        isEnabled: Boolean!
        timeWhenCreate: TimeOnly
    }

    input SettingsTasksAutoCreateDaysOffInputType {
        isEnabled: Boolean!
        dayOfWeekWhenCreate: DayOfWeek
        timeWhenCreate: TimeOnly
        daysOfWeek: [DayOfWeek]
    }

    input SettingsEmailUpdateInputType {
        name: String
        address: String
    }

    input SettingsVacationRequestsUpdateInputType {
        amountDaysPerYear: Int!
    }

    type CacheMutations {
        refreshApp: Boolean!
    }

    type FileManagerMutations {
        createFolder(
            """
            Argument for get in directory
            """
            fileManagerCreateFolderInputType: FileManagerCreateFolderInputType!
        ): Boolean!
        uploadFiles(
            """
            Argument for update employment settings
            """
            fileManagerUploadFilesInputType: FileManagerUploadFilesInputType!
        ): [FileManagerItemType]!
        renameFile(
            """
            Argument for update employment settings
            """
            fileManagerRenameInputType: FileManagerRenameInputType!
        ): FileManagerItemType!
        remove(
            """
            Argument for update employment settings
            """
            fileManagerRemoveInputType: FileManagerRemoveInputType!
        ): Boolean!
    }

    input FileManagerCreateFolderInputType {
        folderPath: String!
        newFolderName: String!
    }

    input FileManagerUploadFilesInputType {
        folderPath: String!
        files: [Upload]!
    }

    """
    A meta type that represents a file upload.
    """
    scalar Upload

    input FileManagerRenameInputType {
        fromPath: String!
        toName: String!
    }

    input FileManagerRemoveInputType {
        path: String!
        kind: FileManagerItemKind!
    }

    type VacationRequestsMutations {
        create(
            vacationRequestsCreateInputType: VacationRequestsCreateInputType!
        ): VacationRequestType!
        updateStatus(
            vacationRequestsUpdateStatusInputType: VacationRequestsUpdateStatusInputType!
        ): VacationRequestType!
        remove(id: Guid! = "00000000-0000-0000-0000-000000000000"): Boolean!
    }

    input VacationRequestsCreateInputType {
        dateStart: Date!
        dateEnd: Date!
        comment: String
    }

    input VacationRequestsUpdateStatusInputType {
        id: Guid!
        status: VacationRequestStatus!
    }

    type SickLeaveMutations {
        create(sickLeaveCreateInputType: SickLeaveCreateInputType!): SickLeaveType!
        remove(id: Guid! = "00000000-0000-0000-0000-000000000000"): Boolean!
        update(sickLeaveUpdateInputType: SickLeaveUpdateInputType!): SickLeaveType!
    }

    input SickLeaveCreateInputType {
        startDate: Date!
        endDate: Date!
        comment: String
        userId: Guid!
    }

    input SickLeaveUpdateInputType {
        id: Guid!
        startDate: Date
        endDate: Date
        comment: String
    }
`