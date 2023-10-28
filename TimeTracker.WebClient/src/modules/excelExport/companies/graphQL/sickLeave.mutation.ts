import {gql} from '@apollo/client';
import {SickLeaveType} from "../sickLeaveType";
import {SICK_LEAVE_FRAGMENT} from "./sickLeave.fragments";

export type SickLeaveCreateData = { sickLeave: { create: SickLeaveType } }
export type SickLeaveCreateVars = { sickLeaveCreateInputType: SickLeaveCreateInputType }
export type SickLeaveCreateInputType = {
    startDate: string,
    endDate: string,
    comment?: string,
    userId: string
}
export const SICK_LEAVE_CREATE_MUTATION = gql`
    ${SICK_LEAVE_FRAGMENT}
    mutation SickLeaveCreate($sickLeaveCreateInputType: SickLeaveCreateInputType!) {
        sickLeave {
            create(sickLeaveCreateInputType: $sickLeaveCreateInputType) {
                ...SickLeaveFragment
            }
        }
    }
`;

export type SickLeaveUpdateData = { sickLeave: { update: SickLeaveType } }
export type SickLeaveUpdateVars = { sickLeaveUpdateInputType: SickLeaveUpdateInputType }
export type SickLeaveUpdateInputType = {
    id: string,
    startDate?: string,
    endDate?: string,
    comment?: string
}
export const SICK_LEAVE_UPDATE_MUTATION = gql`
    ${SICK_LEAVE_FRAGMENT}
    mutation SickLeaveUpdate($sickLeaveUpdateInputType: SickLeaveUpdateInputType!) {
        sickLeave {
            update(sickLeaveUpdateInputType: $sickLeaveUpdateInputType) {
                ...SickLeaveFragment
            }
        }
    }
`;

export type SickLeaveUploadFilesData = { sickLeave: { uploadFiles: SickLeaveType } }
export type SickLeaveUploadFilesVars = { sickLeaveUploadFilesInputType: SickLeaveUploadFilesInputType }
export type SickLeaveUploadFilesInputType = {
    id: string,
    uploadedFiles: string[]
    uploadFiles: File[]
}
export const SICK_LEAVE_UPLOAD_FILES_MUTATION = gql`
    ${SICK_LEAVE_FRAGMENT}
    mutation SickLeaveUploadFiles($sickLeaveUploadFilesInputType: SickLeaveUploadFilesInputType!){
        sickLeave {
            uploadFiles(sickLeaveUploadFilesInputType: $sickLeaveUploadFilesInputType) {
                ...SickLeaveFragment
            }
        }
    }
`;

export type SickLeaveRemoveData = { sickLeave: { remove: boolean } }
export type SickLeaveRemoveVars = { id: string }
export const SICK_LEAVE_REMOVE_MUTATION = gql`
    mutation SickLeaveRemove($id: Guid!) {
        sickLeave {
            remove(id: $id)
        }
    }
`;