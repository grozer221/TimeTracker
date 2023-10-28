import { DatePicker, Form, Modal, Select, Tabs } from 'antd';
import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import moment, { Moment } from "moment";
import { LineOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { calendarDaysActions } from "../../store/calendarDays.slice";
import { RootState } from "../../../../behaviour/store";
import { DayOfWeek } from "../../../../behaviour/enums/DayOfWeek";
import { nameof, uppercaseToWords } from "../../../../utils/stringUtils";
import { dateRender } from "../../../../convertors/dateRender";
import Title from "antd/lib/typography/Title";
import { formStyles } from "../../../../assets/form";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

type Tab = 'One' | 'Range';

type FromValues = {
    date?: Moment | '',
    fromAndTo?: Moment[]
    daysOfWeek?: DayOfWeek[],
}

export const CalendarDaysRemovePage = () => {
    const [tab, setTab] = useState<Tab>('One')
    const calendarDays = useSelector((s: RootState) => s.calendarDays.calendarDays);
    const loading = useSelector((s: RootState) => s.calendarDays.loadingRemove);
    const navigate = useNavigate();
    const [form] = useForm<FromValues>();
    const dispatch = useDispatch();
    const params = useParams();
    const date = params.date && moment(params.date);

    const onFinish = async () => {
        try {
            await form.validateFields();
            switch (tab) {
                case 'One':
                    const dateInputName = nameof<FromValues>('date');
                    if (!form.getFieldValue(dateInputName)) {
                        form.setFields([{ name: dateInputName, errors: ['Date is required'] }])
                        break
                    }
                    dispatch(calendarDaysActions.removeAsync((form.getFieldValue(dateInputName) as Moment).format('YYYY-MM-DD')));
                    break;
                case 'Range':
                    const fromAndToFieldName = nameof<FromValues>('fromAndTo');
                    if (!form.getFieldValue(fromAndToFieldName)) {
                        form.setFields([{ name: fromAndToFieldName, errors: ['From and to is required'] }])
                        break
                    }
                    const daysOfWeekFieldName = nameof<FromValues>('daysOfWeek');
                    if (!form.getFieldValue(daysOfWeekFieldName)) {
                        form.setFields([{ name: daysOfWeekFieldName, errors: ['Day of weeks is required'] }])
                        break
                    }
                    const fromAndTo = form.getFieldValue(fromAndToFieldName) as Moment[];
                    const daysOfWeek = form.getFieldValue(daysOfWeekFieldName) as DayOfWeek[];
                    dispatch(calendarDaysActions.removeRangeAsync({
                        from: fromAndTo[0].format('YYYY-MM-DD'),
                        to: fromAndTo[1].format('YYYY-MM-DD'),
                        daysOfWeek
                    }));
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    }

    const initialValues: FromValues = {
        date: date,
        fromAndTo: [],
        daysOfWeek: Object.values(DayOfWeek),
    }

    return (
        <Modal
            title={<Title level={4}>Remove calendar day</Title>}
            confirmLoading={loading}
            visible={true}
            onOk={() => form.submit()}
            cancelButtonProps={{ type: 'primary' }}
            okButtonProps={{ danger: true }}
            okText={'Remove'}
            onCancel={() => navigate(-1)}
        >
            <Form
                name="CalendarDaysRemoveForm"
                form={form}
                onFinish={onFinish}
                initialValues={initialValues}
                labelCol={formStyles}
            >
                <Tabs defaultActiveKey={tab} onChange={tab => setTab(tab as Tab)}>
                    <TabPane
                        tab={<><LineOutlined />One</>}
                        key="One"
                    >
                        <Form.Item
                            name={nameof<FromValues>('date')}
                            label={'Date'}
                        >
                            <DatePicker
                                className={'w-100'}
                                dateRender={current => dateRender(current, calendarDays)}
                            />
                        </Form.Item>
                    </TabPane>
                    <TabPane
                        tab={<><UnorderedListOutlined />Range</>}
                        key="Range"
                    >
                        <Form.Item
                            name={nameof<FromValues>('fromAndTo')}
                            label={'From and to'}
                        >
                            <RangePicker
                                className={'w-100'}
                                dateRender={current => dateRender(current, calendarDays)}
                            />
                        </Form.Item>
                        <Form.Item
                            name={nameof<FromValues>('daysOfWeek')}
                            label={'Days of week'}
                        >
                            <Select
                                className={'w-100'}
                                mode="multiple"
                                allowClear
                                placeholder="Day of weeks"
                            >
                                {(Object.values(DayOfWeek) as Array<DayOfWeek>).map((value) => (
                                    <Select.Option key={value} value={value}>
                                        {uppercaseToWords(value)}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </TabPane>
                </Tabs>
            </Form>
        </Modal>
    );
};