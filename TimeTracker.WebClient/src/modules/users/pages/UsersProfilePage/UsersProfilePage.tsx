import React, {useEffect} from "react";
import {isAdministratorOrHavePermissions, isAuthenticated} from "../../../../utils/permissions";
import {RootState, useAppSelector} from "../../../../store/store";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {usersActions} from "../../store/users.slice";
import {Loading} from "../../../../components/Loading/Loading";
import {Card, Col, DatePicker, Descriptions, Dropdown, Menu, Row, Space, Table, Tag} from "antd";
import {uppercaseToWords} from "../../../../utils/stringUtils";
import {Employment} from "../../../../graphQL/enums/Employment";
import {TrackKind} from "../../../../graphQL/enums/TrackKind";
import {ColumnsType} from "antd/es/table";
import {User} from "../../graphQL/users.types";
import {getColumnSearchProps} from "../../components/parrtial/ColumnSerach";
import {Role} from "../../../../graphQL/enums/Role";
import {Permission} from "../../../../graphQL/enums/Permission";
import {DownCircleFilled} from "@ant-design/icons";
import {Track} from "../../../tracks/graphQL/tracks.types";
import Title from "antd/lib/typography/Title";
import {Divider} from "antd/es";
import {ItemType} from "antd/lib/menu/hooks/useItems";


export const UsersProfilePage = () => {
    const isAuth = useAppSelector(s => s.auth.isAuth)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const params = useParams()
    const email = params['email'] as string

    const userProfile = useSelector((s: RootState) => s.users.userProfile)

    let tracks = useSelector((s: RootState) => s.tracks.tracks)

    useEffect(() => {
        if (!isAuthenticated())
            navigate('/auth/login');
    }, [isAuth])

    useEffect(() => {
        dispatch(usersActions.getUserByEmailAsync(email))
    }, [])


    const menu = (trackId: string) => {
        let items: ItemType[] = []

        if (isAdministratorOrHavePermissions([Permission.UpdateUsers])) {
            items.push(
                {key: '1', label: (<Link to={"update/" + trackId} state={{popup: location}}>Update</Link>)},
                {key: '2', label: (<Link to={"remove/" + trackId} state={{popup: location}}>Remove</Link>)},
            )
        }
        return <Menu items={items}/>
    }

    const columns: ColumnsType<Track> = [
        {title: 'Title', dataIndex: 'title', key: 'title'},
        {
            title: 'Kind', dataIndex: 'kind', key: 'kind',
            render: (value, record, index) => {
                return uppercaseToWords(value)
            }
        },
        {title: 'Start Time', dataIndex: 'startTime', key: 'startTime'},
        {title: 'End Time', dataIndex: 'endTime', key: 'endTime'},
        {
            title: 'Action', dataIndex: 'operation', key: 'operation',
            render: (text, record, index) => (
                <Space size="middle">
                    <Dropdown overlay={menu(record.id)}>
                        <DownCircleFilled/>
                    </Dropdown>
                </Space>
            ),
        }
    ];

    if (userProfile == null) return <Loading/>

    return <>
        <Card size={"small"}>
            <Descriptions title={userProfile.firstName + " " + userProfile.lastName}>
                <Descriptions.Item label={"First name"}>{userProfile.firstName}</Descriptions.Item>
                <Descriptions.Item label={"Last name"}>{userProfile.lastName}</Descriptions.Item>
                <Descriptions.Item label={"Middle name"}>{userProfile.middleName}</Descriptions.Item>
                <Descriptions.Item label={"Email"}>{userProfile.email}</Descriptions.Item>
                <Descriptions.Item label={"Employment"}>
                    <Tag color={userProfile.employment === Employment.FullTime ? 'green' : 'yellow'}>
                        {uppercaseToWords(userProfile.employment)}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={"Permissions"}>
                    <Space wrap>
                        {userProfile.permissions.map(p => <Tag color={"blue"}>{uppercaseToWords(p)}</Tag>)}
                    </Space>
                </Descriptions.Item>
            </Descriptions>
        </Card>
        <Row style={{marginTop: 10, marginBottom: 10}}>
            <Col span={20}></Col>
            <Col span={4}>
                    <DatePicker picker={"month"}/>
            </Col>
        </Row>
            <Card size={"small"}>
            <Table columns={columns}
                   dataSource={tracks}
                   rowKey={record => record.id}
                   pagination={false}
                   title={() => <Title level={5}>{userProfile.firstName + " " + userProfile.lastName + " tracks: "}</Title>}/>
        </Card>
    </>
}