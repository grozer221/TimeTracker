import { Col, Form, Row, Select, TimePicker } from 'antd';
import React, { FC } from 'react';
import { useForm } from "antd/es/form/Form";
import { formStyles } from "../../../../assets/form";
import { SettingsEmploymentUpdateInputType } from "../../graphQL/settings.mutations";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../behaviour/store";
import { nameof } from "../../../../utils/stringUtils";
import { range } from "../../../../utils/arrayUtils";
import { ExtraHeaderButtons } from "../../../../components/ExtraHeaderButtons";
import { settingsActions } from "../../store/settings.slice";
import moment, { Moment } from "moment";

type FormValues = {
    workdayStartAt?: Moment,
    hoursInWorkday?: string,
};

export const SettingsEmploymentUpdate: FC = () => {
    const [form] = useForm<FormValues>();
    const dispatch = useDispatch();
    const loading = useSelector((s: RootState) => s.settings.loadingUpdate)
    const settings = useSelector((s: RootState) => s.settings.settings)

    const onFinish = (values: FormValues) => {
        const settingsEmploymentUpdateInputType: SettingsEmploymentUpdateInputType = {
            workdayStartAt: values.workdayStartAt?.utc().format('HH:mm:ss') || '',
            hoursInWorkday: values.hoursInWorkday ? parseInt(values.hoursInWorkday) : 0,
        }
        dispatch(settingsActions.updateEmploymentAsync(settingsEmploymentUpdateInputType));
    };

    const initialValues: FormValues = {
        workdayStartAt: moment(new Date(settings?.employment.workdayStartAt || '')),
        hoursInWorkday: settings?.employment?.hoursInWorkday.toString(),
    }

    return (
        <Form
            form={form}
            name="SettingsEmploymentUpdateForm"
            onFinish={onFinish}
            labelCol={formStyles}
            initialValues={initialValues}
        >
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        label="Workday start at"
                        name={nameof<FormValues>('workdayStartAt')}
                        rules={[{ required: true, message: 'Workday start at is required' }]}
                    >
                        <TimePicker placeholder={'Workday start at'} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Hours in workday"
                        name={nameof<FormValues>('hoursInWorkday')}
                        rules={[{ required: true, message: 'Hours in workday is required' }]}
                    >
                        <Select
                            allowClear
                            placeholder="Hours in workday"
                        >
                            {range(24, 0).map(num => <Select.Option key={num}>{num}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <ExtraHeaderButtons
                onDiscardChanges={() => form.resetFields()}
                onSaveChanges={form.submit}
                loading={loading}
            />
        </Form>
    );
};