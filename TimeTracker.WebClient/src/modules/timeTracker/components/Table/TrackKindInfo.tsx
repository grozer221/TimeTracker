import React, { FC } from 'react';
import { AlertOutlined, CarOutlined, CodeSandboxOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import s from '../../pages/TrackerPage/TrackerPage.module.css'
import { TrackKind } from "../../../../behaviour/enums/TrackKind";
import { Track } from "../../../tracks/graphQL/tracks.types";

type Props = {
    kind: TrackKind
}

export const TrackKindInfo: FC<Props> = ({ kind }) => {
    let trackKindIcon: { [id: string]: JSX.Element; } = {
        "WORKING": <CodeSandboxOutlined className={s.icons} />,
        "VACATION": <CarOutlined className={s.icons} />,
        "SICK": <AlertOutlined className={s.icons} />
    };

    return (
        <>
            <Tag icon={trackKindIcon[kind]} style={{ padding: '6px' }}>
                {kind}
            </Tag>
        </>
    )
}