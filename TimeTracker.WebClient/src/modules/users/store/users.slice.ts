import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User, UserFilter} from "../graphQL/users.types";
import {CreateUserInput, RemoveUserInput, ResetUserPasswordInput, UpdateUserInput} from "../graphQL/users.mutations";
import {Track} from "../../tracks/graphQL/tracks.types";
import {GetTracksByUserIdAndDateInputType} from "../../tracks/graphQL/tracks.queries";
import {RemoveTrackInput, UpdateTrackInput} from "../../tracks/graphQL/tracks.mutations";
import { GetEntitiesResponse } from "../../../behaviour";

type InitialState = {
    users: User[],
    total: number,
    pageSize: number,
    currentPage: number,
    loadingUsers: boolean,
    usersInfinityLoad: GetEntitiesResponse<User> | null,
    filter: UserFilter,
    usersLoading: boolean,
    usersInfinityLoadLoading: boolean,
    crudLoading: boolean,
    userProfile: User | null,
    userTracks: Track[] | null,
    userTracksLoading: boolean,
    trackCreating: boolean,
}

const initialState: InitialState = {
    users: [],
    total: 0,
    pageSize: 10,
    currentPage: 0,
    usersInfinityLoad: null,
    loadingUsers: false,
    filter: {
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        permissions: [],
        roles: [],
        employments: []
    },
    usersLoading: false,
    usersInfinityLoadLoading: false,
    crudLoading: false,
    userProfile: null,
    userTracks: null,
    userTracksLoading: false,
    trackCreating: false,
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        getAsync: (state, action: PayloadAction<{ take: number, skip: number }>) => state,
        addUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
        },
        updateUsersMetrics: (state, action: PayloadAction<{ total: number, pageSize: number }>) => {
            state.total = action.payload.total;
            state.pageSize = action.payload.pageSize;
        },
        fetchUsersInfinityLoad: (state, action: PayloadAction<{ filter: UserFilter, take: number, skip: number }>) => state,
        addUsersInfinityLoad: (state, action: PayloadAction<GetEntitiesResponse<User>>) => {
            if (!state.usersInfinityLoad)
                state.usersInfinityLoad = {entities: [], total: 0, pageSize: 0}
            state.usersInfinityLoad = {
                entities: [...state.usersInfinityLoad.entities, ...action.payload.entities],
                total: action.payload.total,
                pageSize: action.payload.pageSize,
            }
        },
        createUser: (state, action: PayloadAction<CreateUserInput>) => state,
        removeUserAsync: (state, action: PayloadAction<RemoveUserInput>) => state,
        setFilter: (state, action: PayloadAction<UserFilter>) => {
            state.filter = action.payload
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload
        },
        updateUser: (state, action: PayloadAction<UpdateUserInput>) => state,
        resetUserPassword: (state, action: PayloadAction<ResetUserPasswordInput>) => state,
        setUsersForVacationLoading: (state, action: PayloadAction<boolean>) => {
            state.usersInfinityLoadLoading = action.payload
        },
        setLoadingUsers: (state, action: PayloadAction<boolean>) => {
            state.loadingUsers = action.payload
        },
        setCRUDLoading: (state, action: PayloadAction<boolean>) => {
            state.crudLoading = action.payload
        },
        clearUsersForVacationData: (state) => {
            state.usersInfinityLoad = null
        },
        getUserByEmailAsync: (state, action: PayloadAction<string>) => state,
        setUserProfile: (state, action: PayloadAction<User>) => {
            state.userProfile = action.payload
        },
        clearUserProfile: (state) => {
            state.userProfile = null
            state.userTracks = null
        },
        setUserTracks: (state, action: PayloadAction<Track[]>) => {
            state.userTracks = action.payload
        },
        getTracksByUserIdAndDate: (state, action: PayloadAction<GetTracksByUserIdAndDateInputType>) => state,
        setUserTracksLoading: (state, action: PayloadAction<boolean>) => {
            state.userTracksLoading = action.payload
        },
        setUserTracksCreating: (state, action: PayloadAction<boolean>) => {
            state.trackCreating = action.payload
        },
        updateUserTrack: (state, action: PayloadAction<UpdateTrackInput>) => state,
        deleteUserTrack: (state, action: PayloadAction<RemoveTrackInput>) => state,
        clearUsersPage: (state) => {
            state.users = []
            state.usersInfinityLoad = null
        },
    }
})

export const usersActions = usersSlice.actions
export const usersReducer = usersSlice.reducer
