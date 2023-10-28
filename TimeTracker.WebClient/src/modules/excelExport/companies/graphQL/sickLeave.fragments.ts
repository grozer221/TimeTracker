import {gql} from "@apollo/client";
import { USER_FRAGMENT } from "../../../users/graphQL/users.fragments";

export const SICK_LEAVE_FRAGMENT = gql`
    ${USER_FRAGMENT}
    fragment SickLeaveFragment on SickLeaveType {
        id
        createdAt
        updatedAt
        startDate
        endDate
        comment
        userId
        user{
            ...UserFragment
        }
        files
    }
`