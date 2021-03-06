import React, {FC, useState} from 'react';
import {Button, Dropdown, Layout, Menu, Row, Space} from 'antd';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authActions} from "../../modules/auth/store/auth.actions";
import s from './AppLayout.module.css';
import {AppBreadcrumb} from "../AppBreadcrumb";
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
import {RootState} from "../../store/store";
import Logo from '../../assets/images/clockify-logo-with-title.png';
import {ItemType} from "antd/lib/menu/hooks/useItems";
import {cacheActions} from "../../modules/cache/store/cache.actions";
import {isAdministratorOrHavePermissions} from "../../utils/permissions";
import {Permission} from "../../graphQL/enums/Permission";

const {Header, Content, Sider} = Layout;

type Props = {
    children?: React.ReactNode
}

export const getHeaderExtraButtonsElement = (): HTMLDivElement => document.getElementById('headerExtraButtons') as HTMLDivElement;

export const AppLayout: FC<Props> = ({children}) => {
    const [collapsed, setCollapsed] = useState(false);
    const dispatch = useDispatch()
    const authedUser = useSelector((s: RootState) => s.auth.authedUser);
    const settings = useSelector((s: RootState) => s.settings.settings);
    const loadingRefreshApp = useSelector((s: RootState) => s.cache.loadingRefreshApp);

    const headerMenu = (
        <Menu
            items={[
                {
                    key: 'Profile',
                    label: (
                        <Link to={'#'}>
                            <Space>
                                <ProfileOutlined/>
                                <span>Profile</span>
                            </Space>
                        </Link>
                    ),
                },
                {
                    key: 'Logout',
                    onClick: () => dispatch(authActions.logoutAsync()),
                    label: (
                        <Space>
                            <LogoutOutlined/>
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
            icon: <FieldTimeOutlined/>,
            label: <Link to={'./time-tracker'}>Time tracker</Link>,
        },
        {
            key: '/calendar',
            icon: <CalendarOutlined/>,
            label: <Link to={'calendar'}>Calendar</Link>,
        },
        {
            key: '/reports',
            icon: <BarChartOutlined/>,
            label: <Link to={'reports'}>Reports</Link>,
        },
        {
            key: '/vocation-requests',
            icon: <AuditOutlined/>,
            label: <Link to={'vocation-requests'}>Vocation requests</Link>,
        },
        {
            key: '/users',
            icon: <UsergroupAddOutlined/>,
            label: <Link to={'users'}>Users</Link>,
        },
        {
            key: '/tools',
            icon: <ToolOutlined/>,
            label: <div>Tools</div>,
            children: [
                {
                    key: '/tools/file-manager',
                    icon: <FileSearchOutlined/>,
                    label: <Link to={'tools/file-manager'}>File manager</Link>,
                }
            ]
        },
        {
            key: '/settings',
            icon: <SettingOutlined/>,
            label: <Link to={'settings/application'}>Settings</Link>,
        },
    ]

    return (
        <Layout className={s.layout}>
            <Header className={s.header}>
                <Row justify={'space-between'} align={'middle'}>
                    <Row align={'middle'}>
                        <Button type="default"
                                icon={<AppstoreOutlined/>}
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
                        {isAdministratorOrHavePermissions([Permission.ClearCache]) &&
                            <Button
                                icon={<ReloadOutlined/>}
                                loading={loadingRefreshApp}
                                onClick={() => dispatch(cacheActions.refreshAppAsync())}
                            >Refresh app cache</Button>
                        }
                        <Dropdown overlay={headerMenu}>
                            <Space className={s.name}>
                                <span>{authedUser?.firstName} {authedUser?.lastName}</span>
                                <DownOutlined/>
                            </Space>
                        </Dropdown>
                    </Space>
                </Row>
            </Header>
            <Layout>
                <Sider collapsed={collapsed} onCollapse={setCollapsed} className={s.wrapperMenu}>
                    <Menu theme="dark" mode="inline" items={mainMenuItems}/>
                </Sider>
                <Layout className="site-layout">
                    <Content className={s.content}>
                        <div className={s.siteLayoutBackground}>
                            <div className={s.breadcrumbs}>
                                <AppBreadcrumb/>
                            </div>
                            <div>{children}</div>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};