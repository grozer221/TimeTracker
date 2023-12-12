import { Paging } from "../../../behaviour";

export type Company = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}


export type CreateCompanyInput = {
    name: string;
    email: string;
}

export type UpdateCompanyInput = CreateCompanyInput & {
    id: string;
}

export type GetCompaniesInput = { paging: Paging }