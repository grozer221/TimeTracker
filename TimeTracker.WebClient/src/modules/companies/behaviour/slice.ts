import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Company, CompanyInput } from "./types";
import { GetEntitiesResponse, Paging } from "../../../behaviour";

type InitialState = {
    companies: GetEntitiesResponse<Company>;
    company: Company | null;
};

const initialState: InitialState = {
    companies: { entities: [], total: 0, pageSize: 10 },
    company: null,
}

export const slice = createSlice({
    name: 'companies',
    initialState,
    reducers: {
        getCompanyAsync: (state, action: PayloadAction<{ id: string }>) => state,
        setCompany: (state, action: PayloadAction<Company>) => {
            state.company = action.payload
        },
        getCompaniesAsync: (state, action: PayloadAction<{ paging: Paging }>) => state,
        setCompanies: (state, action: PayloadAction<GetEntitiesResponse<Company>>) => {
            state.companies = action.payload
        },
        createAsync: (state, action: PayloadAction<{ input: CompanyInput }>) => state,
        updateAsync: (state, action: PayloadAction<{ id: string; input: CompanyInput }>) => state,
        removeAsync: (state, action: PayloadAction<{ id: string }>) => state,
    },
})

export const companiesActions = slice.actions
export const companiesReducer = slice.reducer