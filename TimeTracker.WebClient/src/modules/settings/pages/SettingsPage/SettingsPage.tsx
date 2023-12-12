import React, { FC, useState } from 'react';
import { Row, Tabs } from "antd";
import { AppstoreOutlined, ClockCircleOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { SettingsEmploymentUpdate } from "../../components/SettingsEmploymentUpdate/SettingsEmploymentUpdate";
import { useNavigate, useParams } from "react-router-dom";
import { SettingsApplicationUpdate } from "../../components/SettingsApplicationUpdate/SettingsApplicationUpdate";
import { useSelector } from "react-redux";
import { RootState } from "../../../../behaviour/store";
import { Loading } from "../../../../components/Loading/Loading";
import { SettingsEmailUpdate } from "../../components/SettingsEmailUpdate/SettingsEmailUpdate";
import {
    SettingsVacationRequestsUpdate
} from "../../components/SettingsVacationRequestsUpdate/SettingsVacationRequestsUpdate";
import { isAdministratorOrHavePermissions } from "../../../../utils/permissions";
import { Permission } from "../../../../behaviour/enums/Permission";
import { Error } from "../../../../components/Error/Error";
import { SubscriptionsUpdate } from '../../components/SubscriptionsUpdate/SubscriptionsUpdate';

const { TabPane } = Tabs;

type Tab = 'application' | 'employment' | 'vacation-requests' | 'tasks' | 'email' | 'subscriptions';

export const SettingsPage: FC = () => {
    const { tab } = useParams();
    const navigate = useNavigate();
    const initialised = useSelector((s: RootState) => s.app.initialised);
    const settingsLoadingGet = useSelector((s: RootState) => s.settings.loadingGet);
    const authLoadingMe = useSelector((s: RootState) => s.auth.loadingMe);
    const [selectedTab, setSelectedTab] = useState<Tab>(tab as Tab);

    const onChangeTabHandler = (tab: string) => {
        setSelectedTab(tab as Tab);
        navigate(`/settings/${tab}`)
    }

    if (!isAdministratorOrHavePermissions([Permission.UpdateSettings]))
        return <Error statusCode={403} />

    if (!initialised || settingsLoadingGet || authLoadingMe)
        return <Loading />

    return (
        <Row>
            <Tabs
                defaultActiveKey={tab || 'application'}
                onChange={onChangeTabHandler}
                style={{ width: '100%' }}
            >
                <TabPane
                    tab={<span><AppstoreOutlined />Application</span>}
                    key="application"
                >
                    {selectedTab === 'application' && <SettingsApplicationUpdate />}
                </TabPane>
                <TabPane
                    tab={<span><UserOutlined />Employment</span>}
                    key="employment"
                >
                    {selectedTab === 'employment' && <SettingsEmploymentUpdate />}
                </TabPane>
                <TabPane
                    tab={<span><UserOutlined />Vacation requests</span>}
                    key="vacation-requests"
                >
                    {selectedTab === 'vacation-requests' && <SettingsVacationRequestsUpdate />}
                </TabPane>
                <TabPane
                    tab={<span><MailOutlined />Email</span>}
                    key="email"
                >
                    {selectedTab === 'email' && <SettingsEmailUpdate />}
                </TabPane>
                <TabPane
                    tab={<span><MailOutlined />Subscriptions</span>}
                    key="subscriptions"
                >
                    {selectedTab === 'subscriptions' && <SubscriptionsUpdate />}
                </TabPane>
            </Tabs>
        </Row>
    );
};