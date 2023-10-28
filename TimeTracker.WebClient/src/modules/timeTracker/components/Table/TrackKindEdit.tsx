import React, { FC, useEffect } from 'react';
import { AlertOutlined, CarOutlined, CodeSandboxOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, MenuProps, Select, Space, Tag } from 'antd';
import s from '../../pages/TrackerPage/TrackerPage.module.css'
import { TrackKind } from "../../../../behaviour/enums/TrackKind";
import { tracksAction } from "../../../tracks/store/tracks.slice";
import { useDispatch } from "react-redux";
import { Track } from "../../../tracks/graphQL/tracks.types";
import { DayKind } from "../../../../behaviour/enums/DayKind";
import { uppercaseToWords } from "../../../../utils/stringUtils";
import { UpdateTrackInput } from "../../../tracks/graphQL/tracks.mutations";
import { PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "../../../../behaviour/store";

type Props = {
    track: Track,
    updateCallback: (updateTrackInput: UpdateTrackInput) => PayloadAction<UpdateTrackInput, string>
}

export const TrackKindEdit: FC<Props> = ({ track, updateCallback }) => {
    let kind = track.kind
    const userEmail = useAppSelector(s => s.auth.authedUser?.email) as string
    const dispatch = useDispatch()

    const onSelect = (value: TrackKind) => {
        kind = value
        console.log(userEmail)
        const updateTrackInput = {
            id: track.id,
            title: track.title,
            kind: value,
            creation: track.creation,
            editedBy: userEmail,
            startTime: track.startTime,
            endTime: track.endTime
        }
        dispatch(updateCallback(updateTrackInput))
    }


    let trackKindIcon: { [id: string]: JSX.Element; } = {
        "WORKING": <CodeSandboxOutlined className={s.icons} />,
        "VACATION": <CarOutlined className={s.icons} />,
        "SICK": <AlertOutlined className={s.icons} />
    }


    return (
        <>
            <Select className={'w-100'} defaultValue={track.kind} onChange={onSelect}>
                {(Object.values(TrackKind) as Array<TrackKind>).map((value) => (
                    <Select.Option key={value} value={value}>
                        {trackKindIcon[value]}{uppercaseToWords(value)}
                    </Select.Option>
                ))}
            </Select>
        </>
    )
}