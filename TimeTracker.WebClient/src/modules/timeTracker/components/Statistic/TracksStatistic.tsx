import React, { FC } from 'react';
import moment from "moment";
import { useAppSelector } from "../../../../behaviour/store";
import { Col, Row } from "antd";


export const TracksStatistic: FC = () => {
    const statistic = useAppSelector(s => s.statistic.statistic)
    const totalWorkerHours = Math.floor(statistic.workerHours)
    const workerHoursMilliseconds = statistic.workerHours * 60 * 60 * 1000
    const workerHours = totalWorkerHours.toString().padStart(2, '0') + moment(workerHoursMilliseconds).format(':mm:ss')
    const monthHours = statistic.monthHours + ':00:00'
    const needToWorkNum = statistic.monthHours - statistic.workerHours
    const needToWorkHours = Math.floor(needToWorkNum)
    const needToWorkMilliseconds = needToWorkNum * 60 * 60 * 1000
    const needToWork = needToWorkHours.toString().padStart(2, '0') + moment(needToWorkMilliseconds).format(':mm:ss')

    return (
        <>
            <Row>
                <Col span={4}>
                    Total time: {workerHours}
                </Col>
                <Col span={4}>
                    Month hours: {monthHours}
                </Col>
                {workerHours < monthHours ?
                    <Col span={4}>
                        Need to work:  {needToWork}
                    </Col> : <></>}
            </Row>
        </>
    )
}