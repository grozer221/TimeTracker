import React, { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../../../../behaviour/store";
import { vacationRequestsActions } from "../../store/vacationRequests.slice";
import { DatePicker, Form, Input, Modal, Radio, Typography } from "antd";
import { nameof, uppercaseToWords } from "../../../../utils/stringUtils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { formStyles } from "../../../../assets/form";
import Title from 'antd/lib/typography/Title';
import { useForm } from "antd/es/form/Form";
import { VacationRequestStatus } from "../../../../behaviour/enums/VacationRequestStatus";
import { VacationRequestsUpdateStatusInputType } from "../../graphQL/vacationRequests.mutations";
import moment, { Moment } from "moment";
import { Loading } from "../../../../components/Loading/Loading";

const { RangePicker } = DatePicker;
const { Text } = Typography;


type FromValues = {
    id: string,
    user: string,
    status: VacationRequestStatus,
    startAndEnd: Moment[],
    comment?: string,
}

export const VacationRequestsUpdatePage: FC = () => {
    const params = useParams()
    const id = params.id || '';
    const location = useLocation();
    const dispatch = useAppDispatch();
    const vacationRequests = useAppSelector(s => s.vacationRequests.vacationRequests)
    const loadingUpdate = useAppSelector(s => s.vacationRequests.loadingUpdate)
    const loadingGet = useAppSelector(s => s.vacationRequests.loadingGet)
    const loadingGetById = useAppSelector(s => s.vacationRequests.loadingGetById)
    const availableDays = useAppSelector(s => s.vacationRequests.availableDays)
    const [form] = useForm<FromValues>();
    const navigate = useNavigate();
    const vacationRequestInUpdate = vacationRequests.entities.find(v => v.id === id);

    useEffect(() => {
        if (!vacationRequestInUpdate) {
            dispatch(vacationRequestsActions.getByIdAsync({ id }))
        }
        if (!availableDays) {
            dispatch(vacationRequestsActions.getAvailableDaysAsync())
        }
    }, [])

    const onFinish = async () => {
        try {
            await form.validateFields();
            const id = form.getFieldValue(nameof<FromValues>('id'));
            const status = form.getFieldValue(nameof<FromValues>('status'));
            const vacationRequestsUpdateStatusInputType: VacationRequestsUpdateStatusInputType = {
                id,
                status
            }
            dispatch(vacationRequestsActions.updateStatusAsync(vacationRequestsUpdateStatusInputType))
        } catch (e) {
            console.log(e);
        }
    }


    const initialValues: FromValues = {
        id: vacationRequestInUpdate?.id || '',
        user: `${vacationRequestInUpdate?.user.firstName} ${vacationRequestInUpdate?.user.lastName}`,
        status: vacationRequestInUpdate?.status || VacationRequestStatus.New,
        startAndEnd: [moment(vacationRequestInUpdate?.dateStart), moment(vacationRequestInUpdate?.dateEnd)],
        comment: vacationRequestInUpdate?.comment,
    }

    return (
        <Modal
            title={<Title level={4}>Update vacation request</Title>}
            confirmLoading={loadingUpdate}
            visible={true}
            onOk={() => form.submit()}
            okText={'Update'}
            onCancel={() => navigate(-1)}
        >
            {loadingGetById || loadingGet || !vacationRequestInUpdate
                ? <Loading />
                : <Form
                    name="VacationRequestsUpdateForm"
                    form={form}
                    onFinish={onFinish}
                    initialValues={initialValues}
                    labelCol={formStyles}
                >
                    <Form.Item
                        name={nameof<FromValues>('id')}
                        className={'invisible'}
                    >
                        <Input type={'hidden'} />
                    </Form.Item>

                    <Form.Item
                        name={nameof<FromValues>('status')}
                        label={'Status'}
                        rules={[{ required: true, message: 'Status is required' }]}
                    >
                        <Radio.Group>
                            {(Object.values(VacationRequestStatus) as Array<VacationRequestStatus>).map((value) => (
                                <Radio.Button key={value} value={value}>
                                    {uppercaseToWords(value)}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        name={nameof<FromValues>('startAndEnd')}
                        label={'Start and end'}
                        rules={[{ required: true, message: 'Date start and date end is required' }]}
                    >
                        <RangePicker disabled={true} />

                    </Form.Item>
                    <Form.Item
                        name={nameof<FromValues>('comment')}
                        label={'Comment'}
                    >
                        <Input placeholder={'Comment'} disabled={true} />
                    </Form.Item>
                    <Form.Item
                        name={nameof<FromValues>('user')}
                        label={'User'}
                    >
                        <Input placeholder={'User'} disabled={true} />
                    </Form.Item>
                </Form>
            }
        </Modal>
    );
};