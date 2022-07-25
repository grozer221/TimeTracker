import {DatePicker, Form, Input, InputNumber, Modal, Select} from 'antd';
import React from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "antd/es/form/Form";
import moment, {Moment} from "moment";
import {useDispatch, useSelector} from "react-redux";
import {calendarDaysActions} from "../../store/calendarDays.slice";
import {RootState} from "../../../../store/store";
import {DayKind} from "../../../../graphQL/enums/DayKind";
import {nameof, uppercaseToWords} from "../../../../utils/stringUtils";
import {dateRender} from "../../../../convertors/dateRender";
import Title from 'antd/lib/typography/Title';
import {formStyles} from "../../../../assets/form";
import {DayOfWeek} from "../../../../graphQL/enums/DayOfWeek";

type FromValues = {
    id?: string,
    date?: Moment,
    fromAndTo?: Moment[],
    daysOfWeek?: DayOfWeek[],
    title?: string | null,
    kind?: DayKind,
    percentageWorkHours?: number,
    override?: boolean,
}

export const CalendarDaysUpdatePage = () => {
    const calendarDays = useSelector((s: RootState) => s.calendarDays.calendarDays);
    const loading = useSelector((s: RootState) => s.calendarDays.loadingUpdate);
    const params = useParams();
    const navigate = useNavigate();
    const [form] = useForm<FromValues>();
    const dispatch = useDispatch();
    const date = params.date
    const dayInUpdate = calendarDays.find(day => day.date === date);

    const onFinish = async () => {
        try {
            await form.validateFields();
            dispatch(calendarDaysActions.updateAsync({
                id: form.getFieldValue(nameof<FromValues>('id')),
                date: (form.getFieldValue(nameof<FromValues>('date')) as Moment).format('YYYY-MM-DD'),
                title: form.getFieldValue(nameof<FromValues>('title')),
                kind: form.getFieldValue(nameof<FromValues>('kind')),
                percentageWorkHours: form.getFieldValue(nameof<FromValues>('percentageWorkHours')),
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
        percentageWorkHours: dayInUpdate?.percentageWorkHours,
    }

    if (!dayInUpdate) {
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
            <Form
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
                    <Input type={'hidden'}/>
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
                    <Input placeholder={'Title'}/>
                </Form.Item>
                <Form.Item
                    name={nameof<FromValues>('kind')}
                    label="Kind"
                    rules={[{required: true, message: 'Kind is required'}]}
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
                    name={nameof<FromValues>('percentageWorkHours')}
                    label="% work hours"
                    rules={[{required: true, message: '% work hours is required'}]}
                >
                    <InputNumber
                        placeholder={'% work hours'}
                        type={'number'}
                        className={'w-100'}
                        min={0}
                        max={100}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};