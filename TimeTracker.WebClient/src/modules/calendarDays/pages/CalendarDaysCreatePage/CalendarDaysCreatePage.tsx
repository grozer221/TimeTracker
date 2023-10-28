import { Checkbox, DatePicker, Form, Modal, Select, Tabs, Typography } from 'antd';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import moment, { Moment } from "moment";
import { LineOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { calendarDaysActions } from "../../store/calendarDays.slice";
import { RootState } from "../../../../behaviour/store";
import { DayKind } from "../../../../behaviour/enums/DayKind";
import { DayOfWeek } from "../../../../behaviour/enums/DayOfWeek";
import { nameof, uppercaseToWords } from "../../../../utils/stringUtils";
import { dateRender } from "../../../../convertors/dateRender";
import { CalendarDaysCreateInputType, CalendarDaysCreateRangeInputType } from "../../graphQL/calendarDays.mutations";
import Input from "antd/es/input/Input";
import { formStyles } from "../../../../assets/form";
import { range } from "../../../../utils/arrayUtils";

const { Title } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

type Tab = 'One' | 'Range';

type FromValues = {
    date?: Moment | '' | null,
    fromAndTo: Moment[],
    daysOfWeek: DayOfWeek[],
    title: string,
    kind: DayKind,
    workHours: string,
    override: boolean,
}

export const CalendarDaysCreatePage = () => {
    const [tab, setTab] = useState<Tab>('One')
    const settings = useSelector((s: RootState) => s.settings.settings);
    const calendarDays = useSelector((s: RootState) => s.calendarDays.calendarDays);
    const loading = useSelector((s: RootState) => s.calendarDays.loadingCreate);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [form] = useForm<FromValues>();
    const dispatch = useDispatch();
    const date = searchParams.get('date') && moment(searchParams.get('date'));

    const onFinish = async () => {
        try {
            await form.validateFields();
            const override = form.getFieldValue(nameof<FromValues>('override'));
            const title = form.getFieldValue(nameof<FromValues>('title'));
            const kind = form.getFieldValue(nameof<FromValues>('kind'));
            const workHours = parseInt(form.getFieldValue(nameof<FromValues>('workHours')))
            switch (tab) {
                case 'One':
                    const dateFieldName = nameof<FromValues>('date');
                    if (!form.getFieldValue(dateFieldName)) {
                        form.setFields([{ name: dateFieldName, errors: ['Date is required'] }])
                        break
                    }
                    const calendarDaysCreateInputType: CalendarDaysCreateInputType = {
                        date: (form.getFieldValue(dateFieldName) as Moment).format('YYYY-MM-DD'),
                        title,
                        kind,
                        workHours,
                        override,
                    }
                    dispatch(calendarDaysActions.createAsync(calendarDaysCreateInputType))
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
                    const calendarDaysCreateRangeInputType: CalendarDaysCreateRangeInputType = {
                        from: fromAndTo[0].format('YYYY-MM-DD'),
                        to: fromAndTo[1].format('YYYY-MM-DD'),
                        title,
                        daysOfWeek: daysOfWeek,
                        kind,
                        workHours,
                        override,
                    }
                    dispatch(calendarDaysActions.createRangeAsync(calendarDaysCreateRangeInputType))
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    }

    const initialValues: FromValues = {
        date: date,
        title: '',
        fromAndTo: [],
        daysOfWeek: Object.values(DayOfWeek),
        kind: DayKind.DayOff,
        workHours: '0',
        override: false,
    }

    return (
        <Modal
            title={<Title level={4}>Create calendar day</Title>}
            confirmLoading={loading}
            visible={true}
            onOk={() => form.submit()}
            okText={'Create'}
            onCancel={() => navigate(-1)}
        >
            <Form
                name="CalendarDaysCreateForm"
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
                                placeholder={'Date'}
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
                <Form.Item
                    name={nameof<FromValues>('title')}
                    label={'Title'}
                >
                    <Input placeholder={'Title'} />
                </Form.Item>
                <Form.Item
                    name={nameof<FromValues>('kind')}
                    label="Kind"
                    rules={[{ required: true, message: 'Kind is required' }]}
                >
                    <Select className={'w-100'} placeholder={'Kind'}>
                        {(Object.values(DayKind) as Array<DayKind>).map((value) => (
                            <Select.Option key={value} value={value}>
                                {uppercaseToWords(value)}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name={nameof<FromValues>('workHours')}
                    label="Work hours"
                    rules={[{ required: true, message: 'Work hours is required' }]}
                >
                    <Select
                        allowClear
                        placeholder="Hours in workday"
                    >
                        {range((settings?.employment.hoursInWorkday || 8) + 1, 0).map(num => <Select.Option
                            key={num}>{num}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item
                    name={nameof<FromValues>('override')}
                    valuePropName="checked"
                >
                    <Checkbox>Override</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
};