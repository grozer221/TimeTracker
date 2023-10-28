import React, { FC, useState } from 'react';
import { Row, Tabs } from "antd";
import { SecurityScanOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../behaviour/store";
import { Loading } from "../../../../components/Loading/Loading";
import { MySettingsSecurityUpdate } from "../../components/MySettingsSecurityUpdate/MySettingsSecurityUpdate";

const { TabPane } = Tabs;

type Tab = 'security';

export const MySettingsPage: FC = () => {
    const { tab } = useParams();
    const navigate = useNavigate();
    const initialised = useSelector((s: RootState) => s.app.initialised);
    const authLoadingMe = useSelector((s: RootState) => s.auth.loadingMe);
    const [selectedTab, setSelectedTab] = useState<Tab>(tab as Tab);

    const onChangeTabHandler = (tab: string) => {
        setSelectedTab(tab as Tab);
        navigate(`/my-settings/${tab}`)
    }

    if (!initialised || authLoadingMe)
        return <Loading />

    return (
        <Row>
            <Tabs
                defaultActiveKey={tab || 'security'}
                onChange={onChangeTabHandler}
                style={{ width: '100%' }}
            >
                <TabPane
                    tab={<span><SecurityScanOutlined />Security</span>}
                    key="security"
                >
                    {selectedTab === 'security' && <MySettingsSecurityUpdate />}
                </TabPane>
            </Tabs>
        </Row>
    );
};