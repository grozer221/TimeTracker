import { Button, Popconfirm, Space, Table, Tabs, Tag, Typography } from "antd";
import React, { FC, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../behaviour/store";
import { ColumnsType } from "antd/es/table";
import { nameof } from "../../../utils/stringUtils";
import { isAdministratorOrHavePermissions } from "../../../utils/permissions";
import { Permission } from "../../../behaviour/enums/Permission";
import { ButtonUpdate } from "../../../components/ButtonUpdate";
import { DeleteOutlined, EditOutlined, UploadOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import { sickLeaveActions } from "../store/sickLeave.slice";
import { SickLeaveFilterKind, SickLeaveType } from "../sickLeaveType";
import { ButtonCreate } from "../../../components/ButtonCreate";

const { Text } = Typography;
const { TabPane } = Tabs;

export const SickLeaveIndexPage: FC = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const sickLeaveGetInputType = useAppSelector(s => s.sickLeave.sickLeaveGetInputType)
    const sickLeaveDays = useAppSelector(s => s.sickLeave.sickLeaveDays)
    const [searchParams, setSearchParams] = useSearchParams();
    const pageNumber = parseInt(searchParams.get('pageNumber') || '') || sickLeaveGetInputType.pageNumber;
    const pageSize = parseInt((searchParams.get('pageSize')) || '') || sickLeaveGetInputType.pageSize;
    const kind = searchParams.get('kind') as SickLeaveFilterKind || sickLeaveGetInputType.filter.kind;
    const loadingGet = useAppSelector(s => s.sickLeave.loadingGet)
    const loadingRemove = useAppSelector(s => s.sickLeave.loadingRemove)

    useEffect(() => {
        dispatch(sickLeaveActions.getAsync({
            pageNumber,
            pageSize,
            filter: { kind }
        }))
    }, [searchParams])

    const setParams = (pageNumber: number, pageSize: number, kind: string) => {
        setSearchParams({
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
            kind: kind,
        })
    }

    const columns: ColumnsType<SickLeaveType> = [
        {
            title: 'Start - End',
            dataIndex: 'start-end',
            key: 'start-end',
            render: (_, sickLeaveDays) =>
                <Space>
                    <Tag>{sickLeaveDays.startDate}</Tag>
                    <Text type={'secondary'}>to</Text>
                    <Tag>{sickLeaveDays.endDate}</Tag>
                </Space>,
            width: '20%',
        },
        {
            title: 'Comment',
            dataIndex: nameof<SickLeaveType>('comment'),
            key: nameof<SickLeaveType>('comment'),
            width: '20%',
        },
        {
            title: "User",
            dataIndex: nameof<SickLeaveType>('user'),
            key: nameof<SickLeaveType>('user'),
            render: (_, sickLeaveDays) =>
                <Link to={`/users/profile/${sickLeaveDays.user.email}`}>
                    {sickLeaveDays.user.firstName} {sickLeaveDays.user.lastName}
                </Link>,
            width: '20%',
        },
        {
            title: "Files",
            dataIndex: nameof<SickLeaveType>('files'),
            key: nameof<SickLeaveType>('files'),
            render: (_, sickLeaveDays) =>
                sickLeaveDays.files.map(file => (
                    <div style={{
                        maxWidth: '400px',
                        overflow: 'hidden',
                        textOverflow: "ellipsis",
                        whiteSpace: 'nowrap',
                    }}>
                        <a href={file} target={'_blank'}>{file.split('/').pop()}</a>
                    </div>
                )),
            width: '30%',
        },
        {
            title: 'Actions',
            dataIndex: 'Actions',
            key: 'Actions',
            render: (_, sickLeaveDays) => {
                return (
                    <Space size={5}>
                        {(isAdministratorOrHavePermissions([Permission.NoteTheAbsenceAndVacation])
                        ) && <ButtonUpdate to={`update/${sickLeaveDays.id}`} popup={location} />
                        }
                        <Link to={`upload-files/${sickLeaveDays.id}`} state={{ popup: location }}>
                            <Button shape="circle" type="primary" icon={<UploadOutlined />} size={'small'} />
                        </Link>
                        {(isAdministratorOrHavePermissions([Permission.NoteTheAbsenceAndVacation])
                        ) && <Popconfirm
                            title={'Sure to remove?'}
                            onConfirm={() => dispatch(sickLeaveActions.removeAsync({ id: sickLeaveDays.id }))}
                            okText="Yes"
                            cancelText="No"
                        >
                                <Button shape="circle" type="primary" danger icon={<DeleteOutlined />} size={'small'} />
                            </Popconfirm>
                        }
                    </Space>
                )
            },
            width: '10%',
        },
    ];

    return (
        <div>
            {(isAdministratorOrHavePermissions([Permission.NoteTheAbsenceAndVacation])
            ) && <ButtonCreate to={'create'} popup={location} />
            }
            <Tabs defaultActiveKey={kind}
                onChange={kind => setParams(pageNumber, pageSize, kind)}>
                <TabPane tab={<span><UserOutlined />Mine</span>} key={SickLeaveFilterKind.mine} />
                {isAdministratorOrHavePermissions([Permission.NoteTheAbsenceAndVacation]) &&
                    <TabPane tab={<span><UsergroupAddOutlined />All</span>} key={SickLeaveFilterKind.all} />
                }
            </Tabs>
            <Table
                rowKey={'id'}
                loading={loadingGet || loadingRemove}
                columns={columns}
                dataSource={sickLeaveDays.entities}
                pagination={{
                    total: sickLeaveDays.total,
                    pageSize: pageSize,
                    defaultPageSize: pageSize,
                    defaultCurrent: pageNumber,
                    showSizeChanger: true,
                }}
                onChange={(pagination, filters, sorter) => {
                    console.log(pagination, filters, sorter);
                    const pageNumber: number = pagination.current || sickLeaveGetInputType.pageNumber;
                    const pageSize: number = pagination.pageSize || sickLeaveGetInputType.pageSize;
                    setParams(pageNumber, pageSize, kind)
                }}
            />
        </div>
    );
};