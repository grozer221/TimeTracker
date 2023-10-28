import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CalendarDay } from "../graphQL/calendarDays.types";
import { getDateNow } from "../../../utils/dateUtils";
import {
    CalendarDaysCreateInputType,
    CalendarDaysCreateRangeInputType,
    CalendarDaysUpdateInputType
} from "../graphQL/calendarDays.mutations";
import { DayOfWeek } from "../../../behaviour/enums/DayOfWeek";


type InitialState = {
    selectedDate: string,
    calendarDayByDate: CalendarDay | null,
    loadingGetByDate: boolean,
    calendarDays: CalendarDay[],
    loadingGet: boolean,
    loadingCreate: boolean,
    loadingUpdate: boolean,
    loadingRemove: boolean,
}

const initialState: InitialState = {
    selectedDate: getDateNow(),
    calendarDayByDate: null,
    loadingGetByDate: false,
    calendarDays: [],
    loadingGet: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingRemove: false,
}

export const calendarDaysSlice = createSlice({
    name: 'calendarDays',
    initialState,
    reducers: {
        getByDateAsync: (state, action: PayloadAction<{ date: string }>) => state,
        setLoadingGetByDate: (state, action: PayloadAction<boolean>) => {
            state.loadingGetByDate = action.payload;
        },
        setCalendarDayByDate: (state, action: PayloadAction<CalendarDay>) => {
            state.calendarDayByDate = action.payload;
        },

        setSelectedDate: (state, action: PayloadAction<string>) => {
            state.selectedDate = action.payload;
        },
        setCalendarDays: (state, action: PayloadAction<CalendarDay[]>) => {
            state.calendarDays = action.payload;
        },
        addCalendarDays: (state, action: PayloadAction<CalendarDay[]>) => {
            const unique = action.payload.filter(val => !state.calendarDays.some(day => day.id === val.id));
            state.calendarDays = [...state.calendarDays, ...unique];
        },
        getAsync: (state, action: PayloadAction<{ from: string, to: string }>) => state,
        setLoadingGet: (state, action: PayloadAction<boolean>) => {
            state.loadingGet = action.payload;
        },

        createAsync: (state, action: PayloadAction<CalendarDaysCreateInputType>) => state,
        createRangeAsync: (state, action: PayloadAction<CalendarDaysCreateRangeInputType>) => state,
        setLoadingCreate: (state, action: PayloadAction<boolean>) => {
            state.loadingCreate = action.payload;
        },

        updateCalendarDay: (state, action: PayloadAction<CalendarDay>) => {
            state.calendarDays = state.calendarDays.map(day =>
                day.id === action.payload.id
                    ? action.payload
                    : day);
        },
        updateAsync: (state, action: PayloadAction<CalendarDaysUpdateInputType>) => state,
        setLoadingUpdate: (state, action: PayloadAction<boolean>) => {
            state.loadingUpdate = action.payload;
        },

        removeCalendarDayByDates: (state, action: PayloadAction<string[]>) => {
            state.calendarDays = state.calendarDays.filter(d => !action.payload.includes(d.date))
        },
        removeCalendarDay: (state, action: PayloadAction<CalendarDay>) => {
            state.calendarDays = state.calendarDays.filter(d => d.id !== action.payload.id)
        },
        removeAsync: (state, action: PayloadAction<string>) => state,
        removeRangeAsync: (state, action: PayloadAction<{ from: string, to: string, daysOfWeek: DayOfWeek[] }>) => state,
        setLoadingRemove: (state, action: PayloadAction<boolean>) => {
            state.loadingRemove = action.payload;
        },

        reset: (state, action: PayloadAction) => {
            state.calendarDays = [];
            state.loadingCreate = false;
            state.loadingUpdate = false;
            state.loadingRemove = false;
        },
    },
})

export const calendarDaysActions = calendarDaysSlice.actions
export const calendarDaysReducer = calendarDaysSlice.reducer
