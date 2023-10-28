import { combineEpics, Epic, ofType } from "redux-observable";
import { RootState } from "../../../behaviour/store";
import { catchError, endWith, from, map, mergeMap, of, startWith } from "rxjs";
import {
    GET_TRACKS_BY_USER_ID_AND_DATE,
    GetCurrentTrackData, GetTracksByUserIdAndDateInputType, GetTracksByUserIdAndDateResponseType,
    GetTracksData,
    GetTracksInputData,
    TRACKS_GET_CURRENT_QUERY,
    TRACKS_GET_QUERY
} from "../graphQL/tracks.queries";
import {
    CreateTrack,
    CreateTrackInputType,
    RemoveTrack,
    RemoveTrackInputType,
    TRACK_CREATE_MUTATION,
    TRACK_REMOVE_MUTATION, TRACK_STOP_MUTATION,
    TRACK_UPDATE_MUTATION,
    UpdateTrack,
    UpdateTrackInputType
} from "../graphQL/tracks.mutations";
import { tracksAction } from "./tracks.slice";
import { notificationsActions } from "../../notifications/store/notifications.slice";
import { calendarDaysActions } from "../../calendarDays/store/calendarDays.slice";
import { usersActions } from "../../users/store/users.slice";
import { client } from "../../../behaviour/client";

export const getTracksEpic: Epic<ReturnType<typeof tracksAction.getTracksByUserIdAndDate>, any, RootState> = (action$, state$) => {
    return action$.pipe(
        ofType(tracksAction.getAsync.type),
        mergeMap(action =>
            from(client.query<GetTracksByUserIdAndDateResponseType, GetTracksByUserIdAndDateInputType>({
                query: GET_TRACKS_BY_USER_ID_AND_DATE,
                variables: {
                    UserId: action.payload.UserId,
                    Date: action.payload.Date
                }
            })).pipe(
                mergeMap(response => [
                    tracksAction.addTracks(response.data.tracks.getTracksByUserIdAndDate),
                    tracksAction.setGetTracksInputData(action.payload)
                ]),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(tracksAction.setLoadingGet(true)),
                endWith(tracksAction.setLoadingGet(false))
            )
        ),
    )
}

export const createTrackEpic: Epic<ReturnType<typeof tracksAction.createTrack>, any, RootState> = (action$, state$) => {
    return action$.pipe(
        ofType(tracksAction.createTrack.type),
        mergeMap(action =>
            from(client.mutate<CreateTrack, CreateTrackInputType>({
                mutation: TRACK_CREATE_MUTATION,
                variables: {
                    TrackData: action.payload
                }
            })).pipe(
                mergeMap(response => {
                    const tracksInputData = state$.value.tracks.getTracksInputData
                    return [
                        tracksInputData && tracksAction.getTracksByUserIdAndDate(tracksInputData),
                        tracksAction.getCurrentAsync(),
                        notificationsActions.addSuccess("Track created!")
                    ]
                })
            )
        ),
        catchError(error => of(notificationsActions.addError(error.message))),
    )
}

export const removeTrackEpic: Epic<ReturnType<typeof tracksAction.removeTrack>, any, RootState> = (action$, state$) => {
    return action$.pipe(
        ofType(tracksAction.removeTrack.type),
        mergeMap(action =>
            from(client.mutate<RemoveTrack, RemoveTrackInputType>({
                mutation: TRACK_REMOVE_MUTATION,
                variables: {
                    TrackData: action.payload
                }
            })).pipe(
                mergeMap(response => {
                    const tracksInputData = state$.value.tracks.getTracksInputData
                    return [
                        tracksInputData && tracksAction.getTracksByUserIdAndDate(tracksInputData),
                        tracksAction.getCurrentAsync(),
                        notificationsActions.addWarning('Track removed')
                    ]
                })
            )
        ),
        catchError(error => of(notificationsActions.addError(error.message))),
    )
}

export const updateTrackEpic: Epic<ReturnType<typeof tracksAction.updateTrack>, any, RootState> = (action$, state$) => {
    return action$.pipe(
        ofType(tracksAction.updateTrack.type),
        mergeMap(action =>
            from(client.mutate<UpdateTrack, UpdateTrackInputType>({
                mutation: TRACK_UPDATE_MUTATION,
                variables: {
                    TrackData: action.payload
                }
            })).pipe(
                mergeMap(response => {
                    const tracksInputData = state$.value.tracks.getTracksInputData
                    console.log(tracksInputData)
                    return [
                        tracksInputData && tracksAction.getTracksByUserIdAndDate(tracksInputData),
                        tracksAction.getCurrentAsync(),
                        notificationsActions.addInfo("Track update!")
                    ]
                })
            )
        ),
        catchError(error => of(notificationsActions.addError(error.message))),
    )
}

export const getCurrentTrackEpic: Epic<ReturnType<typeof tracksAction.getCurrentAsync>, any, RootState> = (action$, state$) => {
    return action$.pipe(
        ofType(tracksAction.getCurrentAsync.type),
        mergeMap(action =>
            from(client.query<GetCurrentTrackData>({
                query: TRACKS_GET_CURRENT_QUERY
            })).pipe(
                map(response => tracksAction.setCurrentTrack(response.data?.tracks.getCurrentTrack)),
                catchError(error => of(notificationsActions.addError(error.message))),
            )
        ),
    )
}

export const getTracksByUserIdAndDateEpic: Epic<ReturnType<typeof tracksAction.getTracksByUserIdAndDate>,
    any, RootState> = (action$, state$) => {
        return action$.pipe(
            ofType(tracksAction.getTracksByUserIdAndDate.type),
            mergeMap(action =>
                from(client.query<GetTracksByUserIdAndDateResponseType, GetTracksByUserIdAndDateInputType>({
                    query: GET_TRACKS_BY_USER_ID_AND_DATE,
                    variables: {
                        UserId: action.payload.UserId,
                        Date: action.payload.Date
                    }
                })).pipe(
                    mergeMap(response => [
                        tracksAction.addTracks(response.data.tracks.getTracksByUserIdAndDate),

                    ]),
                    catchError(error => of(notificationsActions.addError(error.message))),
                    startWith(tracksAction.setLoadingGet(true)),
                    endWith(tracksAction.setLoadingGet(false)),
                )
            )
        )
    }

export const stopTrackEpic: Epic<ReturnType<typeof tracksAction.stopTrack>, any, RootState> = (action$, state$) => {
    return action$.pipe(
        ofType(tracksAction.stopTrack.type),
        mergeMap(action =>
            from(client.mutate<UpdateTrack, UpdateTrackInputType>({
                mutation: TRACK_STOP_MUTATION,
                variables: {
                    TrackData: action.payload
                }
            })).pipe(
                mergeMap(response => {
                    const tracksInputData = state$.value.tracks.getTracksInputData
                    console.log(tracksInputData)
                    return [
                        tracksInputData && tracksAction.getTracksByUserIdAndDate(tracksInputData),
                        tracksAction.getCurrentAsync(),
                        notificationsActions.addInfo("Track stopped!")
                    ]
                })
            )
        ),
        catchError(error => of(notificationsActions.addError(error.message))),
    )
}

export const tracksPageEpics = combineEpics(
    getTracksEpic,
    // @ts-ignore
    createTrackEpic,
    removeTrackEpic,
    updateTrackEpic,
    getCurrentTrackEpic,
    getTracksByUserIdAndDateEpic,
    stopTrackEpic,
)