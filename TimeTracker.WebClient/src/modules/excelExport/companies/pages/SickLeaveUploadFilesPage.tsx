import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Row, Table } from "antd";
import moment, { Moment } from "moment";
import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import Title from "antd/lib/typography/Title";
import { sickLeaveActions } from "../store/sickLeave.slice";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../../../../behaviour/store";
import { nameof } from "../../../../utils/stringUtils";
import { formStyles } from "../../../../assets/form";
import { Loading } from "../../../../components/Loading/Loading";

const { RangePicker } = DatePicker;

type FromValues = {
    id: string,
    user: string,
    startAndEnd: Moment[],
    comment?: string,
}

export const SickLeaveUploadFilesPage: FC = () => {
    const params = useParams()
    const id = params.id || '';
    const dispatch = useAppDispatch();
    const sickLeaveDays = useAppSelector(s => s.sickLeave.sickLeaveDays)
    const [form] = useForm<FromValues>();
    const navigate = useNavigate();
    const sickLeaveDayInUpdate = sickLeaveDays.entities.find(v => v.id === id);
    const loadingUpdate = useAppSelector(s => s.sickLeave.loadingUpdate)
    const loadingGet = useAppSelector(s => s.sickLeave.loadingGet)
    const loadingGetById = useAppSelector(s => s.sickLeave.loadingGetById)
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [uploadFiles, setUploadFiles] = useState<File[]>([])
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

    useEffect(() => {
        if (!sickLeaveDayInUpdate) {
            dispatch(sickLeaveActions.getByIdAsync({ id }))
        }
    }, [])

    useEffect(() => {
        if (sickLeaveDayInUpdate) {
            setUploadedFiles(sickLeaveDayInUpdate.files);
        }
    }, [sickLeaveDayInUpdate])

    const onFinish = async () => {
        if (!sickLeaveDayInUpdate) {
            message.error('No sick leave in update')
            return;
        }
        dispatch(sickLeaveActions.uploadFilesAsync({
            id: sickLeaveDayInUpdate.id,
            uploadedFiles: uploadedFiles,
            uploadFiles: uploadFiles,
        }))
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) {
            message.error('Select files')
            return;
        }
        setUploadFiles(Array.from(e.target?.files));
    };

    const columnsUploadedFiles: ColumnsType<string> = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (_, file) => <a href={file} target={'_blank'}>{file.split('/').pop()}</a>
        },
        {
            dataIndex: 'actions',
            width: '50px',
            render: (_, file) =>
                <Popconfirm title="Sure to remove?"
                    onConfirm={() => setUploadedFiles(uploadedFiles.filter(f => f !== file))}>
                    <Button
                        icon={<DeleteOutlined />}
                        shape={'circle'}
                        danger
                        size={'small'}
                    />
                </Popconfirm>
        },
    ];

    const columns: ColumnsType<File> = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (_, file) => <div>{file.name}</div>
        },
        {
            dataIndex: 'actions',
            width: '50px',
            render: (_, file) =>
                <Popconfirm
                    title="Sure to remove?"
                    onConfirm={() => setUploadFiles(uploadFiles.filter(f => f !== file))}
                >
                    <Button
                        icon={<DeleteOutlined />}
                        shape={'circle'}
                        danger
                        size={'small'}
                    />
                </Popconfirm>
        },
    ];

    const initialValues: FromValues = {
        id: sickLeaveDayInUpdate?.id || '',
        user: `${sickLeaveDayInUpdate?.user.firstName} ${sickLeaveDayInUpdate?.user.lastName}`,
        startAndEnd: [moment(sickLeaveDayInUpdate?.startDate), moment(sickLeaveDayInUpdate?.endDate)],
        comment: sickLeaveDayInUpdate?.comment,
    }

    return (
        <Modal
            title={<Title level={4}>Upload files for sick leave</Title>}
            confirmLoading={loadingUpdate}
            visible={true}
            onOk={() => form.submit()}
            okText={'Update'}
            onCancel={() => navigate(-1)}
        >
            {
                loadingGet || loadingGetById || !sickLeaveDayInUpdate
                    ? <Loading />
                    : <Form
                        name="SickLeaveUploadFilesForm"
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
                            name={nameof<FromValues>('startAndEnd')}
                            label={'Start and end'}
                            rules={[{ required: true, message: 'Date start and date end is required' }]}
                        >
                            <RangePicker disabled={true} />
                        </Form.Item>
                        <Form.Item
                            name={nameof<FromValues>('comment')}
                            label={'Comment'}
                        >
                            <Input placeholder={'Comment'} disabled={true} />
                        </Form.Item>
                        <Form.Item
                            name={nameof<FromValues>('user')}
                            label={'User'}
                        >
                            <Input placeholder={'User'} disabled={true} />
                        </Form.Item>
                        <Table
                            title={() => <div>Uploaded files</div>}
                            bordered
                            dataSource={uploadedFiles as any}
                            columns={columnsUploadedFiles as any}
                            pagination={false}
                        />
                        <Table
                            title={() =>
                                <Row justify={'space-between'}>
                                    <div>Upload files</div>
                                    <div>
                                        <Button
                                            shape="circle"
                                            type="primary"
                                            icon={<UploadOutlined />}
                                            size={'small'}
                                            onClick={() => inputFileRef.current?.click()}
                                        />
                                        <input
                                            type="file"
                                            multiple
                                            ref={inputFileRef}
                                            onChange={handleChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </Row>
                            }
                            bordered
                            dataSource={uploadFiles}
                            columns={columns}
                            pagination={false}
                        />
                    </Form>
            }
        </Modal>
    );
};