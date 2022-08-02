import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User, UserFilter} from "../graphQL/users.types";
import {CreateUserInput, RemoveUserInput, UpdateUserInput} from "../graphQL/users.mutations";

type InitialState = {
    users: User[],
    total: number,
    pageSize: number,
    currentPage: number,
    usersForVacation: User[],
    filter: UserFilter
}

const initialState: InitialState = {
    users: [],
    total: 0,
    pageSize: 10,
    currentPage: 0,
    usersForVacation: [],
    filter: {
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        permissions: [],
        roles: [],
        employments: []
    }
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
        fetchUsersForVacationsSelect: (state, action: PayloadAction<{ filter: UserFilter, take: number, skip: number }>) => state,
        addUsersForVacationsSelect: (state, action: PayloadAction<User[]>) => {
            state.usersForVacation = action.payload;
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
    }
})

export const usersActions = usersSlice.actions
export const usersReducer = usersSlice.reducer
