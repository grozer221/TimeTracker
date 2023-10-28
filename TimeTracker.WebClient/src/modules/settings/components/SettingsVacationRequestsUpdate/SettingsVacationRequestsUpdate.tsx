import { Col, Form, Input, InputNumber, Row } from 'antd';
import React, { FC } from 'react';
import { useForm } from "antd/es/form/Form";
import { formStyles } from "../../../../assets/form";
import { SettingsEmailUpdateInputType, SettingsVacationRequestsUpdateInputType } from "../../graphQL/settings.mutations";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../behaviour/store";
import { nameof } from "../../../../utils/stringUtils";
import { ExtraHeaderButtons } from "../../../../components/ExtraHeaderButtons";
import { settingsActions } from "../../store/settings.slice";

type FormValues = {
    amountDaysPerYear: number,
};

export const SettingsVacationRequestsUpdate: FC = ({ }) => {
    const [form] = useForm();
    const dispatch = useDispatch();
    const settingsLoadingUpdate = useSelector((s: RootState) => s.settings.loadingUpdate)
    const settings = useSelector((s: RootState) => s.settings.settings)

    const onFinish = (values: FormValues) => {
        const settingsVacationRequestsUpdateInputType: SettingsVacationRequestsUpdateInputType = {
            amountDaysPerYear: values.amountDaysPerYear,
        }
        dispatch(settingsActions.updateVacationRequestsAsync(settingsVacationRequestsUpdateInputType));
    };

    const initialValues: FormValues = {
        amountDaysPerYear: settings?.vacationRequests.amountDaysPerYear || 0
    }

    return (
        <Form
            form={form}
            name="SettingsVacationRequestsUpdateForm"
            onFinish={onFinish}
            labelCol={formStyles}
            initialValues={initialValues}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Amount days per year"
                        name={nameof<FormValues>('amountDaysPerYear')}
                        rules={[{ required: true, message: 'Amount days per year is required' }]}
                    >
                        <InputNumber
                            className={'w-100'}
                            placeholder={'Amount days per year'}
                            type={'number'}
                            min={0}
                        />
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