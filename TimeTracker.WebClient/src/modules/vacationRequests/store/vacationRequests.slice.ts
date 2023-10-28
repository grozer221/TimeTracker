import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacationRequest } from "../graphQL/vacationRequests.types";
import { VacationRequestsFilterKind, VacationRequestsGetInputType } from "../graphQL/vacationRequests.queries";
import {
    VacationRequestsCreateInputType,
    VacationRequestsUpdateStatusInputType
} from "../graphQL/vacationRequests.mutations";
import { GetEntitiesResponse } from "../../../behaviour";

type InitialState = {
    availableDays: number,
    loadingGetAvailableDays: boolean,
    vacationRequests: GetEntitiesResponse<VacationRequest>
    loadingGetById: boolean,
    loadingGet: boolean,
    vacationRequestsGetInputType: VacationRequestsGetInputType
    loadingCreate: boolean,
    loadingUpdate: boolean,
    loadingRemove: boolean,
}

const initialState: InitialState = {
    availableDays: 0,
    loadingGetAvailableDays: false,
    vacationRequests: {
        pageSize: 0,
        total: 0,
        entities: [],
    },
    vacationRequestsGetInputType: {
        pageSize: 10,
        pageNumber: 1,
        filter: {
            statuses: [],
            userIds: [],
            kind: VacationRequestsFilterKind.Mine,
        }
    },
    loadingGetById: false,
    loadingGet: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingRemove: false,
}

export const vacationRequestsSlice = createSlice({
    name: 'vacationRequests',
    initialState,
    reducers: {
        getByIdAsync: (state, action: PayloadAction<{ id: string }>) => state,
        setLoadingGetById: (state, action: PayloadAction<boolean>) => {
            state.loadingGetById = action.payload
        },

        getAsync: (state, action: PayloadAction<VacationRequestsGetInputType>) => state,
        setVacationRequestsGetInputType: (state, action: PayloadAction<VacationRequestsGetInputType>) => {
            state.vacationRequestsGetInputType = action.payload;
        },
        setVacationRequests: (state, action: PayloadAction<GetEntitiesResponse<VacationRequest>>) => {
            state.vacationRequests = action.payload;
        },
        setLoadingGet: (state, action: PayloadAction<boolean>) => {
            state.loadingGet = action.payload
        },

        getAvailableDaysAsync: (state, action: PayloadAction) => state,
        setAvailableDays: (state, action: PayloadAction<number>) => {
            state.availableDays = action.payload;
        },
        setLoadingGetAvailableDays: (state, action: PayloadAction<boolean>) => {
            state.loadingGetAvailableDays = action.payload
        },

        createAsync: (state, action: PayloadAction<VacationRequestsCreateInputType>) => state,
        setLoadingCreate: (state, action: PayloadAction<boolean>) => {
            state.loadingCreate = action.payload;
        },


        updateStatusAsync: (state, action: PayloadAction<VacationRequestsUpdateStatusInputType>) => state,
        setLoadingUpdate: (state, action: PayloadAction<boolean>) => {
            state.loadingUpdate = action.payload;
        },

        removeAsync: (state, action: PayloadAction<{ id: string }>) => state,
        setLoadingRemove: (state, action: PayloadAction<boolean>) => {
            state.loadingRemove = action.payload;
        },
    },
})

export const vacationRequestsActions = vacationRequestsSlice.actions
export const vacationRequestsReducer = vacationRequestsSlice.reducer
