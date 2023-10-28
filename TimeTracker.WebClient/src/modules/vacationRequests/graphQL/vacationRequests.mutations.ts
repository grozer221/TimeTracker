import { gql } from '@apollo/client';
import { VACATION_REQUEST_FRAGMENT } from "./vacationRequests.fragments";
import { VacationRequest } from "./vacationRequests.types";
import { VacationRequestStatus } from "../../../behaviour/enums/VacationRequestStatus";

export type VacationRequestsCreateData = { vacationRequests: { create: VacationRequest } }
export type VacationRequestsCreateVars = { vacationRequestsCreateInputType: VacationRequestsCreateInputType }
export type VacationRequestsCreateInputType = {
    dateStart: string,
    dateEnd: string,
    comment?: string
}
export const VACATION_REQUESTS_CREATE_MUTATION = gql`
    ${VACATION_REQUEST_FRAGMENT}
    mutation VacationRequestsCreate($vacationRequestsCreateInputType: VacationRequestsCreateInputType!) {
        vacationRequests {
            create(vacationRequestsCreateInputType: $vacationRequestsCreateInputType) {
                ...VacationRequestFragment
            }
        }
    }
`;

export type VacationRequestsUpdateData = { vacationRequests: { update: VacationRequest } }
export type VacationRequestsUpdateVars = { vacationRequestsUpdateInputType: VacationRequestsUpdateInputType }
export type VacationRequestsUpdateInputType = {
    id: string,
    dateStart: string,
    dateEnd: string,
    comment?: string
}
export const VACATION_REQUESTS_UPDATE_MUTATION = gql`
    ${VACATION_REQUEST_FRAGMENT}
    mutation VacationRequestsUpdate($vacationRequestsUpdateInputType: VacationRequestsUpdateInputType!) {
        vacationRequests {
            update(vacationRequestsUpdateInputType: $vacationRequestsUpdateInputType) {
                ...VacationRequestFragment
            }
        }
    }
`;

export type VacationRequestsUpdateStatusData = { vacationRequests: { updateStatus: VacationRequest } }
export type VacationRequestsUpdateStatusVars = { vacationRequestsUpdateStatusInputType: VacationRequestsUpdateStatusInputType }
export type VacationRequestsUpdateStatusInputType = {
    id: string,
    status: VacationRequestStatus,
}
export const VACATION_REQUESTS_UPDATE_STATUS_MUTATION = gql`
    ${VACATION_REQUEST_FRAGMENT}
    mutation VacationRequestsUpdate($vacationRequestsUpdateStatusInputType: VacationRequestsUpdateStatusInputType!) {
        vacationRequests {
            updateStatus(vacationRequestsUpdateStatusInputType: $vacationRequestsUpdateStatusInputType) {
                ...VacationRequestFragment
            }
        }
    }
`;


export type VacationRequestsRemoveData = { vacationRequests: { remove: boolean } }
export type VacationRequestsRemoveVars = { id: string }
export const VACATION_REQUESTS_REMOVE_MUTATION = gql`
    mutation VacationRequestsRemove($id: Guid!) {
        vacationRequests {
            remove(id: $id)
        }
    }
`;
