import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Company, CreateCompanyInput, GetCompaniesInput, UpdateCompanyInput } from "./types";
import { GetEntitiesResponse, Paging } from "../../../behaviour";

type InitialState = {
    companies: GetEntitiesResponse<Company>;
    company: Company | null;
    getCompaniesInput: GetCompaniesInput
};

const initialState: InitialState = {
    companies: { entities: [], total: 0, pageSize: 10 },
    company: null,
    getCompaniesInput: { paging: { pageNumber: 1, pageSize: 10 } }
}

export const slice = createSlice({
    name: 'companies',
    initialState,
    reducers: {
        getCompanyAsync: (state, action: PayloadAction<{ id: string }>) => state,
        setCompany: (state, action: PayloadAction<Company>) => {
            state.company = action.payload
        },
        getCompaniesAsync: (state, action: PayloadAction<GetCompaniesInput>) => state,
        setCompanies: (state, action: PayloadAction<GetEntitiesResponse<Company>>) => {
            state.companies = action.payload
        },
        setGetCompaniesInput: (state, action: PayloadAction<GetCompaniesInput>) => {
            state.getCompaniesInput = action.payload
        },
        createAsync: (state, action: PayloadAction<{ input: CreateCompanyInput }>) => state,
        updateAsync: (state, action: PayloadAction<{ input: UpdateCompanyInput }>) => state,
        removeAsync: (state, action: PayloadAction<{ id: string }>) => state,
    },
})

export const companiesActions = slice.actions
export const companiesReducer = slice.reducer