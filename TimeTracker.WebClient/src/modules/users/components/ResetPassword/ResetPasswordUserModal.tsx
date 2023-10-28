import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Radio } from "antd";
import './CreateUserModal.css'
import Title from "antd/lib/typography/Title";
import { useNavigate, useParams } from "react-router-dom";
import { nameof } from "../../../../utils/stringUtils";
import { useForm } from "antd/es/form/Form";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppSelector } from "../../../../behaviour/store";
import { User } from "../../graphQL/users.types";
import { usersActions } from "../../store/users.slice";
import { ResetUserPasswordInput } from "../../graphQL/users.mutations";


type FormValues = {
    newPassword: string,
    repeatNewPassword: string,
}

type Props = {};
export const ResetPasswordUserModal: FC<Props> = () => {
    const navigate = useNavigate();
    const [form] = useForm()
    const dispatch = useDispatch()
    const params = useParams();
    const userId = params['id']

    let user = useSelector((s: RootState) => s.users.users.find(x => x.id === userId)) as User

    const handleOk = async () => {
        try {
            await form.validateFields()
            const newPassword = form.getFieldValue(nameof<FormValues>("newPassword"))
            const repeatNewPassword = form.getFieldValue(nameof<FormValues>("repeatNewPassword"))

            dispatch(usersActions.resetUserPassword({
                password: newPassword,
                confirmPassword: repeatNewPassword,
                id: userId
            } as ResetUserPasswordInput))

        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Modal
            title={<Title level={4}>Reset password for {user.email}</Title>}
            // confirmLoading={loading}
            visible={true}
            onOk={handleOk}
            okText={'Reset'}
            onCancel={() => navigate(-1)}
        >
            <Form
                form={form}
                labelCol={{ span: 24 }}>
                <Form.Item name={nameof<FormValues>("newPassword")}
                    label={"Password:"}
                    rules={[{ required: true, message: 'Please input user Password!' }]}>
                    <Input.Password
                        placeholder="Input user password"
                    />
                </Form.Item>
                <Form.Item name={nameof<FormValues>("repeatNewPassword")}
                    label={"Repeat password:"}
                    dependencies={['password']}
                    hasFeedback
                    rules={[{ required: true, message: 'Please repeat new password!', },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    }),
                    ]}>
                    <Input.Password placeholder="Repeat password" />
                </Form.Item>
            </Form>
        </Modal>
    );
};