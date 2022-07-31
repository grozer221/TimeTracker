import React, {memo} from 'react';
import {Modal} from "antd";
import Title from "antd/lib/typography/Title";
import {useNavigate, useParams} from "react-router-dom";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import './RemoveUserModal.css'
import {usersActions} from "../../store/users.slice";

const {confirm} = Modal;

export const RemoveUserModal = memo(() => {
    const navigate = useNavigate();
    const params = useParams();
    const email = params['email']
    const dispatch = useDispatch()

    const showConfirm = () => {
        confirm({
            title: <Title level={4}>Confirm removing</Title>,
            icon: <ExclamationCircleOutlined/>,
            content: 'Do you want to delete user "' + email + '" ?',
            onOk() {
                dispatch(usersActions.removeUserAsync({email: email as string}))
            },
            onCancel() {
                navigate(-1)
            },
        });
        return <></>
    };

    return <>
        {showConfirm()}
    </>
})