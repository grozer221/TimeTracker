export const toUTCDateTime = (dateTime: Date): Date =>
    new Date(dateTime.getTime() + dateTime.getTimezoneOffset() * 60000)