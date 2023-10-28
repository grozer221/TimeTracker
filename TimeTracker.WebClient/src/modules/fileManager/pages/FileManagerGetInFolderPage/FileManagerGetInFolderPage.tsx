import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../behaviour/store";
import { FileManagerItem, FileManagerItemKind, FileManagerItemPermissions } from "../../graphQL/fileManager.types";
import {
    CloudDownloadOutlined,
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    FileAddOutlined,
    FileOutlined,
    FolderAddOutlined,
    FolderOpenFilled,
    ReloadOutlined,
    RollbackOutlined
} from "@ant-design/icons";
import s from './FileManagerGetInFolderPage.module.css';
import { Breadcrumb, Button, Popconfirm, Space, Tooltip } from "antd";
import { Loading } from "../../../../components/Loading/Loading";
import { capitalize, uppercaseToWords } from "../../../../utils/stringUtils";
import { FileManagerCreateFolder } from "../../components/FileManagerCreateFolder/FileManagerCreateFolder";
import { FileManagerUploadFile } from "../../components/FileManagerUploadFile/FileManagerUploadFile";
import { FileManagerRenameFile } from "../../components/FileManagerRenameFile/FileManagerRenameFile";
import { fileManagerActions } from '../../store/fileManager.slice';

type Props = {
    onSelectFile?: (item: FileManagerItem) => void
};

export const FileManagerGetInFolderPage: FC<Props> = ({ onSelectFile }) => {
    const dispatch = useDispatch();
    const items = useSelector((s: RootState) => s.fileManager.items);
    const loadingGetInFolder = useSelector((s: RootState) => s.fileManager.loadingGetInFolder);
    const loadingCreateFolder = useSelector((s: RootState) => s.fileManager.loadingCreateFolder);
    const loadingUploadFiles = useSelector((s: RootState) => s.fileManager.loadingUploadFiles);
    const loadingRemove = useSelector((s: RootState) => s.fileManager.loadingRemove);
    const [selectedItem, setSelectedItem] = useState<FileManagerItem | null>(null)
    const folderPath = useSelector((s: RootState) => s.fileManager.folderPath);
    const isCreateFolderPageVisible = useSelector((s: RootState) => s.fileManager.isCreateFolderPageVisible);
    const isUploadFilesPageVisible = useSelector((s: RootState) => s.fileManager.isUploadFilesPageVisible);
    const isRenameFilePageVisible = useSelector((s: RootState) => s.fileManager.isRenameFilePageVisible);

    useEffect(() => {
        getInFolder();
    }, [folderPath])

    const getInFolder = () => {
        setSelectedItem(null);
        dispatch(fileManagerActions.getInFolderAsync(folderPath))
    }

    const onDoubleClick = (item: FileManagerItem): void => {
        console.log(item)
        switch (item.kind) {
            case FileManagerItemKind.File:
                onSelectFile && onSelectFile(item);
                break;
            case FileManagerItemKind.Folder:
                setSelectedItem(null);
                setFolderPath(item.path)
                break;
        }
    }

    const setFolderPath = (folderPath: string) => {
        dispatch(fileManagerActions.setFolderPath(folderPath))
    }

    const onStepBack = () => {
        const regex = new RegExp(/\/(\w+)?$/);
        let newFolderPath: string;
        if (folderPath.match(regex))
            newFolderPath = folderPath.replace(regex, '');
        else
            newFolderPath = ''
        setSelectedItem(null);
        setFolderPath(newFolderPath)
    }

    return (
        <Space direction={'vertical'} className={s.wrapperPage}>
            {isCreateFolderPageVisible && <FileManagerCreateFolder />}
            {isUploadFilesPageVisible && <FileManagerUploadFile />}
            {isRenameFilePageVisible && <FileManagerRenameFile selectedItem={selectedItem} />}
            <Space size={20}>
                <Space>
                    <Tooltip title="Step back">
                        <Button
                            type={'primary'}
                            icon={<RollbackOutlined />}
                            size={'small'}
                            onClick={onStepBack}
                            disabled={!folderPath || loadingGetInFolder}
                        />
                    </Tooltip>
                    <Tooltip title="Reload">
                        <Button
                            icon={<ReloadOutlined />} size={'small'}
                            onClick={getInFolder}
                            disabled={loadingGetInFolder}
                        />
                    </Tooltip>
                </Space>
                <Space>
                    <Tooltip title="Create folder">
                        <Button
                            icon={<FolderAddOutlined />}
                            size={'small'}
                            onClick={() => dispatch(fileManagerActions.setIsCreateFolderPageVisible(true))}
                            disabled={loadingCreateFolder}
                        />
                    </Tooltip>
                    <Tooltip title="Upload files">
                        <Button
                            icon={<FileAddOutlined />}
                            size={'small'}
                            onClick={() => dispatch(fileManagerActions.setIsUploadFilesPageVisible(true))}
                            disabled={loadingUploadFiles}
                        />
                    </Tooltip>
                    <Tooltip title="Download">
                        <a href={selectedItem?.path} target={'_blank'}>
                            <Button
                                icon={<CloudDownloadOutlined />}
                                size={'small'}
                                disabled={!(selectedItem?.kind === FileManagerItemKind.File)}
                            />
                        </a>
                    </Tooltip>
                    <Tooltip title="Copy to clipboard">
                        <Button
                            icon={<CopyOutlined />}
                            size={'small'}
                            disabled={!(selectedItem?.kind === FileManagerItemKind.File)}
                            onClick={() => navigator.clipboard.writeText(selectedItem?.path || '')}
                        />
                    </Tooltip>
                </Space>
                <Space>
                    <Tooltip title="Rename">
                        <Button
                            icon={<EditOutlined />}
                            size={'small'}
                            disabled={!(selectedItem?.kind === FileManagerItemKind.File) || selectedItem?.permissions === FileManagerItemPermissions.Read}
                            onClick={() => dispatch(fileManagerActions.setIsRenameFilePageVisible(true))}
                        />
                    </Tooltip>
                    <Tooltip title="Remove">
                        <Popconfirm
                            title="Are you sure to remove?"
                            okText="Yes"
                            onConfirm={() => selectedItem && dispatch(fileManagerActions.removeAsync({
                                path: selectedItem.path,
                                kind: selectedItem.kind
                            }))}
                            cancelText="No"
                            disabled={!selectedItem || selectedItem?.permissions === FileManagerItemPermissions.Read}
                        >
                            <Button
                                loading={loadingRemove}
                                danger
                                icon={<DeleteOutlined />}
                                size={'small'}
                                disabled={!selectedItem || selectedItem?.permissions === FileManagerItemPermissions.Read}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            </Space>
            <table className={[s.tableFileManager, loadingGetInFolder ? s.loading : ''].join(' ')}>
                <thead>
                    <tr className={s.theader}>
                        <th colSpan={2}>Name</th>
                        <th>Permissions</th>
                        <th>Created at</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.path}
                            onDoubleClick={(e) => onDoubleClick(item)}
                            onClick={() => setSelectedItem(item)}
                            className={item === selectedItem ? s.selected : ''}
                        >
                            <td>{item.kind === FileManagerItemKind.File ? <FileOutlined /> : <FolderOpenFilled />}</td>
                            <td>{item.name}</td>
                            <td>{uppercaseToWords(item.permissions)}</td>
                            <td>{item.createdAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Breadcrumb separator=">">
                <Breadcrumb.Item onClick={() => setFolderPath('')}>Root</Breadcrumb.Item>
                {folderPath.split('/').map((module, i) => {
                    const path = folderPath.split('/').slice(0, i + 1).join('/');
                    return (
                        <Breadcrumb.Item key={module} onClick={() => setFolderPath(path)}>
                            {capitalize(module)}
                        </Breadcrumb.Item>
                    )
                })}
            </Breadcrumb>
            {loadingGetInFolder &&
                <div className={'absoluteCenter'}>
                    <Loading />
                </div>
            }
        </Space>
    );
};