import React from 'react';
import { TrackKind } from "../../../../behaviour/enums/TrackKind";
import { Track } from "../../../tracks/graphQL/tracks.types";
import { getDifferenceBetweenDatesInTime } from "../../../../utils/dateUtils";
import { ColumnsType } from "antd/es/table";
import { TrackTitleInput } from "../Table/TrackTitleInput";
import { TrackKindInfo } from "../Table/TrackKindInfo";
import { TrackStartTime } from "../Table/TrackStartTime";
import { TrackEndTime } from "../Table/TrackEndTime";
import { TrackTools } from "../Table/TrackTools";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { Table, Typography } from "antd";
import s from "../../pages/TrackerPage/TrackerPage.module.css";
import { useAppSelector } from "../../../../behaviour/store";
import { isAdministratorOrHavePermissions } from "../../../../utils/permissions";
import { Permission } from "../../../../behaviour/enums/Permission";
import { TrackKindEdit } from "../Table/TrackKindEdit";
import { TrackStartTimeEdit } from "../Table/TrackStartTimeEdit";
import { TrackEndTimeEdit } from "../Table/TrackEndTimeEdit";
import {
    CreateTrackForOtherUserInput,
    CreateTrackInput,
    RemoveTrackInput,
    UpdateTrackInput
} from "../../../tracks/graphQL/tracks.mutations";
import { PayloadAction } from "@reduxjs/toolkit";
import { TrackCreation } from "../../../../behaviour/enums/TrackCreation";
import { TrackCreationInfo } from "../Table/TrackCreationInfo";

type DataType = {
    id: string
    userId: string,
    title: string,
    kind: TrackKind,
    creation: TrackCreation,
    editedBy: string,
    startTime: string,
    endTime: string,
    duration: string,
    createdAt: string,
    updatedAt: string,
}

type Props = {
    tracks: Track[],
    date: string,
    loading: boolean,
    canEditDateOrKind: boolean,
    crudCallbacks: {
        create: ((createTrackInput: CreateTrackInput | CreateTrackForOtherUserInput) => PayloadAction<CreateTrackInput | CreateTrackForOtherUserInput, string>),
        update: ((updateTrackInput: UpdateTrackInput) => PayloadAction<UpdateTrackInput, string>),
        remove: ((removeTrackInput: RemoveTrackInput) => PayloadAction<RemoveTrackInput, string>)
    }
}

export const TracksTable: React.FC<Props> = React.memo(({ tracks, date, loading, canEditDateOrKind, crudCallbacks }) => {
    let dateObj = new Date(date)
    const today = new Date()
    const ownerId = (tracks[0]) ? tracks[0].id : ''
    const isMe = useAppSelector(s => s.auth.authedUser?.id) as string == ownerId
    const editable = (dateObj.getMonth() == today.getMonth() && dateObj.getFullYear() == today.getFullYear())
        && (isAdministratorOrHavePermissions([Permission.UpdateOthersTimeTracker]) || isMe)
    console.log(tracks)


    let tableData = tracks.map(track => {
        return {
            ...track,
            duration: getDifferenceBetweenDatesInTime(new Date(track.startTime), new Date(track.endTime))
        } as DataType
    })

    const columns: ColumnsType<DataType> = [
        {
            title: 'Title', dataIndex: 'title', key: 'title',
            render: (value, record, index) => {
                if (editable)
                    return <TrackTitleInput track={record} updateCallback={crudCallbacks.update} />
                return <><EditOutlined className={s.icons} />{' ' + value}</>
            }
        },
        {
            title: 'Kind', dataIndex: 'kind', key: 'kind',
            render: (value, record, index) => {
                if (canEditDateOrKind)
                    return <TrackKindEdit track={record} updateCallback={crudCallbacks.update} />
                return <TrackKindInfo kind={value} />
            }
        },
        {
            title: 'Creation', dataIndex: 'creation', key: 'creation',
            render: (value, record, index) => {
                return (
                    <TrackCreationInfo creation={value} />
                )
            }
        },
        {
            title: 'StartTime', dataIndex: 'startTime', key: 'startTime',
            render: (value, record, index) => {
                if (canEditDateOrKind)
                    return <TrackStartTimeEdit track={record} updateCallback={crudCallbacks.update} />
                return <TrackStartTime startTime={value} />

            }
        },
        {
            title: 'EndTime', dataIndex: 'endTime', key: 'endTime',
            render: (value, record, index) => {
                if (canEditDateOrKind)
                    return <TrackEndTimeEdit track={record} updateCallback={crudCallbacks.update} />
                return <TrackEndTime endTime={value} />

            }
        },
        { title: 'Duration', dataIndex: 'duration', key: 'duration' },
        {
            title: 'Tools', dataIndex: 'operation', key: 'id',
            render: (text, record, index) => {
                if (editable)
                    return <TrackTools id={record.id} removeCallback={crudCallbacks.remove} />
                return <CloseOutlined />
            },
        }
    ];


    return (
        <>
            <Table columns={columns}
                dataSource={tableData}
                rowKey={record => record.id}
                pagination={false}
                loading={loading} />
        </>
    );
})