import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../../../behaviour/store";
import { vacationRequestsActions } from "../../store/vacationRequests.slice";
import { DatePicker, Form, Modal, Row, Space, Typography } from "antd";
import { nameof } from "../../../../utils/stringUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { Moment } from "moment";
import { formStyles } from "../../../../assets/form";
import Input from "antd/es/input/Input";
import Title from 'antd/lib/typography/Title';
import { useForm } from "antd/es/form/Form";
import { VacationRequestsCreateInputType } from "../../graphQL/vacationRequests.mutations";
import { ReloadOutlined } from "@ant-design/icons";
import { WithSmallLoading } from "../../../../hocs/WithSmallLoading/WithSmallLoading";

const { RangePicker } = DatePicker;
const { Text } = Typography;


type FromValues = {
    startAndEnd: Moment[],
    comment?: string,
}

type RangeValue = [Moment | null, Moment | null] | null;

export const VacationRequestsCreatePage: FC = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const settings = useAppSelector(s => s.settings.settings)
    const loadingGet = useAppSelector(s => s.vacationRequests.loadingGet)
    const loadingGetAvailableDays = useAppSelector(s => s.vacationRequests.loadingGetAvailableDays)
    const availableDays = useAppSelector(s => s.vacationRequests.availableDays)
    const [form] = useForm<FromValues>();
    const navigate = useNavigate();
    const [dates, setDates] = useState<RangeValue>(null);
    const [hackValue, setHackValue] = useState<RangeValue>(null);
    const [value, setValue] = useState<RangeValue>(null);

    useEffect(() => {
        if (!availableDays) {
            dispatch(vacationRequestsActions.getAvailableDaysAsync())
        }
    }, [])

    const onFinish = async () => {
        try {
            await form.validateFields();
            const startAndEnd: Moment[] = form.getFieldValue(nameof<FromValues>('startAndEnd'));
            const comment: string = form.getFieldValue(nameof<FromValues>('comment'));
            const vacationRequestsCreateInputType: VacationRequestsCreateInputType = {
                dateStart: startAndEnd[0].format('YYYY-MM-DD'),
                dateEnd: startAndEnd[1].format('YYYY-MM-DD'),
                comment,
            }
            dispatch(vacationRequestsActions.createAsync(vacationRequestsCreateInputType))
        } catch (e) {
            console.log(e);
        }
    }

    const disabledDate = (current: Moment) => {
        if (!dates) {
            return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'days') > availableDays - 1;
        const tooEarly = dates[1] && dates[1].diff(current, 'days') > availableDays - 1;
        return !!tooEarly || !!tooLate;
    };

    const onOpenChange = (open: boolean) => {
        if (open) {
            setHackValue([null, null]);
            setDates([null, null]);
        } else {
            setHackValue(null);
        }
    };

    const initialValues: FromValues = {
        startAndEnd: [],
        comment: '',
    }

    return (
        <Modal
            title={<Title level={4}>Create vacation request</Title>}
            confirmLoading={loadingGet}
            visible={true}
            onOk={() => form.submit()}
            okText={'Create'}
            onCancel={() => navigate(-1)}
        >
            <Form
                disabled={!availableDays}
                name="VacationRequestsCreateForm"
                form={form}
                onFinish={onFinish}
                initialValues={initialValues}
                labelCol={formStyles}
            >
                {!loadingGetAvailableDays && !availableDays && <div className={'errorText'}>You can not create vacation request because you do not have available days</div>}
                <Form.Item
                    name={nameof<FromValues>('startAndEnd')}
                    label={'Start and end'}
                    rules={[{ required: true, message: 'Date start and date end is required' }]}
                >
                    <RangePicker
                        disabled={loadingGetAvailableDays}
                        value={hackValue || value}
                        disabledDate={disabledDate}
                        onCalendarChange={val => setDates(val)}
                        onChange={val => setValue(val)}
                        onOpenChange={onOpenChange}
                    />

                </Form.Item>
                <Row justify={'end'} className={'mt--10'}>
                    <WithSmallLoading loading={loadingGetAvailableDays}>
                        <Text type={'secondary'}>
                            <Space>
                                <ReloadOutlined
                                    disabled={loadingGetAvailableDays}
                                    onClick={() => dispatch(vacationRequestsActions.getAvailableDaysAsync())}
                                />
                                <span>Available days: {availableDays} / {settings?.vacationRequests.amountDaysPerYear}</span>
                            </Space>
                        </Text>
                    </WithSmallLoading>
                </Row>
                <Form.Item
                    name={nameof<FromValues>('comment')}
                    label={'Comment'}
                >
                    <Input placeholder={'Comment'} />
                </Form.Item>
            </Form>
        </Modal>
    );
};