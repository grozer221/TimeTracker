import { gql } from '@apollo/client';
import { CALENDAR_DAY_FRAGMENT } from "./calendarDays.fragments";
import { CalendarDay } from "./calendarDays.types";
import { DayKind } from "../../../behaviour/enums/DayKind";
import { DayOfWeek } from "../../../behaviour/enums/DayOfWeek";

export type CalendarDaysCreateData = { calendarDays: { create: CalendarDay } }
export type CalendarDaysCreateVars = { calendarDaysCreateInputType: CalendarDaysCreateInputType }
export type CalendarDaysCreateInputType = {
    date: string,
    title: string,
    kind: DayKind,
    workHours: number,
    override: boolean,
}
export const CALENDAR_DAYS_CREATE_MUTATION = gql`
    ${CALENDAR_DAY_FRAGMENT}
    mutation CalendarDaysCreate($calendarDaysCreateInputType: CalendarDaysCreateInputType!) {
        calendarDays {
            create(calendarDaysCreateInputType: $calendarDaysCreateInputType){
                ...CalendarDayFragment
            }
        }
    }
`;

export type CalendarDaysCreateRangeData = { calendarDays: { createRange: CalendarDay[] } }
export type CalendarDaysCreateRangeVars = { calendarDaysCreateRangeInputType: CalendarDaysCreateRangeInputType }
export type CalendarDaysCreateRangeInputType = {
    from: string,
    to: string,
    title: string,
    daysOfWeek: DayOfWeek[],
    kind: DayKind,
    workHours: number,
    override: boolean,
}
export const CALENDAR_DAYS_CREATE_RANGE_MUTATION = gql`
    ${CALENDAR_DAY_FRAGMENT}
    mutation CalendarDaysCreateRange($calendarDaysCreateRangeInputType: CalendarDaysCreateRangeInputType!) {
        calendarDays {
            createRange(calendarDaysCreateRangeInputType: $calendarDaysCreateRangeInputType){
                ...CalendarDayFragment
            }
        }
    }
`;

export type CalendarDaysUpdateData = { calendarDays: { update: CalendarDay } }
export type CalendarDaysUpdateVars = { calendarDaysUpdateInputType: CalendarDaysUpdateInputType }
export type CalendarDaysUpdateInputType = {
    id: string,
    date: string,
    title: string,
    kind: DayKind,
    workHours: number,
}
export const CALENDAR_DAYS_UPDATE_MUTATION = gql`
    ${CALENDAR_DAY_FRAGMENT}
    mutation CalendarDaysCreate($calendarDaysUpdateInputType: CalendarDaysUpdateInputType!) {
        calendarDays {
            update(calendarDaysUpdateInputType: $calendarDaysUpdateInputType){
                ...CalendarDayFragment
            }
        }
    }
`;

export type CalendarDaysRemoveData = { calendarDays: { remove: CalendarDay } }
export type CalendarDaysRemoveVars = { date: string }
export const CALENDAR_DAYS_REMOVE_MUTATION = gql`
    ${CALENDAR_DAY_FRAGMENT}
    mutation CalendarDaysRemove($date: Date!){
        calendarDays{
            remove(date: $date){
                ...CalendarDayFragment
            }
        }
    }
`;

export type CalendarDaysRemoveRangeData = { calendarDays: { removeRange: CalendarDay[] } }
export type CalendarDaysRemoveRangeVars = { calendarDaysRemoveRangeInputType: CalendarDaysRemoveRangeInputType }
export type CalendarDaysRemoveRangeInputType = {
    from: string,
    to: string,
    daysOfWeek: DayOfWeek[],
}
export const CALENDAR_DAYS_REMOVE_RANGE_MUTATION = gql`
    ${CALENDAR_DAY_FRAGMENT}
    mutation CalendarDaysRemoveRange($calendarDaysRemoveRangeInputType: CalendarDaysRemoveRangeInputType!){
        calendarDays{
            removeRange(calendarDaysRemoveRangeInputType: $calendarDaysRemoveRangeInputType){
                ...CalendarDayFragment
            }
        }
    }
`;