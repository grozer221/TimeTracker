import { Button, Popconfirm, Space, Table, Tabs, Tag, Typography } from "antd";
import React, { FC, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../behaviour/store";
import { ColumnsType } from "antd/es/table";
import { nameof } from "../../../utils/stringUtils";
import { isAdministratorOrHavePermissions } from "../../../utils/permissions";
import { ButtonUpdate } from "../../../components/ButtonUpdate";
import { DeleteOutlined, EditOutlined, UploadOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import { ButtonCreate } from "../../../components/ButtonCreate";
import { Permission } from "../../../behaviour/enums/Permission";
import { companiesActions } from "../behaviour/slice";
import { Company } from "../behaviour/types";

const { Text } = Typography;
const { TabPane } = Tabs;

export const CompaniesIndexPage: FC = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const companies = useAppSelector(s => s.companies.companies)
    const [searchParams, setSearchParams] = useSearchParams();
    const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
    const pageSize = parseInt((searchParams.get('pageSize')) || '10')

    useEffect(() => {
        dispatch(companiesActions.getCompaniesAsync({
            paging: {
                pageNumber,
                pageSize,
            }
        }))
    }, [searchParams])

    const columns: ColumnsType<Company> = [
        {
            title: 'Name',
            dataIndex: nameof<Company>('name'),
            key: nameof<Company>('name'),
        },
        {
            title: 'Email',
            dataIndex: nameof<Company>('email'),
            key: nameof<Company>('email'),
        },
        {
            title: 'Actions',
            dataIndex: 'Actions',
            key: 'Actions',
            render: (_, company) => {
                return (
                    <Space size={5}>
                        <ButtonUpdate to={`update/${company.id}`} popup={location} />
                        <Popconfirm
                            title={'Sure to remove?'}
                            onConfirm={() => dispatch(companiesActions.removeAsync({ id: company.id }))}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button shape="circle" type="primary" danger icon={<DeleteOutlined />} size={'small'} />
                        </Popconfirm>
                    </Space>
                )
            },
            width: '10%',
        },
    ];

    return (
        <div>
            <ButtonCreate to={'create'} popup={location} />
            <Table
                rowKey={'id'}
                // loading={loadingGet || loadingRemove}
                columns={columns}
                dataSource={companies.entities}
                pagination={{
                    total: companies.total,
                    pageSize: pageSize,
                    defaultPageSize: pageSize,
                    defaultCurrent: pageNumber,
                    showSizeChanger: true,
                }}
                onChange={(pagination, filters, sorter) => {
                    console.log(pagination, filters, sorter);
                    setSearchParams({
                        pageNumber: pagination.current?.toString() ?? '1',
                        pageSize: pagination.pageSize?.toString() ?? '10',
                    })
                }}
            />
        </div>
    );
};