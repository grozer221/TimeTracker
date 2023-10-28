import { gql } from "@apollo/client";
import { TRACK_FRAGMENT } from "./tracks.fragments";
import { Track } from "./tracks.types";
import { TrackKind } from "../../../behaviour/enums/TrackKind";
import { TrackCreation } from "../../../behaviour/enums/TrackCreation";

export type CreateTrack = { tracks: { create: Track } }
export type CreateTrackInput = {
    title: string,
    kind: TrackKind
}
export type CreateTrackInputType = { TrackData: CreateTrackInput }

export const TRACK_CREATE_MUTATION = gql`
    ${TRACK_FRAGMENT}
    mutation CreateTrack ( $TrackData: TrackInputType!)  {
        tracks{
            create(trackInput: $TrackData) {
                ...TrackFragment    
            }
        }
    }    
`

export type RemoveTrack = { tracks: { remove: string } }
export type RemoveTrackInput = {
    id: string
}
export type RemoveTrackInputType = { TrackData: RemoveTrackInput }

export const TRACK_REMOVE_MUTATION = gql`
    mutation RemoveTask($TrackData: TrackRemoveInputType!){
      tracks{
        remove(trackInput: $TrackData)
      }
    }
`

export type UpdateTrack = { tracks: { update: Track } }
export type UpdateTrackInput = {
    id: string,
    title: string,
    kind: TrackKind,
    creation: TrackCreation,
    editedBy: string,
    startTime: string,
    endTime: string
}
export type UpdateTrackInputType = { TrackData: UpdateTrackInput }

export const TRACK_UPDATE_MUTATION = gql`
    ${TRACK_FRAGMENT}
    mutation UpdateTrack($TrackData: TrackUpdateInputType!){
        tracks{
            update(trackInput: $TrackData){
                ...TrackFragment
            }
        }
    }
`
export type CreateTrackForOtherUserResponseType = { tracks: { createOther: Track } }
export type CreateTrackForOtherUserInput = {
    userId: string,
    title: String,
    kind: TrackKind,
    creation: TrackCreation,
    startTime: string,
    endTime: string,
}
export type CreateTrackForOtherUserInputType = { TrackData: CreateTrackForOtherUserInput }

export const TRACK_CREATE_FOR_OTHER_USER_MUTATION = gql`
    ${TRACK_FRAGMENT}
    mutation CreateTrackForOtherUser($TrackData: TrackOtherInputType!){
        tracks{
            createOther(trackInput: $TrackData){
                ...TrackFragment
            }
        }
    }
`
export const TRACK_STOP_MUTATION = gql`
    ${TRACK_FRAGMENT}
    mutation StopTrack($TrackData: TrackUpdateInputType!){
        tracks{
            stop(trackInput: $TrackData){
                ...TrackFragment
            }
        }
    }
`
