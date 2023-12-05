import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Track } from "../../../tracks/graphQL/tracks.types";
import { GetTracksByUserIdAndDateInputType, GetTracksInputData } from "../../../tracks/graphQL/tracks.queries";
import { Statistic } from "../graphQL/statistic.type";
import { GetStatisticInputType } from "../graphQL/statistic.queries";
import { TrackKind } from "../../../../behaviour/enums/TrackKind";
import { TrackCreation } from "../../../../behaviour/enums/TrackCreation";
import {
    CreateTrackForOtherUserInput,
    CreateTrackInput,
    RemoveTrackInput,
    UpdateTrackInput
} from "../../../tracks/graphQL/tracks.mutations";

type InitialState = {
    statistic: Statistic | null,
    getStatisticInputData: GetStatisticInputType,
    loadingGet: boolean
}

const initialState: InitialState = {
    statistic: null,
    getStatisticInputData: {
        UserId: "",
        Date: ""
    },
    loadingGet: false
}

export const statisticSlice = createSlice({
    name: 'statistic',
    initialState,
    reducers: {
        getAsync: (state, action: PayloadAction<GetStatisticInputType>) => state,
        addStatistic: (state, action: PayloadAction<Statistic>) => {
            state.statistic = action.payload
        },
        setLoadingGet: (state, action: PayloadAction<boolean>) => {
            state.loadingGet = action.payload
        },

        setGetStatisticInputData: (state, action: PayloadAction<GetTracksByUserIdAndDateInputType>) => {
            state.getStatisticInputData = action.payload
        },
    }

})

export const statisticAction = statisticSlice.actions
export const statisticReducer = statisticSlice.reducer