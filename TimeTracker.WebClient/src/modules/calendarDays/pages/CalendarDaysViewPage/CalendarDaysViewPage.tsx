import { Button, Modal, Typography } from 'antd';
import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../behaviour/store";
import Title from 'antd/lib/typography/Title';
import { uppercaseToWords } from "../../../../utils/stringUtils";

const { Text } = Typography;

export const CalendarDaysViewPage = () => {
    const calendarDays = useSelector((s: RootState) => s.calendarDays.calendarDays);
    const loadingGet = useSelector((s: RootState) => s.calendarDays.loadingGet);
    const params = useParams();
    const navigate = useNavigate();
    const date = params.date
    const dayInView = calendarDays.find(day => day.date === date);

    return (
        <Modal
            title={<Title level={4}>View calendar day</Title>}
            confirmLoading={loadingGet}
            visible={true}
            onCancel={() => navigate(-1)}
            footer={[<Button type={'primary'} onClick={() => navigate(-1)}>Close</Button>]}
        >
            <div>
                <Title level={5}>{dayInView?.title}</Title>
                <table className={'tableView'}>
                    <tr>
                        <td>
                            <Text type={'secondary'}>Date:</Text>
                        </td>
                        <td>
                            <Text>{dayInView?.date}</Text>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Text type={'secondary'}>Kind:</Text>
                        </td>
                        <td>
                            <Text>{dayInView && uppercaseToWords(dayInView?.kind)}</Text>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Text type={'secondary'}>Work hours:</Text>
                        </td>
                        <td>
                            <Text>{dayInView?.workHours}</Text>
                        </td>
                    </tr>
                </table>
            </div>
        </Modal>
    );
};