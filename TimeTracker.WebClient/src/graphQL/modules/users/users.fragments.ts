import {gql} from "@apollo/client";

export const USER_FRAGMENT = gql`
    fragment UserFragment on UserType {
        id
        email
        firstName
        lastName
        middleName
        role
        createdAt
        updatedAt
    }
`