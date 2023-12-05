import React, { FC } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import s from '../../pages/TrackerPage/TrackerPage.module.css'
import { useDispatch } from "react-redux";
import { RemoveTrackInput } from "../../../tracks/graphQL/tracks.mutations";
import { tracksAction } from "../../../tracks/store/tracks.slice";
import { Track } from "../../../tracks/graphQL/tracks.types";
import { PayloadAction } from "@reduxjs/toolkit";

type Props = {
    id: string,
    removeCallback: (removeTrackInput: RemoveTrackInput) => PayloadAction<RemoveTrackInput, string>
}

export const TrackTools: FC<Props> = ({ id, removeCallback }) => {
    const dispatch = useDispatch()

    const onRemove = () => {
        let removeTrackObject = {
            id: id
        }
        dispatch(removeCallback(removeTrackObject))
    }
    return (
        <Form onFinish={onRemove}>
            <Button htmlType={'submit'} shape={'round'} icon={<DeleteOutlined />} danger />
        </Form>
    )
}