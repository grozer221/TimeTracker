import { gql } from '@apollo/client';
import { VacationRequest } from "../../vacationRequests/graphQL/vacationRequests.types";
import { SickLeaveFilter, SickLeaveType } from "../sickLeaveType";
import { SICK_LEAVE_FRAGMENT } from "./sickLeave.fragments";
import { GetEntitiesResponse } from '../../../behaviour';

export type SickLeaveGetByIdData = { sickLeave: { getById: SickLeaveType } }
export type SickLeaveGetByIdVars = { id: string }
export const SICK_LEAVE_GET_BY_ID_QUERY = gql`
    ${SICK_LEAVE_FRAGMENT}
    query SickLeaveGetById($id: Guid!){
        sickLeave {
            getById(id: $id) {
                ...SickLeaveFragment
            }
        }
    }
`;

export type SickLeaveGetData = { sickLeave: { get: GetEntitiesResponse<SickLeaveType> } }
export type SickLeaveGetVars = { sickLeaveGetInputType: SickLeaveGetInputType }
export type SickLeaveGetInputType = {
    pageNumber: number,
    pageSize: number,
    filter: SickLeaveFilter
}
export const SICK_LEAVE_GET_QUERY = gql`
    ${SICK_LEAVE_FRAGMENT}
    query SickLeaveGet($sickLeaveGetInputType: SickLeaveGetInputType!){
       sickLeave{
           get(sickLeaveGetInputType: $sickLeaveGetInputType) {
               entities {
                   ...SickLeaveFragment
               }
               total
               pageSize
           }
       }
    }
`;