import { DatePicker, Form, Modal } from "antd";
import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../behaviour/store";
import { useForm } from "antd/es/form/Form";
import { nameof } from "../../../utils/stringUtils";
import Title from "antd/lib/typography/Title";
import { formStyles } from "../../../assets/form";
import Input from "antd/es/input/Input";
import { companiesActions } from "../behaviour/slice";

type FormValues = {
    name: string,
    email: string,
}

export const CompaniesCreatePage: FC = () => {
    const dispatch = useAppDispatch();
    const [form] = useForm<FormValues>();
    const navigate = useNavigate();

    const onFinish = async () => {
        try {
            await form.validateFields();
            const name = form.getFieldValue(nameof<FormValues>('name'))
            const email = form.getFieldValue(nameof<FormValues>('email'))
            dispatch(companiesActions.createAsync({ input: { name, email } }))
        } catch (e) {
            console.log(e)
        }
    }

    const initialValues: FormValues = {
        name: '',
        email: '',
    }

    return (
        <Modal
            title={<Title level={4}>Create company</Title>}
            // confirmLoading={loadingCreate}
            visible={true}
            onOk={() => form.submit()}
            okText={'Create'}
            onCancel={() => navigate(-1)}
        >
            <Form
                name="CompaniesCreateForm"
                form={form}
                onFinish={onFinish}
                initialValues={initialValues}
                labelCol={formStyles}
            >
                <Form.Item
                    name={nameof<FormValues>('name')}
                    label={'Name'}
                    rules={[
                        { required: true, message: 'Please input company name' },
                    ]}
                >
                    <Input placeholder={'Name'} />
                </Form.Item>
                <Form.Item
                    name={nameof<FormValues>('email')}
                    label={'Email'}
                    rules={[
                        { required: true, message: 'Please input company email' },
                        { type: "email", message: "Email is not valid" }
                    ]}
                >
                    <Input placeholder={'Email'} />
                </Form.Item>
            </Form>
        </Modal>
    );
};