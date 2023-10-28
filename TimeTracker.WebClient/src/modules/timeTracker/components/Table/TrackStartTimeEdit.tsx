import React, { FC, useState } from 'react';
import { DatePicker, DatePickerProps } from 'antd';
import { tracksAction } from "../../../tracks/store/tracks.slice";
import { useDispatch } from "react-redux";
import { Track } from "../../../tracks/graphQL/tracks.types";
import moment from "moment";
import { UpdateTrackInput } from "../../../tracks/graphQL/tracks.mutations";
import { PayloadAction } from "@reduxjs/toolkit";
import { notificationsActions } from "../../../notifications/store/notifications.slice";
import { useAppSelector } from "../../../../behaviour/store";

type Props = {
    track: Track,
    updateCallback: (updateTrackInput: UpdateTrackInput) => PayloadAction<UpdateTrackInput, string>
}

export const TrackStartTimeEdit: FC<Props> = ({ track, updateCallback }) => {
    let startTime = track.startTime
    const startTimeMoment = moment(new Date(startTime))
    const userEmail = useAppSelector(s => s.auth.authedUser?.email) as string
    const today = new Date()
    const dispatch = useDispatch()
    const [pickerValue, setPickerValue] = useState(startTimeMoment)

    const onChange = (value: DatePickerProps['value']) => {
        const newTrack = {
            id: track.id,
            title: track.title,
            kind: track.kind,
            creation: track.creation,
            editedBy: userEmail,
            startTime: value!.utc().format('YYYY-MM-DDTHH:mm:ss'),
            endTime: track.endTime
        }
        const startTime = value!.toDate()
        const endTime = new Date(track.endTime)
        if (startTime > endTime) {
            dispatch(notificationsActions.addError("Start time can't be upper than end time!"))
            setPickerValue(startTimeMoment)
            return
        }
        setPickerValue(value!)
        dispatch(updateCallback(newTrack))
    }


    return (
        <>
            <DatePicker
                allowClear={false}
                showTime={{ format: 'HH:mm:ss' }}
                format={"YYYY/MM/DD HH:mm:ss"}
                onChange={onChange}
                value={pickerValue}
                disabledDate={(currentDate) =>
                    today.getMonth() !== +currentDate.month() || today.getFullYear() !== +currentDate.year()
                }
            />
        </>
    )
}