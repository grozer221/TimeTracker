import { Col, Form, Row, Select, Space, Switch, TimePicker } from 'antd';
import React, { FC } from 'react';
import { useForm } from "antd/es/form/Form";
import { formStyles } from "../../../../assets/form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../behaviour/store";
import { nameof, uppercaseToWords } from "../../../../utils/stringUtils";
import moment, { Moment } from "moment";
import { ExtraHeaderButtons } from "../../../../components/ExtraHeaderButtons";
import Title from "antd/lib/typography/Title";
import { DayOfWeek } from "../../../../behaviour/enums/DayOfWeek";
import { SettingsTasksUpdateInputType } from "../../graphQL/settings.mutations";
import { settingsActions } from "../../store/settings.slice";

type FormValues = {
    autoCreateTracks_IsEnabled: boolean,
    autoCreateTracks_TimeWhenCreate?: Moment,
    autoCreateDaysOff_IsEnabled: boolean,
    autoCreateDaysOff_DayOfWeekWhenCreate?: DayOfWeek,
    autoCreateDaysOff_TimeWhenCreate?: Moment,
    autoCreateDaysOff_DaysOfWeek?: DayOfWeek[],
}

export const SettingsTasksUpdate: FC = () => {
    const [form] = useForm<FormValues>();
    const dispatch = useDispatch();
    const loading = useSelector((s: RootState) => s.settings.loadingUpdate)
    const settings = useSelector((s: RootState) => s.settings.settings)
    const autoCreateDaysOff_IsEnabled = Form.useWatch(nameof<FormValues>('autoCreateDaysOff_IsEnabled'), form);
    const autoCreateTracks_IsEnabled = Form.useWatch(nameof<FormValues>('autoCreateTracks_IsEnabled'), form);

    const onFinish = (values: FormValues) => {
        console.log(values.autoCreateTracks_TimeWhenCreate, values.autoCreateTracks_TimeWhenCreate?.utc())
        const settingsTasksUpdateInputType: SettingsTasksUpdateInputType = {
            autoCreateTracks: {
                isEnabled: values.autoCreateTracks_IsEnabled,
                timeWhenCreate: values.autoCreateTracks_TimeWhenCreate?.utc().format('HH:mm:ss'),
            },
            autoCreateDaysOff: {
                isEnabled: values.autoCreateDaysOff_IsEnabled,
                dayOfWeekWhenCreate: values.autoCreateDaysOff_DayOfWeekWhenCreate,
                timeWhenCreate: values.autoCreateDaysOff_TimeWhenCreate?.utc().format('HH:mm:ss'),
                daysOfWeek: values.autoCreateDaysOff_DaysOfWeek,
            }
        }
        dispatch(settingsActions.updateTasksAsync(settingsTasksUpdateInputType));
    };

    const onDiscardChanges = () => {
        form.resetFields()
        form.setFieldsValue(initialValues)
    }

    const initialValues: FormValues = {
        autoCreateTracks_IsEnabled: settings?.tasks?.autoCreateTracks?.isEnabled || false,
        autoCreateTracks_TimeWhenCreate: moment(settings?.tasks?.autoCreateTracks?.timeWhenCreate).local(),
        autoCreateDaysOff_IsEnabled: settings?.tasks?.autoCreateDaysOff?.isEnabled || false,
        autoCreateDaysOff_DayOfWeekWhenCreate: settings?.tasks?.autoCreateDaysOff?.dayOfWeekWhenCreate,
        autoCreateDaysOff_TimeWhenCreate: moment(settings?.tasks?.autoCreateDaysOff?.timeWhenCreate).local(),
        autoCreateDaysOff_DaysOfWeek: settings?.tasks?.autoCreateDaysOff?.daysOfWeek,
    }

    return (
        <Form
            form={form}
            name="SettingsTasksUpdateForm"
            onFinish={onFinish}
            labelCol={formStyles}
            initialValues={initialValues}
        >
            <div className={'settingsBlock'}>
                <Space>
                    <Form.Item
                        name={nameof<FormValues>('autoCreateTracks_IsEnabled')}
                        style={{ marginBottom: 0 }}
                    >
                        <Switch size={'small'}
                            defaultChecked={initialValues.autoCreateTracks_IsEnabled} />
                    </Form.Item>
                    <Title level={4}>Auto create tracks</Title>
                </Space>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Time when create"
                            name={nameof<FormValues>('autoCreateTracks_TimeWhenCreate')}
                        >
                            <TimePicker
                                placeholder={'Time when set'}
                                disabled={!autoCreateTracks_IsEnabled}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>

            <div className={'settingsBlock'}>
                <Space>
                    <Form.Item
                        name={nameof<FormValues>('autoCreateDaysOff_IsEnabled')}
                        style={{ marginBottom: 0 }}
                    >
                        <Switch size={'small'} defaultChecked={initialValues.autoCreateDaysOff_IsEnabled} />
                    </Form.Item>
                    <Title level={4}>Auto create days off</Title>
                </Space>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Day of week when create"
                            name={nameof<FormValues>('autoCreateDaysOff_DayOfWeekWhenCreate')}
                        >
                            <Select
                                allowClear
                                placeholder="Day of week"
                                disabled={!autoCreateDaysOff_IsEnabled}
                            >
                                {(Object.values(DayOfWeek) as Array<DayOfWeek>).map((value) => (
                                    <Select.Option key={value} value={value}>
                                        {uppercaseToWords(value)}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Time when create"
                            name={nameof<FormValues>('autoCreateDaysOff_TimeWhenCreate')}
                        >
                            <TimePicker
                                placeholder={'Time'}
                                disabled={!autoCreateDaysOff_IsEnabled}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Days of week"
                            name={nameof<FormValues>('autoCreateDaysOff_DaysOfWeek')}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                placeholder="Days of week"
                                disabled={!autoCreateDaysOff_IsEnabled}
                            >
                                {(Object.values(DayOfWeek) as Array<DayOfWeek>).map((value) => (
                                    <Select.Option key={value} value={value}>
                                        {uppercaseToWords(value)}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </div>
            <ExtraHeaderButtons
                onDiscardChanges={onDiscardChanges}
                onSaveChanges={form.submit}
                loading={loading}
            />
        </Form>
    );
};