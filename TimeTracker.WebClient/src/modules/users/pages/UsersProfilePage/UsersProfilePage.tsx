import React, { useEffect, useState } from "react";
import { isAdministratorOrHavePermissions, isAuthenticated } from "../../../../utils/permissions";
import { RootState, useAppSelector } from "../../../../behaviour/store";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { usersActions } from "../../store/users.slice";
import { Loading } from "../../../../components/Loading/Loading";
import { Button, Card, Col, DatePicker, Descriptions, Divider, Row, Space, Tag } from "antd";
import { uppercaseToWords } from "../../../../utils/stringUtils";
import Title from "antd/lib/typography/Title";
import moment, { now } from "moment/moment";
import { TracksTable } from "../../../timeTracker/components/TracksTable/TracksTable";
import { PlusOutlined } from "@ant-design/icons";
import { tracksAction } from "../../../tracks/store/tracks.slice";
import {
    CreateTrackForOtherUserInput, CreateTrackInput,
    RemoveTrackInput,
    UpdateTrackInput
} from "../../../tracks/graphQL/tracks.mutations";
import { PlateOfHoursWorked } from "../../components/PlateOfHoursWorked/PlateOfHoursWorked";
import { statisticAction } from "../../../timeTracker/userStatistic/store/statistic.slice";
import { TracksStatistic } from "../../../timeTracker/components/Statistic/TracksStatistic";
import { Permission } from "../../../../behaviour/enums/Permission";
import { Employment } from "../../../../behaviour/enums/Employment";


export const UsersProfilePage = () => {
    const isAuth = useAppSelector(s => s.auth.isAuth)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const params = useParams()
    const email = params['email'] as string
    const location = useLocation()

    const userProfile = useSelector((s: RootState) => s.users.userProfile)
    let tracks = useSelector((s: RootState) => s.users.userTracks)
    let userTracksLoading = useSelector((s: RootState) => s.users.userTracksLoading)

    let [date, setDate] = useState(moment(now()).toISOString())
    const today = new Date()
    const dateObj = new Date(date)
    const canEditDateOrKind = isAdministratorOrHavePermissions([Permission.UpdateOthersTimeTracker])
        && (today.getMonth() == dateObj.getMonth() && today.getFullYear() == dateObj.getFullYear())

    const update = (updateTrackInput: UpdateTrackInput) => {
        return usersActions.updateUserTrack(updateTrackInput)
    }

    const create = (createTrackInput: CreateTrackInput | CreateTrackForOtherUserInput) => {
        return tracksAction.createTrackForOtherUser(createTrackInput as CreateTrackForOtherUserInput);
    }

    const remove = (removeTrackInput: RemoveTrackInput) => {
        return usersActions.deleteUserTrack(removeTrackInput)
    }

    if (userProfile != null)
        dispatch(tracksAction.setGetTracksInputData({
            UserId: userProfile!.id,
            Date: date
        }))

    const editable = (dateObj.getMonth() == today.getMonth() && dateObj.getFullYear() == today.getFullYear())
        && isAdministratorOrHavePermissions([Permission.UpdateOthersTimeTracker])

    useEffect(() => {
        if (!isAuthenticated())
            navigate('/auth/login');
    }, [isAuth])

    useEffect(() => {
        if (userProfile != null) {
            dispatch(statisticAction.setGetStatisticInputData({ UserId: userProfile!.id, Date: date }))
            dispatch(statisticAction.getAsync({ UserId: userProfile!.id, Date: date }))
        }
    }, [tracks])

    useEffect(() => {
        dispatch(usersActions.getUserByEmailAsync(email))
    }, [])

    useEffect(() => {
        if (userProfile != null)
            dispatch(usersActions.getTracksByUserIdAndDate({ UserId: userProfile.id, Date: date }))
    }, [userProfile])

    useEffect(() => {
        if (userProfile != null)
            dispatch(usersActions.getTracksByUserIdAndDate({ UserId: userProfile.id, Date: date }))
    }, [date])

    useEffect(() => {
        return () => {
            dispatch(usersActions.clearUserProfile())
        }
    }, []);

    if (userProfile == null) return <Loading />
    if (tracks == null) tracks = []

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
        <Row style={{ marginTop: 10, marginBottom: 10 }}>
            <Col span={20} />
            <Col span={4}>
                <DatePicker picker={"month"} defaultValue={moment(now())} onChange={e => {
                    if (e != null)
                        setDate(e.toISOString())
                }} />
            </Col>
        </Row>
        <Card title={<Title level={5}>Worked days time: </Title>}>
            <PlateOfHoursWorked tracks={tracks} date={date} />
        </Card>
        <Divider />
        <Card size={"small"}
            title={
                <Row justify="space-between" align={'middle'}>
                    <Col >
                        <Title level={5}>Tracks: </Title>
                    </Col>
                    <Col span={20}>
                        <TracksStatistic />
                    </Col>
                    <Col >
                        {
                            editable ?
                                <Link to={"create-track"} state={{ popup: location }}>
                                    <Button shape={"circle"} type={"primary"} icon={<PlusOutlined />}></Button>
                                </Link> : ""
                        }
                    </Col>
                </Row>
            }>
            <TracksTable tracks={tracks}
                date={date} loading={userTracksLoading}
                canEditDateOrKind={canEditDateOrKind}
                crudCallbacks={{ create, update, remove }}
            />
        </Card>
    </>
}