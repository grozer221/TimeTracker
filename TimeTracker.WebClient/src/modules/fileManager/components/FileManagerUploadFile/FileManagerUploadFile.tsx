import React, { ChangeEvent, FC, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../behaviour/store";
import { Button, Form, FormInstance, Input, InputRef, message, Modal, Popconfirm, Table } from "antd";
import Title from "antd/lib/typography/Title";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import s from './FileManagerUploadFile.module.css';
import { fileManagerActions } from "../../store/fileManager.slice";

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;
type FileType = {
    key: React.Key,
    file: File,
    fileName: string,
}

export const FileManagerUploadFile: FC = () => {
    const dispatch = useDispatch();
    const loadingUploadFiles = useSelector((s: RootState) => s.fileManager.loadingUploadFiles);
    const [files, setFiles] = useState<FileType[]>([])
    const hiddenFileInput = React.useRef<HTMLInputElement | null>(null);
    const isUploadFilesPageVisible = useSelector((s: RootState) => s.fileManager.isUploadFilesPageVisible);
    const folderPath = useSelector((s: RootState) => s.fileManager.folderPath);

    const handleDelete = (key: React.Key) => {
        const newData = files.filter(item => item.key !== key);
        setFiles(newData);
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: 'fileName',
            dataIndex: 'fileName',
            editable: true,
        },
        {
            dataIndex: 'actions',
            width: '50px',
            render: (_, record: any) =>
                <Popconfirm title="Sure to remove?" onConfirm={() => handleDelete(record.key)}>
                    <Button
                        icon={<DeleteOutlined />}
                        shape={'circle'}
                        danger
                        size={'small'}
                    />
                </Popconfirm>
        },
    ];

    const handleSave = (row: FileType) => {
        const newData = [...files];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setFiles(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: FileType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });


    const onFinish = () => {
        const uploadFiles = files.map(f => {
            Object.defineProperty(f.file, 'name', {
                writable: true,
                value: f.fileName
            });
            return f.file
        })
        if (!uploadFiles.length) {
            message.error('Choose a files')
            return;
        }
        dispatch(fileManagerActions.uploadFilesAsync({ folderPath, files: uploadFiles }))
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) {
            message.error('Select files')
            return;
        }
        setFiles(Array.from(e.target.files).map(f => ({
            key: JSON.stringify(f),
            file: f,
            fileName: f.name,
        })));
    };

    return (
        <Modal
            title={<Title level={4}>Upload files</Title>}
            confirmLoading={loadingUploadFiles}
            visible={isUploadFilesPageVisible}
            onOk={onFinish}
            okText={'Create'}
            onCancel={() => dispatch(fileManagerActions.setIsUploadFilesPageVisible(false))}
        >
            <Table
                className={s.table}
                title={() =>
                    <>
                        <Button
                            type={'primary'}
                            icon={<UploadOutlined />}
                            onClick={() => hiddenFileInput.current?.click()}
                        />
                        <input
                            type="file"
                            multiple
                            ref={hiddenFileInput}
                            onChange={handleChange}
                            style={{ display: 'none' }}
                        />
                    </>
                }
                components={components}
                rowClassName={() => s.editableRow}
                bordered
                dataSource={files}
                columns={columns as ColumnTypes}
                pagination={false}
            />
        </Modal>
    );
};

const EditableContext = React.createContext<FormInstance | null>(null);

interface Item {
    key: string;
    name: string;
    age: string;
    address: string;
}

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div className={s.editableCellValueWrap} style={{ paddingRight: 24 }} onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};