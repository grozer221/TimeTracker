import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Col, DatePicker, Row } from 'antd';
import { useDispatch } from "react-redux";
import { tracksAction } from "../../../tracks/store/tracks.slice";
import { useAppSelector } from "../../../../behaviour/store";
import { isAuthenticated } from "../../../../utils/permissions";
import { TrackKind } from "../../../../behaviour/enums/TrackKind";
import { Stopwatch } from "../../components/Stopwatch/TrackerStopwatch";
import moment, { now } from "moment";
import { TracksTable } from "../../components/TracksTable/TracksTable";
import s from "./TrackerPage.module.css"
import {
    CreateTrackForOtherUserInput,
    CreateTrackInput,
    RemoveTrackInput,
    UpdateTrackInput
} from "../../../tracks/graphQL/tracks.mutations";
import { Employment } from "../../../../behaviour/enums/Employment";
import { TracksStatistic } from "../../components/Statistic/TracksStatistic";
import { statisticAction } from "../../userStatistic/store/statistic.slice";

type DataType = {
    id: string
    userId: string,
    title: string,
    kind: TrackKind,
    startTime: string,
    endTime: string,
    duration: string,
    createdAt: string,
    updatedAt: string,
}

export const TrackerPage: React.FC = () => {
    const isAuth = useAppSelector(s => s.auth.isAuth)
    const loadingGet = useAppSelector(s => s.tracks.loadingGet)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userId = useAppSelector(s => s.auth.authedUser?.id) as string
    const canEditDateOrKind = false


    const tracks = useAppSelector(s => s.tracks.tracks)
    const currentTrack = useAppSelector(s => s.tracks.currentTrack)

    const [searchParams, setSearchParams] = useSearchParams({});
    const trackKind = searchParams.get('kind') || ''
    const employment = useAppSelector(s => s.auth.authedUser?.employment)
    const indexOfS = Object.values(TrackKind).indexOf(trackKind as unknown as TrackKind)

    let [date, setDate] = useState(moment(now()).toISOString())

    const update = (updateTrackInput: UpdateTrackInput) => {
        return tracksAction.updateTrack(updateTrackInput)
    }

    const create = (createTrackInput: CreateTrackInput | CreateTrackForOtherUserInput) => {
        return tracksAction.createTrack(createTrackInput as CreateTrackInput)
    }

    const remove = (removeTrackInput: RemoveTrackInput) => {
        return tracksAction.removeTrack(removeTrackInput)
    }

    useEffect(() => {
        if (!isAuthenticated())
            navigate('/auth/login');
    }, [isAuth])

    useEffect(() => {
        dispatch(statisticAction.setGetStatisticInputData({ UserId: userId, Date: date }))
        dispatch(statisticAction.getAsync({ UserId: userId, Date: date }))
    }, [tracks])

    useEffect(() => {
        dispatch(tracksAction.getCurrentAsync())
        dispatch(tracksAction.setGetTracksInputData({ UserId: userId, Date: date }))
        dispatch(tracksAction.getTracksByUserIdAndDate({ UserId: userId, Date: date }))
    }, [setSearchParams])

    useEffect(() => {
        dispatch(tracksAction.getCurrentAsync())
        dispatch(tracksAction.setGetTracksInputData({ UserId: userId, Date: date }))
        dispatch(tracksAction.getTracksByUserIdAndDate({ UserId: userId, Date: date }))
    }, [date])


    return (
        <>
            {employment === Employment.PartTime ?
                <Stopwatch track={currentTrack} crudCallbacks={{ create, update, remove }} /> :
                <></>}
            <Row style={{ marginTop: 10, marginBottom: 10 }}>
                <Col span={20}><b><TracksStatistic /></b></Col>
                <Col span={4}>
                    <DatePicker className={s.date_picker} picker={"month"} defaultValue={moment(now())} onChange={e => {
                        if (e != null)
                            setDate(e.toISOString())
                    }} />

                </Col>
            </Row>
            <TracksTable tracks={tracks} date={date} loading={loadingGet} canEditDateOrKind={canEditDateOrKind}
                crudCallbacks={{ create, update, remove }} />
        </>
    );
};

