import React, { useEffect } from 'react';
import {
    isAdministrator,
    isAdministratorOrHavePermissions,
    isAuthenticated,
    isHavePermission
} from "../../../../utils/permissions";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../behaviour/store";
import { Link, useLocation } from "react-router-dom";
import { Role } from "../../../../behaviour/enums/Role";
import { Permission } from "../../../../behaviour/enums/Permission";
import { User } from "../../graphQL/users.types";
import { Button, Col, Divider, Dropdown, Menu, Row, Space, Table, TableProps, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { DownCircleFilled, UserAddOutlined } from '@ant-design/icons';
import { uppercaseToWords } from "../../../../utils/stringUtils";
import { usersActions } from "../../store/users.slice";
import { ExcelExportButton } from "../../../../components/ExcelExportButton";
import { getColumnSearchProps } from "../../components/parrtial/ColumnSerach";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import { navigateActions } from "../../../navigate/store/navigate.slice";
import moment from "moment/moment";
import { Employment } from '../../../../behaviour/enums/Employment';

export const UsersPage = React.memo(() => {
    const isAuth = useAppSelector(s => s.auth.isAuth)
    const dispatch = useDispatch()
    const location = useLocation()

    let totalPages = useAppSelector(s => s.users.total)
    let pageSize = useAppSelector(s => s.users.pageSize)
    let users = useAppSelector(s => s.users.users)
    let filter = useAppSelector(s => s.users.filter)
    let currentPage = useAppSelector(s => s.users.currentPage)
    let loadingUsers = useAppSelector(s => s.users.loadingUsers)
    let authedUser = useAppSelector(s => s.auth.authedUser)

    useEffect(() => {
        if (!isAuthenticated())
            navigateActions.navigate("/auth/login")
    }, [isAuth])

    useEffect(() => {
        dispatch(usersActions.getAsync({
            take: pageSize,
            skip: currentPage,
        }));
    }, [filter])

    useEffect(() => {
        return () => {
            dispatch(usersActions.clearUsersPage())
        }
    }, [])

    // handle functions for filter dropdowns
    const handleChange: TableProps<User>['onChange'] = (pagination, filters, sorter) => {
        dispatch(usersActions.setFilter(
            {
                ...filter,
                ["roles"]: filters["role"] as Role[] ?? [],
                ["permissions"]: filters["permissions"] as Permission[] ?? [],
                ["employments"]: filters["employment"] as Employment[] ?? []
            }
        ))
    };

    //menu on every user row
    const menu = (userEmail: string, userId: string) => {
        let items: ItemType[] = []

        items.push({ key: 'profile', label: <Link to={"profile/" + userEmail}>Profile</Link> })

        if (isAdministratorOrHavePermissions([Permission.UpdateUsers])) {
            if (userId !== authedUser!.id) {
                items.push(
                    { key: 'update', label: (<Link to={"update/" + userEmail} state={{ popup: location }}>Update</Link>) },
                    { key: 'remove', label: (<Link to={"remove/" + userEmail} state={{ popup: location }}>Remove</Link>) })
            }
            items.push({
                key: 'reset-password',
                label: (<Link to={"reset-password/" + userId} state={{ popup: location }}>Reset password</Link>)
            })
        }


        return <Menu items={items} />
    }

    // columns structure for table
    const columns: ColumnsType<User> = [
        {
            title: 'FirstName', dataIndex: 'firstName', key: 'firstName',
            ...getColumnSearchProps('firstName'),
        },
        {
            title: 'LastName', dataIndex: 'lastName', key: 'lastName',
            ...getColumnSearchProps('lastName'),
        },
        {
            title: 'MiddleName', dataIndex: 'middleName', key: 'middleName',
            ...getColumnSearchProps('middleName'),
        },
        {
            title: 'Email', dataIndex: 'email', key: 'email',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Role', dataIndex: 'role', key: 'role',
            filters: Object.values(Role).map(value => {
                return { text: uppercaseToWords(value), value: value }
            }),
            render: (role, user) => {
                return <Tag key={role}
                    color={role === Role.Admin ? 'gold' : 'geekblue'}>
                    {uppercaseToWords(role)}
                </Tag>
            }
        },
        {
            title: 'Permissions', dataIndex: 'permissions', key: 'permissions',
            filters: Object.values(Permission).map(value => {
                return { text: uppercaseToWords(value), value: value }
            }),
            render: (permissions: Permission[], user) => {
                return user.permissions.map(p => <Tag key={p} color={'blue'}>{uppercaseToWords(p)}</Tag>)
            }
        },
        {
            title: 'Employments', dataIndex: 'employment', key: 'employment',
            filterMultiple: false,
            filters: Object.values(Employment).map(value => {
                return { text: uppercaseToWords(value), value: value }
            }),
            render: (employment: Employment, user) => (
                <Tag key={employment} color={employment === Employment.FullTime ? 'green' : 'yellow'}>
                    {uppercaseToWords(employment)}
                </Tag>
            )
        },
        {
            title: 'CreatedAt', dataIndex: 'createdAt', key: 'createdAt',
            render: (text, record, index) => (moment(text).format('YYYY/MM/DD HH:mm:ss'))
        },
        {
            title: 'UpdatedAt', dataIndex: 'updatedAt', key: 'updatedAt',
            render: (text, record, index) => (moment(text).format('YYYY/MM/DD HH:mm:ss'))
        },
        {
            title: 'Action', dataIndex: 'operation', key: 'operation',
            render: (text, record, index) => (
                <Space size="middle" wrap style={{ cursor: 'pointer' }}>
                    <Dropdown overlay={menu(record.email, record.id)}>
                        <DownCircleFilled />
                    </Dropdown>
                </Space>
            ),
        }];

    return <>
        {(isAdministrator() || isHavePermission([Permission.ExportUsersToExcel]) || isHavePermission([Permission.UpdateUsers])) &&
            <>
                <Row justify="space-between" align={'middle'}>
                    <Col>
                        {isAdministratorOrHavePermissions([Permission.UpdateUsers]) &&
                            <Link to={"create"} state={{ popup: location }}>
                                <Button type="primary" icon={<UserAddOutlined />}> Add User</Button>
                            </Link>
                        }
                    </Col>
                    <Col>
                        {isAdministratorOrHavePermissions([Permission.ExportUsersToExcel]) &&
                            <Link to={"createReport"} state={{ popup: location }}>
                                <ExcelExportButton />
                            </Link>
                        }
                    </Col>
                </Row>
                <Divider />
            </>
        }
        <Table
            columns={columns}
            size={"middle"}
            dataSource={users}
            loading={loadingUsers}
            rowKey={"id"}
            onChange={handleChange}
            pagination={{
                total: totalPages,
                pageSize: pageSize,
                defaultPageSize: pageSize, showSizeChanger: true,
                onChange: (page, pageSize1) => {
                    dispatch(usersActions.setCurrentPage(page - 1));
                }
            }}
        />
    </>
})
