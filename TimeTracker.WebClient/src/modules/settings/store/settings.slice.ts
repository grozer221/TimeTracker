import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Settings, SubscriptionKind } from "../graphQL/settings.types";
import {
    SettingsApplicationUpdateInputType,
    SettingsEmailUpdateInputType,
    SettingsEmploymentUpdateInputType,
    SettingsVacationRequestsUpdateInputType
} from "../graphQL/settings.mutations";

type InitialState = {
    settings?: Settings | null,
    loadingGet: boolean,
    loadingUpdate: boolean,
}

const initialState: InitialState = {
    settings: null,
    loadingGet: false,
    loadingUpdate: false,
}


export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSettings: (state, action: PayloadAction<Settings | undefined>) => {
            state.settings = {
                ...action.payload!,
                subscriptions: {
                    all: [
                        {
                            kind: SubscriptionKind.None,
                            companyEmploeeMaxCount: 50,
                            priceUsd: 0,
                        },
                        {
                            kind: SubscriptionKind.Pro,
                            companyEmploeeMaxCount: 500,
                            priceUsd: 15,
                        },
                    ],
                    current: {
                        kind: SubscriptionKind.None,
                        companyEmploeeMaxCount: 50,
                        priceUsd: 0,
                    },
                }
            };
        },
        getForAdministratorOrHavePermissionUpdateAsync: (state, action: PayloadAction) => state,
        getForEmployee: (state, action: PayloadAction) => state,
        setLoadingGet: (state, action: PayloadAction<boolean>) => {
            state.loadingGet = action.payload
        },
        updateEmploymentAsync: (state, action: PayloadAction<SettingsEmploymentUpdateInputType>) => state,
        updateApplicationAsync: (state, action: PayloadAction<SettingsApplicationUpdateInputType>) => state,
        updateEmailAsync: (state, action: PayloadAction<SettingsEmailUpdateInputType>) => state,
        updateVacationRequestsAsync: (state, action: PayloadAction<SettingsVacationRequestsUpdateInputType>) => state,
        setLoadingUpdate: (state, action: PayloadAction<boolean>) => {
            state.loadingUpdate = action.payload;
        },
        reset: (state, action: PayloadAction) => {
            state.settings = null;
            state.loadingGet = false;
            state.loadingUpdate = false;
        },
    },
})

export const settingsActions = settingsSlice.actions
export const settingsReducer = settingsSlice.reducer
