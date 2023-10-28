import React, { FC } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../behaviour/store";
import { Form, Input, message, Modal } from "antd";
import Title from "antd/lib/typography/Title";
import { formStyles } from "../../../../assets/form";
import { nameof } from "../../../../utils/stringUtils";
import { useForm } from "antd/es/form/Form";
import { FileManagerItem } from "../../graphQL/fileManager.types";
import { fileManagerActions } from "../../store/fileManager.slice";

type FormValues = {
    toName: string,
}

type Props = {
    selectedItem: FileManagerItem | null,
}

export const FileManagerRenameFile: FC<Props> = ({ selectedItem }) => {
    const dispatch = useDispatch();
    const loadingRenameFile = useSelector((s: RootState) => s.fileManager.loadingRenameFile);
    const isRenameFilePageVisible = useSelector((s: RootState) => s.fileManager.isRenameFilePageVisible);
    const folderPath = useSelector((s: RootState) => s.fileManager.folderPath);
    const [form] = useForm<FormValues>();

    const onFinish = async () => {
        try {
            if (!selectedItem) {
                message.error('No selected item');
                return
            }
            await form.validateFields();
            const toName = form.getFieldValue(nameof<FormValues>('toName'));
            dispatch(fileManagerActions.renameFileAsync({ fromPath: selectedItem.path, toName }))
        } catch (e) {
            console.log(e);
        }
    }

    const initialValues: FormValues = {
        toName: selectedItem?.name || ''
    }

    return (
        <Modal
            title={<Title level={4}>Rename file</Title>}
            confirmLoading={loadingRenameFile}
            visible={isRenameFilePageVisible}
            onOk={onFinish}
            okText={'Rename'}
            onCancel={() => dispatch(fileManagerActions.setIsRenameFilePageVisible(false))}
        >
            <Form
                form={form}
                name="FileManagerRenameFileForm"
                onFinish={onFinish}
                labelCol={formStyles}
                initialValues={initialValues}
            >
                <Form.Item
                    label="To name"
                    name={nameof<FormValues>('toName')}
                    rules={[{
                        required: true,
                        message: 'To name is required'
                    }]}
                >
                    <Input placeholder={'To name'} />
                </Form.Item>
            </Form>
        </Modal>
    );
};