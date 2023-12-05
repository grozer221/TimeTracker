import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SickLeaveFilterKind, SickLeaveType } from "../sickLeaveType";
import { SickLeaveGetInputType } from "../graphQL/sickLeave.queries";
import {
    SickLeaveCreateInputType,
    SickLeaveUpdateInputType,
    SickLeaveUploadFilesInputType
} from "../graphQL/sickLeave.mutation";
import { GetEntitiesResponse } from "../../../behaviour";

type InitialState = {
    sickLeaveDays: GetEntitiesResponse<SickLeaveType>
    sickLeaveGetInputType: SickLeaveGetInputType
    sickLeaveDay: SickLeaveType | null
    loadingGetById: boolean,
    loadingGet: boolean,
    loadingCreate: boolean,
    loadingUpdate: boolean,
    loadingRemove: boolean,


}

const initialState: InitialState = {
    sickLeaveDays: {
        pageSize: 0,
        total: 0,
        entities: [],
    },
    sickLeaveGetInputType: {
        pageSize: 10,
        pageNumber: 1,
        filter: { kind: SickLeaveFilterKind.mine },
    },
    sickLeaveDay: null,
    loadingGetById: false,
    loadingGet: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingRemove: false,
}

export const sickLeaveSlice = createSlice({
    name: 'sickLeave',
    initialState,
    reducers: {
        getByIdAsync: (state, action: PayloadAction<{ id: string }>) => state,
        getById: (state, action: PayloadAction<SickLeaveType>) => {
            state.sickLeaveDay = action.payload
        },
        setLoadingGetById: (state, action: PayloadAction<boolean>) => {
            state.loadingGetById = action.payload
        },
        getAsync: (state, action: PayloadAction<SickLeaveGetInputType>) => state,
        get: (state, action: PayloadAction<GetEntitiesResponse<SickLeaveType>>) => {
            state.sickLeaveDays = action.payload
        },
        setLoadingGet: (state, action: PayloadAction<boolean>) => {
            state.loadingGet = action.payload
        },

        createAsync: (state, action: PayloadAction<SickLeaveCreateInputType>) => state,
        setLoadingCreate: (state, action: PayloadAction<boolean>) => {
            state.loadingCreate = action.payload;
        },

        uploadFilesAsync: (state, action: PayloadAction<SickLeaveUploadFilesInputType>) => state,
        updateAsync: (state, action: PayloadAction<SickLeaveUpdateInputType>) => state,
        setLoadingUpdate: (state, action: PayloadAction<boolean>) => {
            state.loadingUpdate = action.payload;
        },

        removeAsync: (state, action: PayloadAction<{ id: string }>) => state,
        setLoadingRemove: (state, action: PayloadAction<boolean>) => {
            state.loadingRemove = action.payload;
        },

        setSickLeaveGetInputType: (state, action: PayloadAction<SickLeaveGetInputType>) => {
            state.sickLeaveGetInputType = action.payload
        },

        clear: (state, action: PayloadAction) => {
            state.sickLeaveDays = {
                pageSize: 0,
                total: 0,
                entities: [],
            };
            state.sickLeaveGetInputType = {
                pageSize: 10,
                pageNumber: 1,
                filter: { kind: SickLeaveFilterKind.mine },
            };
            state.sickLeaveDay = null;
            state.loadingGetById = false;
            state.loadingGet = false;
            state.loadingCreate = false;
            state.loadingUpdate = false;
            state.loadingRemove = false;
        },
    },
})

export const sickLeaveActions = sickLeaveSlice.actions
export const sickLeaveReducer = sickLeaveSlice.reducer