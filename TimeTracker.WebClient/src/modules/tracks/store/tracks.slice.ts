import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Track } from "../graphQL/tracks.types";
import {
    CreateTrackForOtherUserInput,
    CreateTrackInput,
    RemoveTrackInput,
    UpdateTrackInput
} from "../graphQL/tracks.mutations";
import { GetTracksByUserIdAndDateInputType, GetTracksInputData } from "../graphQL/tracks.queries";
import { TrackKind } from "../../../behaviour/enums/TrackKind";
import { TrackCreation } from "../../../behaviour/enums/TrackCreation";


type InitialState = {
    tracks: Track[],
    total: number,
    pageSize: number,
    trackKind: string,
    getTracksInputData: GetTracksByUserIdAndDateInputType,
    loadingGet: boolean,
    currentTrack: Track
}

const initialState: InitialState = {
    tracks: [],
    total: 0,
    pageSize: 10,
    trackKind: "",
    getTracksInputData: {
        UserId: "",
        Date: ""
    },
    loadingGet: false,
    currentTrack: {
        id: "",
        userId: "",
        title: "",
        kind: TrackKind.Working,
        creation: TrackCreation.Manually,
        editedBy: "",
        startTime: "",
        endTime: "",
        createdAt: "",
        updatedAt: ""
    }
}

export const tracksSlice = createSlice({
    name: 'tracks',
    initialState,
    reducers: {
        getAsync: (state, action: PayloadAction<GetTracksInputData>) => state,
        getTracksByUserIdAndDate: (state, action: PayloadAction<GetTracksByUserIdAndDateInputType>) => state,
        getCurrentAsync: (state, action: PayloadAction<void>) => state,
        addTracks: (state, action: PayloadAction<Track[]>) => {
            state.tracks = action.payload
        },
        setLoadingGet: (state, action: PayloadAction<boolean>) => {
            state.loadingGet = action.payload
        },
        setCurrentTrack: (state, action: PayloadAction<Track>) => {
            state.currentTrack = action.payload
        },
        updateTracksMetrics: (state, action: PayloadAction<{ total: number, pageSize: number, trackKind: string }>) => {
            state.total = action.payload.total
            state.pageSize = action.payload.pageSize
        },
        createTrack: (state, action: PayloadAction<CreateTrackInput>) => state,
        updateTrack: (state, action: PayloadAction<UpdateTrackInput>) => state,
        stopTrack: (state, action: PayloadAction<UpdateTrackInput>) => state,
        removeTrack: (state, action: PayloadAction<RemoveTrackInput>) => state,
        setGetTracksInputData: (state, action: PayloadAction<GetTracksByUserIdAndDateInputType>) => {
            state.getTracksInputData = action.payload
        },
        createTrackForOtherUser: (state, action: PayloadAction<CreateTrackForOtherUserInput>) => state,
    }

})

export const tracksAction = tracksSlice.actions
export const tracksReducer = tracksSlice.reducer