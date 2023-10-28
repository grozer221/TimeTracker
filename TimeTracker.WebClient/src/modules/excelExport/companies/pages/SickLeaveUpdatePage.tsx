import {DatePicker, Form, Input, Modal, Typography} from "antd";
import moment, {Moment} from "moment";
import React, {FC, useEffect} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useForm} from "antd/es/form/Form";
import Title from "antd/lib/typography/Title";
import {sickLeaveActions} from "../store/sickLeave.slice";
import {SickLeaveUpdateInputType} from "../graphQL/sickLeave.mutation";
import { nameof } from "../../../../utils/stringUtils";
import { formStyles } from "../../../../assets/form";
import { Loading } from "../../../../components/Loading/Loading";
import { useAppDispatch, useAppSelector } from "../../../../behaviour/store";

const {RangePicker} = DatePicker;
const {Text} = Typography;


type FromValues = {
    id: string,
    user: string,
    startAndEnd: Moment[],
    comment?: string,
}

export const SickLeaveUpdatePage: FC = () => {
    const params = useParams()
    const id = params.id || '';
    const location = useLocation();
    const dispatch = useAppDispatch();
    const sickLeaveDays = useAppSelector(s => s.sickLeave.sickLeaveDays)
    const [form] = useForm<FromValues>();
    const navigate = useNavigate();
    const sickLeaveDayInUpdate = sickLeaveDays.entities.find(v => v.id === id);
    const loadingUpdate = useAppSelector(s => s.sickLeave.loadingUpdate)
    const loadingGet = useAppSelector(s => s.sickLeave.loadingGet)
    const loadingGetById = useAppSelector(s => s.sickLeave.loadingGetById)

    useEffect(() => {
        if (!sickLeaveDayInUpdate) {
            dispatch(sickLeaveActions.getByIdAsync({id}))
        }
    }, [])

    const onFinish = async () => {
        try {
            await form.validateFields();
            const id = form.getFieldValue(nameof<FromValues>('id'))
            const startDate = form.getFieldValue(nameof<FromValues>("startAndEnd"))[0].format("YYYY-MM-DD")
            const dateEnd = form.getFieldValue(nameof<FromValues>("startAndEnd"))[1].format("YYYY-MM-DD")
            const comment = form.getFieldValue(nameof<FromValues>("comment"))
            const sickLeaveUpdateInputType: SickLeaveUpdateInputType = {
                id,
                startDate: startDate,
                endDate: dateEnd,
                comment
            }
            dispatch(sickLeaveActions.updateAsync(sickLeaveUpdateInputType))
        } catch (e) {
            console.log(e);
        }
    }


    const initialValues: FromValues = {
        id: sickLeaveDayInUpdate?.id || '',
        user: `${sickLeaveDayInUpdate?.user.firstName} ${sickLeaveDayInUpdate?.user.lastName}`,
        startAndEnd: [moment(sickLeaveDayInUpdate?.startDate), moment(sickLeaveDayInUpdate?.endDate)],
        comment: sickLeaveDayInUpdate?.comment,
    }

    return (
        <Modal
            title={<Title level={4}>Update sick leave days</Title>}
            confirmLoading={loadingUpdate}
            visible={true}
            onOk={() => form.submit()}
            okText={'Update'}
            onCancel={() => navigate(-1)}
        >
            {
                loadingGet || loadingGetById || !sickLeaveDayInUpdate
                    ? <Loading/>
                    :
                    <Form
                        name="SickLeaveUpdateForm"
                        form={form}
                        onFinish={onFinish}
                        initialValues={initialValues}
                        labelCol={formStyles}
                    >
                        <Form.Item
                            name={nameof<FromValues>('id')}
                            className={'invisible'}
                        >
                            <Input type={'hidden'}/>
                        </Form.Item>
                        <Form.Item
                            name={nameof<FromValues>('startAndEnd')}
                            label={'Start and end'}
                            rules={[{required: true, message: 'Date start and date end is required'}]}
                        >
                            <RangePicker/>

                        </Form.Item>
                        <Form.Item
                            name={nameof<FromValues>('comment')}
                            label={'Comment'}
                        >
                            <Input placeholder={'Comment'}/>
                        </Form.Item>
                        <Form.Item
                            name={nameof<FromValues>('user')}
                            label={'User'}
                        >
                            <Input placeholder={'User'} disabled={true}/>
                        </Form.Item>
                    </Form>
            }
        </Modal>
    );
};