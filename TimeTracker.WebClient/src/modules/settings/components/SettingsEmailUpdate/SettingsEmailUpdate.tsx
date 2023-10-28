import { Col, Form, Input, Row } from 'antd';
import React, { FC } from 'react';
import { useForm } from "antd/es/form/Form";
import { formStyles } from "../../../../assets/form";
import { SettingsEmailUpdateInputType } from "../../graphQL/settings.mutations";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../behaviour/store";
import { nameof } from "../../../../utils/stringUtils";
import { ExtraHeaderButtons } from "../../../../components/ExtraHeaderButtons";
import { settingsActions } from "../../store/settings.slice";

type FormValues = {
    name?: string,
    address?: string,
};

export const SettingsEmailUpdate: FC = ({ }) => {
    const [form] = useForm();
    const dispatch = useDispatch();
    const settingsLoadingUpdate = useSelector((s: RootState) => s.settings.loadingUpdate)
    const settings = useSelector((s: RootState) => s.settings.settings)

    const onFinish = (values: FormValues) => {
        const settingsEmailUpdateInputType: SettingsEmailUpdateInputType = {
            name: values.name,
            address: values.address,
        }
        dispatch(settingsActions.updateEmailAsync(settingsEmailUpdateInputType));
    };

    const initialValues: FormValues = {
        name: settings?.email?.name,
        address: settings?.email?.address,
    }

    return (
        <Form
            form={form}
            name="SettingsEmailUpdateForm"
            onFinish={onFinish}
            labelCol={formStyles}
            initialValues={initialValues}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Name"
                        name={nameof<FormValues>('name')}
                    >
                        <Input placeholder={'Name'} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Address"
                        name={nameof<FormValues>('address')}
                        rules={[{ type: 'email', message: 'Address must be email' }]}
                    >
                        <Input placeholder={'Address'} />
                    </Form.Item>
                </Col>
            </Row>
            <ExtraHeaderButtons
                onDiscardChanges={() => form.resetFields()}
                onSaveChanges={form.submit}
                loading={settingsLoadingUpdate}
            />
        </Form>
    );
};