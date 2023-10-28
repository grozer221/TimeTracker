import { gql } from '@apollo/client';
import { User, UserFilter } from "./users.types";
import { USER_WITH_USERS_WHICH_CAN_APPROVE_VACATION_REQUESTS_FRAGMENT } from "./users.fragments";
import { Permission } from "../../../behaviour/enums/Permission";
import { Employment } from "../../../behaviour/enums/Employment";

// Create user types and mutation
export type CreateUserData = { users: { create: User } }
export type CreateUserInput = {
    firstName: string,
    lastName: string,
    middleName: string,
    email: string,
    permissions: Permission[],
    password: string,
    usersWhichCanApproveVacationRequestIds: [string],
    employment: Employment,
}
export type CreateUserInputType = { UserData: CreateUserInput }

export const USERS_CREATE_MUTATION = gql`
    ${USER_WITH_USERS_WHICH_CAN_APPROVE_VACATION_REQUESTS_FRAGMENT}
    mutation UsersCreate($UserData: UsersCreateInputType!){
        users {
            create (usersCreateInputType: $UserData){
                ...UserWithUsersWhichCanApproveVacationRequestsFragment
            }
        }
    }
`;

// Update user types and mutation
export type UpdateUserInput = {
    id: string,
    firstName: string,
    lastName: string,
    middleName: string,
    email: string,
    permissions: Permission[],
    employment: Employment[],
    usersWhichCanApproveVacationRequestIds: [string]
}
export type UpdateUserInputType = { UpdateData: UpdateUserInput }
export type UpdatedUserDataResponse = { users: { update: User } }

export const USERS_UPDATE_MUTATION = gql`
    ${USER_WITH_USERS_WHICH_CAN_APPROVE_VACATION_REQUESTS_FRAGMENT}
    mutation UpdateUser($UpdateData: UsersUpdateInputType!){
        users{
            update(usersUpdateInputType: $UpdateData){
                ...UserWithUsersWhichCanApproveVacationRequestsFragment
            }
        }
    }
`

//Remove user types and mutation
export type RemoveUserInput = { email: string }
export type RemoveUserInputType = { RemoveData: RemoveUserInput }
export type RemoveUserDataResponse = { users: { remove: User } }

export const USERS_REMOVE_MUTATION = gql`
    ${USER_WITH_USERS_WHICH_CAN_APPROVE_VACATION_REQUESTS_FRAGMENT}
    mutation RemoveUser($RemoveData: UsersRemoveInputType!){
        users{
            remove(usersRemoveInputType: $RemoveData){
                ...UserWithUsersWhichCanApproveVacationRequestsFragment
            }
        }
    }
`

//Reset user password types and mutation
export type ResetUserPasswordInput = { id: string, password: string, confirmPassword: string }
export type ResetUserPasswordInputType = { ResetRequestData: ResetUserPasswordInput }
export type ResetUserPasswordDataResponse = { users: { updatePassword: User } }

export const USERS_RESET_PASSWORD_MUTATION = gql`
    ${USER_WITH_USERS_WHICH_CAN_APPROVE_VACATION_REQUESTS_FRAGMENT}
    mutation ResetUserPassword($ResetRequestData: UsersUpdatePasswordInputType!){
        users{
            updatePassword(usersUpdatePasswordInputType: $ResetRequestData){
                ...UserWithUsersWhichCanApproveVacationRequestsFragment
            }
        }
    }
`
