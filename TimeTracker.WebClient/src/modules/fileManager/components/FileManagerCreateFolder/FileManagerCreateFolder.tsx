import React, { FC } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../behaviour/store";
import { Form, Modal } from "antd";
import { formStyles } from "../../../../assets/form";
import { nameof } from "../../../../utils/stringUtils";
import Input from "antd/es/input/Input";
import { useForm } from "antd/es/form/Form";
import Title from "antd/lib/typography/Title";
import { fileManagerActions } from "../../store/fileManager.slice";

type FormValues = {
    newFolderName: string,
};

export const FileManagerCreateFolder: FC = () => {
    const dispatch = useDispatch();
    const [form] = useForm<FormValues>()
    const loadingCreateFolder = useSelector((s: RootState) => s.fileManager.loadingCreateFolder);
    const isCreateFolderPageVisible = useSelector((s: RootState) => s.fileManager.isCreateFolderPageVisible);
    const folderPath = useSelector((s: RootState) => s.fileManager.folderPath);

    const onFinish = (values: FormValues) => {
        dispatch(fileManagerActions.createFolderAsync({ folderPath, newFolderName: values.newFolderName }))
    }

    const initialValues: FormValues = {
        newFolderName: '',
    }

    return (
        <Modal
            title={<Title level={4}>Create new folder</Title>}
            confirmLoading={loadingCreateFolder}
            visible={isCreateFolderPageVisible}
            onOk={() => form.submit()}
            okText={'Create'}
            onCancel={() => dispatch(fileManagerActions.setIsCreateFolderPageVisible(false))}
        >
            <Form
                name="CalendarDaysCreateForm"
                form={form}
                onFinish={onFinish}
                initialValues={initialValues}
                labelCol={formStyles}
            >
                <Form.Item
                    name={nameof<FormValues>('newFolderName')}
                    label={'New folder name'}
                >
                    <Input placeholder={'New folder name'} />
                </Form.Item>
            </Form>
        </Modal>
    );
};