import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { DatePicker, Form, Input, Modal, Select } from "antd";
import './CreateReportModal.css'
import Title from "antd/lib/typography/Title";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import { useDispatch } from "react-redux";
import { nameof } from "../../../utils/stringUtils";
import { excelExportActions } from "../store/excelExport.slice";
import { useAppSelector } from "../../../behaviour/store";
import moment, { now } from "moment";

type FormValues = {
    month: string
}

type Props = {};

export const CreateReportModal: FC<Props> = () => {
    const navigate = useNavigate();
    const [form] = useForm()
    const dispatch = useDispatch()
    const byteArr = useAppSelector(state => state.excel.file)
    let filter = useAppSelector(state => state.users.filter)

    useEffect(() => {
        if (byteArr.length) {
            let a = new Uint8Array(byteArr)
            downloadData(a)
            dispatch(excelExportActions.clearReport())
        }
    }, [byteArr])

    const downloadData = (byteArr: Uint8Array) => {
        let a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(new Blob([byteArr], { type: 'application/octet-stream' }));
        a.download = "Report.xlsx";
        document.body.appendChild(a)
        a.click();
        document.body.removeChild(a)
    }

    const handleOk = async () => {
        try {
            await form.validateFields()
            let date = form.getFieldValue(nameof<FormValues>("month")).toISOString()
            dispatch(excelExportActions.createReportAsync({ filter, date }))
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Modal
            title={<Title level={4}>Create excel report</Title>}
            visible={true}
            onOk={handleOk}
            okText={'Create'}
            onCancel={() => navigate(-1)}
        >
            <Form
                form={form}
                labelCol={{ span: 24 }}
                initialValues={{ month: moment(now()) }}
            >
                <Form.Item name={nameof<FormValues>("month")}
                    label={"Month:"}
                    rules={[{ required: true, message: 'Please, input report month!' }]}>
                    <DatePicker picker="month" />
                </Form.Item>
            </Form>
        </Modal>
    )
        ;
};