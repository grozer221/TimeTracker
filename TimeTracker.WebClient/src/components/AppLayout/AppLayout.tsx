import React, { FC, useState } from 'react';
import { Button, Dropdown, Layout, Menu, Row, Space } from 'antd';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../modules/auth/store/auth.slice";
import s from './AppLayout.module.css';
import { AppBreadcrumb } from "../AppBreadcrumb";
import {
    AppstoreOutlined,
    AuditOutlined,
    BarChartOutlined,
    CalendarOutlined,
    DownOutlined,
    FieldTimeOutlined,
    FileSearchOutlined,
    LogoutOutlined,
    ProfileOutlined,
    ReloadOutlined,
    SettingOutlined,
    ToolOutlined,
    UsergroupAddOutlined
} from "@ant-design/icons";
import { useAppSelector } from "../../behaviour/store";
import Logo from '../../assets/images/clockify-logo-with-title.png';
import { ItemType } from "antd/lib/menu/hooks/useItems";
import { cacheActions } from "../../modules/cache/store/cache.slice";
import { isAdministrator, isAdministratorOrHavePermissions, isSuperAdmin } from "../../utils/permissions";
import { Permission } from '../../behaviour/enums/Permission';

const { Header, Content, Sider } = Layout;

type Props = {
    children?: React.ReactNode
}

export const getHeaderExtraButtonsElement = (): HTMLDivElement => document.getElementById('headerExtraButtons') as HTMLDivElement;

export const AppLayout: FC<Props> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const dispatch = useDispatch()
    const authedUser = useAppSelector(s => s.auth.authedUser);
    const settings = useAppSelector(s => s.settings.settings);
    const loadingRefreshApp = useAppSelector(s => s.cache.loadingRefreshApp);

    const headerMenu = (
        <Menu
            items={[
                {
                    key: 'Profile',
                    label: (
                        <Link to={`/users/profile/${authedUser?.email}`}>
                            <Space>
                                <ProfileOutlined />
                                <span>Profile</span>
                            </Space>
                        </Link>
                    ),
                },
                {
                    key: 'My settings',
                    label: (
                        <Link to={'/my-settings/security'}>
                            <Space>
                                <SettingOutlined />
                                <span>My settings</span>
                            </Space>
                        </Link>
                    ),
                },
                {
                    key: 'Logout',
                    onClick: () => dispatch(authActions.logoutAsync()),
                    label: (
                        <Space>
                            <LogoutOutlined />
                            <span>Logout</span>
                        </Space>
                    ),
                },
            ]}
        />
    );

    const mainMenuItems: ItemType[] = [
        {
            key: '/time-tracker',
            icon: <FieldTimeOutlined />,
            label: <Link to={'./time-tracker'}>Time tracker</Link>,
        },
        {
            key: '/calendar',
            icon: <CalendarOutlined />,
            label: <Link to={'calendar'}>Calendar</Link>,
        },
        {
            key: '/vacation-requests',
            icon: <AuditOutlined />,
            label: <Link to={'vacation-requests'}>Vacation requests</Link>,
        },
        {
            key: '/sick-leave-days',
            icon: <AuditOutlined />,
            label: <Link to={'sick-leave-days'}>Sick leave days</Link>,
        },
        {
            key: '/users',
            icon: <UsergroupAddOutlined />,
            label: <Link to={'users'}>Users</Link>,
        },
        isSuperAdmin()
            ? {
                key: '/companies',
                icon: <UsergroupAddOutlined />,
                label: <Link to={'companies'}>Companies</Link>,
            }
            : null,
        {
            key: '/tools',
            icon: <ToolOutlined />,
            label: <div>Tools</div>,
            children: [
                isAdministratorOrHavePermissions([Permission.UpdateFileManager])
                    ? {
                        key: '/tools/file-manager',
                        icon: <FileSearchOutlined />,
                        label: <Link to={'tools/file-manager'}>File manager</Link>,
                    }
                    : null,
            ]
        },
        isAdministratorOrHavePermissions([Permission.UpdateSettings])
            ? {
                key: '/settings',
                icon: <SettingOutlined />,
                label: <Link to={'settings/application'}>Settings</Link>,
            }
            : null,
    ]

    return (
        <Layout className={s.layout}>
            <Header className={s.header}>
                <Row justify={'space-between'} align={'middle'}>
                    <Row align={'middle'}>
                        <Button type="default"
                            icon={<AppstoreOutlined />}
                            size={'large'}
                            onClick={() => setCollapsed(!collapsed)}
                        />
                        <Link to={'/time-tracker'}>
                            <img
                                alt={'Logo'}
                                className={s.logo}
                                src={settings?.application?.logoUrl || Logo}
                            />
                        </Link>
                    </Row>
                    <Space size={40}>
                        <div id={'headerExtraButtons'}>

                        </div>
                        {isAdministrator() &&
                            <Button
                                icon={<ReloadOutlined />}
                                loading={loadingRefreshApp}
                                onClick={() => dispatch(cacheActions.refreshAppAsync())}
                            >Refresh app cache</Button>
                        }
                        <Dropdown overlay={headerMenu}>
                            <Space className={s.name}>
                                <span>{authedUser?.firstName} {authedUser?.lastName}</span>
                                <DownOutlined />
                            </Space>
                        </Dropdown>
                    </Space>
                </Row>
            </Header>
            <Layout>
                <Sider collapsed={collapsed} onCollapse={setCollapsed} className={s.wrapperMenu}>
                    <Menu theme="dark" mode="inline" items={mainMenuItems} />
                </Sider>
                <Layout className="site-layout">
                    <Content className={s.content}>
                        <div className={s.siteLayoutBackground}>
                            <div className={s.breadcrumbs}>
                                <AppBreadcrumb />
                            </div>
                            <div>{children}</div>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};