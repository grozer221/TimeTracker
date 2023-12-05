import React, { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../../../../behaviour/store";
import { vacationRequestsActions } from "../../store/vacationRequests.slice";
import { Button, Popconfirm, Row, Select, Space, Table, Tabs, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { VacationRequest } from "../../graphQL/vacationRequests.types";
import { nameof, uppercaseToWords } from "../../../../utils/stringUtils";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { vacationRequestStatusToTag } from "../../../../convertors/enumToTagConvertors";
import { ButtonUpdate } from "../../../../components/ButtonUpdate";
import { ButtonCreate } from "../../../../components/ButtonCreate";
import { DeleteOutlined, ReloadOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import { WithSmallLoading } from "../../../../hocs/WithSmallLoading/WithSmallLoading";
import { usersActions } from "../../../users/store/users.slice";
import { VacationRequestsFilterKind } from "../../graphQL/vacationRequests.queries";
import { isAdministratorOrHavePermissions } from "../../../../utils/permissions";
import { VacationRequestStatus } from '../../../../behaviour/enums/VacationRequestStatus';
import { Permission } from '../../../../behaviour/enums/Permission';

const { Text } = Typography;
const { TabPane } = Tabs;

export const VacationRequestsIndexPage: FC = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const authedUser = useAppSelector(s => s.auth.authedUser)
    const settings = useAppSelector(s => s.settings.settings)
    const usersInfinityLoad = useAppSelector(s => s.users.usersInfinityLoad)
    const vacationRequestsGetInputType = useAppSelector(s => s.vacationRequests.vacationRequestsGetInputType)
    const vacationRequests = useAppSelector(s => s.vacationRequests.vacationRequests)
    const loadingGet = useAppSelector(s => s.vacationRequests.loadingGet)
    const availableDays = useAppSelector(s => s.vacationRequests.availableDays)
    const loadingGetAvailableDays = useAppSelector(s => s.vacationRequests.loadingGetAvailableDays)
    const [searchParams, setSearchParams] = useSearchParams();
    const pageNumber = parseInt(searchParams.get('pageNumber') || '') || vacationRequestsGetInputType.pageNumber;
    const pageSize = parseInt((searchParams.get('pageSize')) || '') || vacationRequestsGetInputType.pageSize;
    const statuses = searchParams.get('statuses')?.split('|').filter(s => Object.values(VacationRequestStatus).includes(s as VacationRequestStatus)) as VacationRequestStatus[] || vacationRequestsGetInputType.filter.statuses;
    const userIds = searchParams.get('userIds')?.split('|').filter(Boolean) as string[] || vacationRequestsGetInputType.filter.userIds;
    const kind = searchParams.get('kind') as VacationRequestsFilterKind || vacationRequestsGetInputType.filter.kind;

    useEffect(() => {
        dispatch(vacationRequestsActions.getAvailableDaysAsync())

        if (!usersInfinityLoad?.entities.length)
            dispatch(usersActions.fetchUsersInfinityLoad({
                take: 100,
                skip: 0,
                filter: { email: '', roles: [], permissions: [] }
            }))

        return () => {
            dispatch(vacationRequestsActions.clear())
        }
    }, [])

    useEffect(() => {
        dispatch(vacationRequestsActions.getAsync({
            pageNumber,
            pageSize,
            filter: {
                statuses,
                userIds,
                kind,
            }
        }))
    }, [searchParams])

    const setParams = (pageNumber: number, pageSize: number, statuses: VacationRequestStatus[], userIds: string[], kind: VacationRequestsFilterKind) => {
        setSearchParams({
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
            statuses: statuses?.join('|') || '',
            userIds: userIds?.join('|') || '',
            kind: kind,
        })
    }

    const columns: ColumnsType<VacationRequest> = [
        {
            title: 'Status',
            dataIndex: nameof<VacationRequest>('status'),
            key: nameof<VacationRequest>('status'),
            render: (_, vacationRequest) => <span>{vacationRequestStatusToTag(vacationRequest.status)}</span>,
            filters: (Object.values(VacationRequestStatus) as Array<VacationRequestStatus>).map((value) => ({
                value: value,
                text: uppercaseToWords(value),
            })),
            defaultFilteredValue: statuses,
            width: '20%',
        },
        {
            title: 'Start - End',
            dataIndex: 'start-end',
            key: 'start-end',
            render: (_, vacationRequest) =>
                <Space>
                    <Tag>{vacationRequest.dateStart}</Tag>
                    <Text type={'secondary'}>to</Text>
                    <Tag>{vacationRequest.dateEnd}</Tag>
                </Space>,
            width: '20%',
        },
        {
            title: 'Comment',
            dataIndex: nameof<VacationRequest>('comment'),
            key: nameof<VacationRequest>('comment'),
            width: '20%',
        },
        {
            title: <Select
                style={{ width: '100%' }}
                mode="multiple"
                placeholder="User"
                defaultValue={userIds}
                onChange={userIds => setParams(pageNumber, pageSize, statuses, userIds, kind)}
                filterOption={_ => true}
                onSearch={value => dispatch(usersActions.fetchUsersInfinityLoad({
                    take: 10,
                    skip: 0,
                    filter: { email: value, roles: [], permissions: [] }
                }))}
                maxTagCount={'responsive'}
            >
                {usersInfinityLoad?.entities.map(user => (
                    <Select.Option key={user.id}>
                        <Text>{user.lastName} {user.firstName} </Text>
                        <Text type={'secondary'}>{user.email}</Text>
                    </Select.Option>
                ))}
            </Select>,
            dataIndex: nameof<VacationRequest>('user'),
            key: nameof<VacationRequest>('user'),
            render: (_, vacationRequest) =>
                <Link to={`/users/${vacationRequest.user.email}`}>
                    {vacationRequest.user.firstName} {vacationRequest.user.lastName}
                </Link>,
            width: '30%',
        },
        {
            title: 'Actions',
            dataIndex: 'Actions',
            key: 'Actions',
            render: (_, vacationRequest) => {
                return (
                    <Space size={5}>
                        {(isAdministratorOrHavePermissions([Permission.NoteTheAbsenceAndVacation])
                            || vacationRequest.user.usersWhichCanApproveVacationRequest.some(u => u.id === authedUser?.id)
                        ) && <ButtonUpdate to={`update/${vacationRequest.id}`} popup={location} />
                        }
                        {(isAdministratorOrHavePermissions([Permission.NoteTheAbsenceAndVacation])
                            || (vacationRequest.status === VacationRequestStatus.New
                                && (vacationRequest.userId === authedUser?.id || vacationRequest.user.usersWhichCanApproveVacationRequest.some(u => u.id === authedUser?.id)))
                        ) && <Popconfirm
                            title={'Sure to remove?'}
                            onConfirm={() => dispatch(vacationRequestsActions.removeAsync({ id: vacationRequest.id }))}
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
            <Row align={'middle'} justify={'space-between'}>
                <ButtonCreate to={'create'} popup={location} />
                <WithSmallLoading loading={loadingGetAvailableDays}>
                    <Space>
                        <ReloadOutlined onClick={() => dispatch(vacationRequestsActions.getAvailableDaysAsync())} />
                        <div>Available days: {availableDays} / {settings?.vacationRequests.amountDaysPerYear}</div>
                    </Space>
                </WithSmallLoading>
            </Row>
            <Tabs defaultActiveKey={kind}
                onChange={kind => setParams(pageNumber, pageSize, statuses, userIds, kind as VacationRequestsFilterKind)}>
                <TabPane tab={<span><UserOutlined />Mine</span>} key={VacationRequestsFilterKind.Mine} />
                <TabPane tab={<span><UsergroupAddOutlined />Can approve</span>}
                    key={VacationRequestsFilterKind.CanApprove} />
                {isAdministratorOrHavePermissions([Permission.NoteTheAbsenceAndVacation]) &&
                    <TabPane tab={<span><UsergroupAddOutlined />All</span>} key={VacationRequestsFilterKind.All} />
                }
            </Tabs>
            <Table
                rowKey={'id'}
                loading={loadingGet}
                columns={columns}
                dataSource={vacationRequests.entities}
                pagination={{
                    total: vacationRequests.total,
                    pageSize: pageSize,
                    defaultPageSize: pageSize,
                    defaultCurrent: pageNumber,
                    showSizeChanger: true,
                }}
                onChange={(pagination, filters, sorter) => {
                    console.log(pagination, filters, sorter);
                    const pageNumber: number = pagination.current || vacationRequestsGetInputType.pageNumber;
                    const pageSize: number = pagination.pageSize || vacationRequestsGetInputType.pageSize;
                    const statuses = filters.status as VacationRequestStatus[];
                    setParams(pageNumber, pageSize, statuses, userIds, kind)
                }}
            />
        </div>
    );
};