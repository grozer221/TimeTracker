import * as React from 'react';
import { Form, Input, Modal, Radio, Select } from "antd";
import { FC, useEffect, useState, } from "react";
import Title from "antd/lib/typography/Title";
import { useParams } from "react-router-dom";
import { nameof, uppercaseToWords } from "../../../../utils/stringUtils";
import { Permission } from "../../../../behaviour/enums/Permission";
import { useForm } from "antd/es/form/Form";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../graphQL/users.types";
import { usersActions } from "../../store/users.slice";
import { RootState, useAppSelector } from "../../../../behaviour/store";
import { UpdateUserInput } from "../../graphQL/users.mutations";
import { Employment } from "../../../../behaviour/enums/Employment";
import { navigateActions } from "../../../navigate/store/navigate.slice";
import { InfiniteScrollSelect } from "../../../../components/InfiniteScrollSelect";
import { Loading } from "../../../../components/Loading/Loading";

type FormValues = {
    firstName: string,
    lastName: string,
    middleName: string,
    email: string,
    password: string,
    repeatPassword: string,
    permissions: Permission[],
    employment: Employment,
}

type Props = {};
export const UpdateUserModal: FC<Props> = () => {
    const [form] = useForm()
    const dispatch = useDispatch()
    const params = useParams();
    const email = params['email'] as string

    let [usersPageSize, setUsersPageSize] = useState(10)

    useEffect(() => {
        dispatch(usersActions.getUserByEmailAsync(email))
        dispatch(usersActions.fetchUsersInfinityLoad({ filter: { email: "" }, skip: 0, take: usersPageSize }))
    }, [])

    let user = useSelector((s: RootState) => s.users.userProfile) as User
    let usersInfinityLoad = useSelector((s: RootState) => s.users.usersInfinityLoad)
    let crudLoading = useSelector((s: RootState) => s.users.crudLoading)

    let [usersWhichCanApproveVacationRequest, setUsersWhichCanApproveVacationRequest] = useState<string[]>(
        user ? user.usersWhichCanApproveVacationRequest.map(u => u.id) : []
    )

    if (user === null || usersInfinityLoad === null) return <Loading />

    let notFetchedUsers = user.usersWhichCanApproveVacationRequest.filter(user => {
        return !usersInfinityLoad?.entities.find(u => u.id === user.id);
    }) as User[]

    const handleOk = async () => {
        try {
            await form.validateFields()
            const firstName = form.getFieldValue(nameof<FormValues>("firstName"))
            const lastName = form.getFieldValue(nameof<FormValues>("lastName"))
            const middleName = form.getFieldValue(nameof<FormValues>("middleName"))
            const email = form.getFieldValue(nameof<FormValues>("email"))
            const employment = form.getFieldValue(nameof<FormValues>("employment"))
            const permissions = form.getFieldValue(nameof<FormValues>("permissions")) ?? []

            let updatedUser: UpdateUserInput = {
                id: user.id,
                firstName, lastName, middleName, email, permissions, employment,
                usersWhichCanApproveVacationRequestIds: usersWhichCanApproveVacationRequest
            } as UpdateUserInput

            dispatch(usersActions.updateUser(updatedUser))
        } catch (e) {
            console.log(e)
        }
    }

    const handleCancel = () => {
        dispatch(usersActions.clearUsersForVacationData())
        dispatch(navigateActions.navigate(-1))
    }

    return (
        <Modal
            title={<Title level={4}>{"Update User " + user.firstName}</Title>}
            confirmLoading={crudLoading}
            visible={true}
            onOk={handleOk}
            okText={'Update'}
            onCancel={handleCancel}
        >
            <Form
                form={form}
                labelCol={{ span: 24 }}
                initialValues={{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    middleName: user.middleName,
                    email: user.email,
                    permissions: user.permissions,
                    employment: user.employment,
                } as FormValues}
            >
                <Form.Item name={nameof<FormValues>("firstName")}
                    label={"Firstname:"}
                    rules={[{ required: true, message: 'Please input user Firstname!' }]}
                >
                    <Input placeholder="Input user firstname" />
                </Form.Item>

                <Form.Item name={nameof<FormValues>("lastName")}
                    label={"Lastname:"}
                    rules={[{ required: true, message: 'Please input user Lastname!' }]}>
                    <Input placeholder="Input user lastname" />
                </Form.Item>

                <Form.Item name={nameof<FormValues>("middleName")}
                    label={"Middle name:"}
                    rules={[{ required: true, message: 'Please input user Middle name!' }]}>
                    <Input placeholder="Input user Middle name" />
                </Form.Item>

                <Form.Item name={nameof<FormValues>("email")}
                    label={"Email:"}
                    rules={[{ required: true, message: 'Please input user Email!' }]}>
                    <Input placeholder="example@gmail.com" />
                </Form.Item>

                <Form.Item name={nameof<FormValues>("employment")}
                    label={"Employment:"}
                    rules={[{ required: true, message: 'Please choose user employment!' }]}>
                    <Radio.Group>
                        {
                            Object.values(Employment).map(value =>
                                <Radio value={value}>
                                    {uppercaseToWords(value)}
                                </Radio>)
                        }
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name={nameof<FormValues>("permissions")}
                    label={'Permissions'}
                >
                    <Select
                        className={'w-100'}
                        mode="multiple"
                        allowClear
                        placeholder="Day of weeks"
                    >
                        {(Object.values(Permission) as Array<Permission>).map((value) => (
                            <Select.Option key={value} value={value}>
                                {uppercaseToWords(value)}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label={'Users which can approve vacation request'}
                >
                    <InfiniteScrollSelect notFetchedUsers={notFetchedUsers}
                        initialValues={usersWhichCanApproveVacationRequest}
                        onChange={setUsersWhichCanApproveVacationRequest} />
                </Form.Item>
            </Form>
        </Modal>
    );
};