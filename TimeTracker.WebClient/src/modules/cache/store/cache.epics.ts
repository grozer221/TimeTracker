import { combineEpics, Epic, ofType } from "redux-observable";
import { RootState } from "../../../behaviour/store";
import { catchError, endWith, from, map, mergeMap, of, startWith } from "rxjs";
import { cacheActions, cacheSlice } from "./cache.slice";
import { CACHE_REFRESH_APP_MUTATION, CacheRefreshAppData, CacheRefreshAppVars } from "../graphQL/cache.mutations";
import { notificationsActions } from "../../notifications/store/notifications.slice";
import { client } from "../../../behaviour/client";

export const cacheClearAppEpic: Epic<ReturnType<typeof cacheActions.refreshAppAsync>, any, RootState> = (action$, state$) =>
    action$.pipe(
        ofType(cacheActions.refreshAppAsync.type),
        mergeMap(action =>
            from(client.mutate<CacheRefreshAppData, CacheRefreshAppVars>({
                mutation: CACHE_REFRESH_APP_MUTATION,
            })).pipe(
                map(response => notificationsActions.addSuccess('Cache app successfully cleared')),
                catchError(error => of(notificationsActions.addError(error.message))),
                startWith(cacheActions.setLoadingClearApp(true)),
                endWith(cacheActions.setLoadingClearApp(false)),
            )
        )
    );

export const cacheEpics = combineEpics(
    cacheClearAppEpic,
)