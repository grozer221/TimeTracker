import React, { FC } from 'react';
import { ControlFilled, UserOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import s from '../../pages/TrackerPage/TrackerPage.module.css'
import { TrackCreation } from "../../../../behaviour/enums/TrackCreation";

type Props = {
    creation: TrackCreation
}

export const TrackCreationInfo: FC<Props> = ({ creation }) => {
    let trackCreationIcon: { [id: string]: JSX.Element; } = {
        "MANUALLY": <UserOutlined className={s.icons} />,
        "AUTOMATICALLY": <ControlFilled className={s.icons} />
    };

    return (
        <>
            <Tag icon={trackCreationIcon[creation]} style={{ padding: '6px' }}>
                {creation}
            </Tag>
        </>
    )
}