import { combineEpics, Epic, ofType } from "redux-observable";
import { tracksAction } from "../../../tracks/store/tracks.slice";
import { RootState } from "../../../../behaviour/store";
import { catchError, endWith, from, mergeMap, of, startWith } from "rxjs";
import {
    GET_TRACKS_BY_USER_ID_AND_DATE,
    GetTracksByUserIdAndDateInputType,
    GetTracksByUserIdAndDateResponseType
} from "../../../tracks/graphQL/tracks.queries";
import { notificationsActions } from "../../../notifications/store/notifications.slice";
import { statisticAction } from "./statistic.slice";
import { GET_USER_STATISTIC, GetStatisticData, GetStatisticInputType } from "../graphQL/statistic.queries";
import {
    createTrackEpic,
    getCurrentTrackEpic, getTracksByUserIdAndDateEpic,
    getTracksEpic,
    removeTrackEpic, stopTrackEpic,
    updateTrackEpic
} from "../../../tracks/store/tracksPage.epics";
import { client } from "../../../../behaviour/client";

export const getUserStatistic: Epic<ReturnType<typeof statisticAction.getAsync>,
    any, RootState> = (action$, state$) => {
        return action$.pipe(
            ofType(statisticAction.getAsync.type),
            mergeMap(action =>
                from(client.query<GetStatisticData, GetStatisticInputType>({
                    query: GET_USER_STATISTIC,
                    variables: {
                        UserId: action.payload.UserId,
                        Date: action.payload.Date
                    }
                })).pipe(
                    mergeMap(response => [
                        statisticAction.addStatistic(response.data.statistic.getUserStatistic),

                    ]),
                    catchError(error => of(notificationsActions.addError(error.message))),
                    startWith(tracksAction.setLoadingGet(true)),
                    endWith(tracksAction.setLoadingGet(false)),
                )
            )
        )
    }

export const statisticEpics = combineEpics(
    getUserStatistic
)