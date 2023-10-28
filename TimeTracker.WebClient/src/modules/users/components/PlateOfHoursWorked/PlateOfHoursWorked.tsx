import * as React from 'react';
import moment, { Moment, now } from "moment";
import { Calendar, Typography } from "antd";
import { FC, memo } from "react";
import { TrackKind } from "../../../../behaviour/enums/TrackKind";
import { Track } from "../../../tracks/graphQL/tracks.types";
import s from './PlateOfHoursWorked.module.css';
import { uppercaseToWords } from "../../../../utils/stringUtils";

type Props = {
    tracks: Track[],
    date: string,
}

type SelectedFromTrackData = {
    id: string,
    kind: TrackKind,
    startTime: moment.Moment,
    endTime: moment.Moment,
}

const { Text } = Typography;

export const PlateOfHoursWorked: FC<Props> = memo(({ tracks, date }) => {
    let dateObj = moment(date)
    let today = moment(now())
    if (today.month() !== dateObj.month())
        dateObj.set('date', 1)

    let mappedTracks = tracks.map(t => ({
        id: t.id,
        endTime: moment(t.endTime),
        startTime: moment(t.startTime),
        kind: t.kind
    } as SelectedFromTrackData))

    return <Calendar
        disabledDate={(currentDate: Moment) => (currentDate.month() !== dateObj.month() || currentDate.year() !== dateObj.year())}
        headerRender={() => <></>}
        value={dateObj}
        dateCellRender={(date: Moment) => {
            let dayKindClass;
            let thisDayTracks = mappedTracks.filter((t) => date.format('YYYY/MM/DD') === t.startTime.format('YYYY/MM/DD'))
            if (thisDayTracks.length === 0) return <div className={[s.day, dayKindClass].join(' ')}></div>

            let duration = moment.duration(0, 'ms');

            thisDayTracks.forEach(t => {
                duration.add(moment.duration(t.endTime.diff(t.startTime)))
            })

            switch (thisDayTracks[0].kind) {
                case TrackKind.Sick:
                    dayKindClass = s.sick;
                    break;
                case TrackKind.Vacation:
                    dayKindClass = s.vacation;
                    break;
            }

            return <div className={[s.day, dayKindClass].join(' ')}>
                <div className={s.titleAndKind}>
                    <Text style={{ textAlign: 'center' }}>
                        {`${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`}
                    </Text>
                    <Text style={{ fontSize: '12px' }}
                        type="secondary">{uppercaseToWords(thisDayTracks[0].kind)}</Text>
                </div>
            </div>
        }}
    />
})