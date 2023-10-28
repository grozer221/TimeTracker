import { DatePicker, Form, Input, Modal, Typography } from "antd";
import moment, { Moment } from "moment";
import React, { FC, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../behaviour/store";
import { useForm } from "antd/es/form/Form";
import { nameof } from "../../../utils/stringUtils";
import Title from "antd/lib/typography/Title";
import { formStyles } from "../../../assets/form";
import { Loading } from "../../../components/Loading/Loading";
import { companiesActions } from "../behaviour/slice";

const { RangePicker } = DatePicker;
const { Text } = Typography;


type FromValues = {
    id: string;
    name: string;
    email: string;
}

export const CompaniesUpdatePage: FC = () => {
    const params = useParams()
    const id = params.id || '';
    const location = useLocation();
    const dispatch = useAppDispatch();
    const companies = useAppSelector(s => s.companies.companies)
    const [form] = useForm<FromValues>();
    const navigate = useNavigate();
    const companyInUpdate = companies.entities.find(v => v.id === id);

    useEffect(() => {
        if (!companyInUpdate) {
            dispatch(companiesActions.getCompanyAsync({ id }))
        }
    }, [])

    const onFinish = async () => {
        try {
            await form.validateFields();
            const id = form.getFieldValue(nameof<FromValues>('id'))
            const name = form.getFieldValue(nameof<FromValues>("name"))
            const email = form.getFieldValue(nameof<FromValues>("email"))
            dispatch(companiesActions.updateAsync({
                id,
                input: { name, email }
            }))
        } catch (e) {
            console.log(e);
        }
    }


    const initialValues: FromValues = {
        id: companyInUpdate?.id || '',
        name: companyInUpdate?.name || '',
        email: companyInUpdate?.email || '',
    }

    return (
        <Modal
            title={<Title level={4}>Update company</Title>}
            // confirmLoading={loadingUpdate}
            visible={true}
            onOk={() => form.submit()}
            okText={'Update'}
            onCancel={() => navigate(-1)}
        >
            {/* {
                loadingGet || loadingGetById || !companyInUpdate
                    ? <Loading />
                    : */}
            <Form
                name="CompaniesUpdateForm"
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
                    name={nameof<FromValues>('name')}
                    label={'Name'}
                    rules={[
                        { required: true, message: 'Please input company email' },
                    ]}
                >
                    <Input placeholder={'Name'} />
                </Form.Item>
                <Form.Item
                    name={nameof<FromValues>('email')}
                    label={'Email'}
                    rules={[
                        { required: true, message: 'Please input company email' },
                        { type: "email", message: "Email is not valid" }
                    ]}
                >
                    <Input placeholder={'Email'} />
                </Form.Item>
            </Form>
            {/* } */}
        </Modal>
    );
};