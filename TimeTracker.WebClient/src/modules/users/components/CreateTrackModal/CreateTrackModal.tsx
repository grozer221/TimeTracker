import * as React from 'react';
import { FC } from 'react';
import { DatePicker, Form, Input, Modal, Radio } from "antd";
import Title from "antd/lib/typography/Title";
import { nameof, uppercaseToWords } from "../../../../utils/stringUtils";
import { useForm } from "antd/es/form/Form";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../behaviour/store";
import { usersActions } from "../../store/users.slice";
import { navigateActions } from "../../../navigate/store/navigate.slice";
import { TrackKind } from "../../../../behaviour/enums/TrackKind";
import { tracksAction } from "../../../tracks/store/tracks.slice";
import { TrackCreation } from "../../../../behaviour/enums/TrackCreation";

type FormValues = {
    title: string,
    kind: TrackKind,
    time: string,
}

const { RangePicker } = DatePicker;

type Props = {};
export const CreateTrackModal: FC<Props> = () => {
    const [form] = useForm()
    const dispatch = useDispatch()
    const user = useAppSelector(s => s.users.userProfile)

    const loadingUsers = useAppSelector(s => s.users.loadingUsers)
    const today = new Date()

    const handleOk = async () => {
        try {
            await form.validateFields()
            const title = form.getFieldValue(nameof<FormValues>("title")) ?? ""
            const kind = form.getFieldValue(nameof<FormValues>("kind"))
            const [startTime, endTime] = form.getFieldValue(nameof<FormValues>("time"))

            dispatch(tracksAction.createTrackForOtherUser({
                userId: user?.id as string,
                kind,
                title,
                creation: TrackCreation.Manually,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString()
            }))

        } catch (e) {
            console.log(e)
        }
    }

    const handleCancel = () => {
        dispatch(usersActions.clearUsersForVacationData())
        dispatch(navigateActions.navigate(-1))
    }

    return (
        <Modal
            title={<Title level={4}>Create new track</Title>}
            confirmLoading={loadingUsers}
            visible={true}
            onOk={handleOk}
            okText={'Create'}
            onCancel={handleCancel}
        >
            <Form
                form={form}
                labelCol={{ span: 24 }}>
                <Form.Item name={nameof<FormValues>("title")}
                    label={"Title:"}>
                    <Input placeholder="Input title" />
                </Form.Item>

                <Form.Item name={nameof<FormValues>("kind")}
                    label={"Kind:"}
                    initialValue={TrackKind.Working}
                    rules={[{ required: true, message: "select kind!" }]}
                >
                    <Radio.Group >
                        {
                            Object.values(TrackKind).map(value =>
                                <Radio value={value} key={value}>
                                    {uppercaseToWords(value)}
                                </Radio>)
                        }
                    </Radio.Group>
                </Form.Item>

                <Form.Item name={nameof<FormValues>("time")}
                    label={"Time:"}
                    rules={[{ required: true, message: "select time range!" }]}
                >
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={(currentDate) =>
                            today.getMonth() !== +currentDate.month() || today.getFullYear() !== +currentDate.year()
                        } />
                </Form.Item>
            </Form>
        </Modal>
    );
};