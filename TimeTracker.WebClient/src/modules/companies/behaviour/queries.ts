import { gql } from '@apollo/client';

export const companyFragment = gql`
    fragment CompanyFragment on CompanyType {
        id
        name
        email
        createdAt
        updatedAt
    }
`

export const getCompanyQuery = gql`
    query ($id: Guid!){
        companies {
            getById(id: $id) {
                ...CompanyFragment
            }
        }
    }
    ${companyFragment}
`;

export const getCompaniesQuery = gql`
    query ($paging: PagingType!){
       companies {
           get(paging: $paging) {
               entities {
                   ...CompanyFragment
               }
               total
               pageSize
           }
       }
    }
    ${companyFragment}
`;

export const createCompanyMutation = gql`
    mutation ($input: CreateCompanyInputType!) {
        companies {
            create(input: $input) {
                ...CompanyFragment
            }
        }
    }
    ${companyFragment}
`;

export const updateCompanyMutation = gql`
    mutation ($input: UpdateCompanyInputType!) {
        companies {
            update(input: $input) {
                ...CompanyFragment
            }
        }
    }
    ${companyFragment}
`;

export const removeCompanyMutation = gql`
    mutation ($id: Guid!) {
        companies {
            remove(id: $id)
        }
    }
`;