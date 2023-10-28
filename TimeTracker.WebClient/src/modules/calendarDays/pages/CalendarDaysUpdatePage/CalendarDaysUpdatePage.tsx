import { DatePicker, Form, Input, Modal, Select } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import moment, { Moment } from "moment";
import { useDispatch, useSelector } from "react-redux";
import { calendarDaysActions } from "../../store/calendarDays.slice";
import { RootState } from "../../../../behaviour/store";
import { DayKind } from "../../../../behaviour/enums/DayKind";
import { nameof, uppercaseToWords } from "../../../../utils/stringUtils";
import { dateRender } from "../../../../convertors/dateRender";
import Title from 'antd/lib/typography/Title';
import { formStyles } from "../../../../assets/form";
import { DayOfWeek } from "../../../../behaviour/enums/DayOfWeek";
import { range } from "../../../../utils/arrayUtils";
import { Loading } from "../../../../components/Loading/Loading";

type FromValues = {
    id?: string,
    date?: Moment,
    fromAndTo?: Moment[],
    daysOfWeek?: DayOfWeek[],
    title?: string | null,
    kind?: DayKind,
    workHours?: string,
    override?: boolean,
}

export const CalendarDaysUpdatePage = () => {
    const settings = useSelector((s: RootState) => s.settings.settings);
    const calendarDayByDate = useSelector((s: RootState) => s.calendarDays.calendarDayByDate);
    const loadingGetByDate = useSelector((s: RootState) => s.calendarDays.loadingGetByDate);
    const calendarDays = useSelector((s: RootState) => s.calendarDays.calendarDays);
    const loading = useSelector((s: RootState) => s.calendarDays.loadingUpdate);
    const params = useParams();
    const navigate = useNavigate();
    const [form] = useForm<FromValues>();
    const dispatch = useDispatch();
    const date = params.date
    const dayInUpdate = calendarDays.find(day => day.date === date) || calendarDayByDate;

    useEffect(() => {
        if (!dayInUpdate)
            dispatch(calendarDaysActions.getByDateAsync({ date: date || '' }));
    }, [])

    const onFinish = async () => {
        try {
            await form.validateFields();
            dispatch(calendarDaysActions.updateAsync({
                id: form.getFieldValue(nameof<FromValues>('id')),
                date: (form.getFieldValue(nameof<FromValues>('date')) as Moment).format('YYYY-MM-DD'),
                title: form.getFieldValue(nameof<FromValues>('title')),
                kind: form.getFieldValue(nameof<FromValues>('kind')),
                workHours: parseInt(form.getFieldValue(nameof<FromValues>('workHours'))),
            }))
        } catch (e) {
            console.log(e);
        }
    }

    const initialValues: FromValues = {
        id: dayInUpdate?.id,
        date: moment(dayInUpdate?.date),
        title: dayInUpdate?.title,
        kind: dayInUpdate?.kind,
        workHours: dayInUpdate?.workHours.toString(),
    }

    if (!dayInUpdate && !loadingGetByDate) {
        navigate('/error');
    }

    return (
        <Modal
            title={<Title level={4}>Update calendar day</Title>}
            confirmLoading={loading}
            visible={true}
            onOk={onFinish}
            okText={'Update'}
            onCancel={() => navigate(-1)}
        >
            {loadingGetByDate && !dayInUpdate
                ? <Loading />
                : <Form
                    name="CalendarDaysUpdateForm"
                    form={form}
                    onFinish={onFinish}
                    initialValues={initialValues}
                    labelCol={formStyles}
                >
                    <Form.Item
                        name={nameof<FromValues>('id')}
                        className={'invisible'}
                    >
                        <Input type={'hidden'} />
                    </Form.Item>
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
                </Form>
            }
        </Modal>
    );
};