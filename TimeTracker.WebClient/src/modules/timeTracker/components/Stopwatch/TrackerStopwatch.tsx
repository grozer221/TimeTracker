import React, {FC, useEffect, useState} from "react";
import {Button, ButtonProps, Col, Divider, Form, Input, Row} from "antd";
import {Track} from "../../../tracks/graphQL/tracks.types";
import {useDispatch} from "react-redux";
import {tracksAction} from "../../../tracks/store/tracks.slice";
import moment from "moment";
import {toUTCDateTime} from "../../../../convertors/toUTCDateTime";
import {nameof} from "../../../../utils/stringUtils";
import {MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {TrackKind} from "../../../../graphQL/enums/TrackKind";
import {useForm} from "antd/es/form/Form";
import {
    CreateTrackForOtherUserInput,
    CreateTrackInput, RemoveTrackInput,
    UpdateTrackInput
} from "../../../tracks/graphQL/tracks.mutations";
import {TrackerPanel} from "./TrackerPanel";
import s from './TrackerStopwatch.module.css'
import {PayloadAction} from "@reduxjs/toolkit";

type FormValues = {
    title: string,
    kind: TrackKind
}

type stopwatchProps = {
    track: Track,
    crudCallbacks: {
        create: ((createTrackInput: CreateTrackInput | CreateTrackForOtherUserInput) => PayloadAction<CreateTrackInput, string>),
        update: ((updateTrackInput: UpdateTrackInput) => PayloadAction<UpdateTrackInput, string>),
        remove: ((removeTrackInput: RemoveTrackInput) => PayloadAction<RemoveTrackInput, string>)
    }
}




export const Stopwatch: FC<stopwatchProps> = ({track, crudCallbacks}) => {
    const dispatch = useDispatch()
    const [button, setButton] = useState<ButtonProps>()
    const [buttonText, setButtonText] = useState('')
    const [form] = useForm()

    const StartButton = {
        htmlType: 'submit',
        icon: <PlusCircleOutlined/>
    } as ButtonProps

    const OnEndTrack = () => {
        localStorage.removeItem('currentTrackStartTime')
        const endTime = new Date()
        const endTimeUTC = toUTCDateTime(endTime)
        const newTrack = {
            id: track.id,
            title: track.title,
            kind: track.kind,
            startTime: track.startTime,
            endTime: moment(endTimeUTC).format('YYYY-MM-DDTHH:mm:ss')
        }
        dispatch(crudCallbacks.update(newTrack))
    }

    const StopButton = {
        danger: true,
        icon: <MinusCircleOutlined/>,
        onClick: OnEndTrack
    } as ButtonProps

    useEffect(()=>{
        console.log('aaaa')
        if(track.startTime)
            localStorage.setItem('currentTrackStartTime', track.startTime)
        track ? setButton(StopButton) : setButton(StartButton)
        track ? setButtonText('Stop') : setButtonText('Start')
    }, [track])

    const onCreate = async (values: FormValues) => {
        let newTrack = {
            title: values.title || "",
            kind: TrackKind.Working
        }
        dispatch(crudCallbacks.create(newTrack))
        form.resetFields()
    }


    return (
        <>
            <Form
                form={form}
                name="trackForm"
                onFinish={onCreate}
                size={'large'}
            >
                <Row gutter={24}>
                    <Col span={18}>
                        <Form.Item name={nameof<FormValues>('title')}>
                            <Input placeholder={'Title'}/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Button
                            type={'primary'}
                            shape={'round'}
                            size={'large'}
                            className={s.start_button}
                            {...button}
                        >{buttonText}</Button>
                    </Col>
                </Row>
            </Form>
            <Divider/>
            {track ? (
                <TrackerPanel track={track} />
            ) : (<></>)}
        </>
    )
}