import { Col, Form, Image, Input, Row, Typography } from 'antd';
import React, { FC, useState } from 'react';
import { useForm } from "antd/es/form/Form";
import { formStyles } from "../../../../assets/form";
import { SettingsApplicationUpdateInputType } from "../../graphQL/settings.mutations";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../behaviour/store";
import { nameof } from "../../../../utils/stringUtils";
import { linkRegexPattern } from "../../../../utils/regexUtils";
import { ExtraHeaderButtons } from "../../../../components/ExtraHeaderButtons";
import { FileManagerOpenButton } from "../../../fileManager/components/FileManagerOpenButton";
import { FileManagerItem } from "../../../fileManager/graphQL/fileManager.types";
import { settingsActions } from "../../store/settings.slice";

const { Text } = Typography;

type FormValues = {
    title?: string,
};

export const SettingsApplicationUpdate: FC = ({ }) => {
    const [form] = useForm();
    const dispatch = useDispatch();
    const settingsLoadingUpdate = useSelector((s: RootState) => s.settings.loadingUpdate)
    const settings = useSelector((s: RootState) => s.settings.settings)
    const [selectFaviconFileManagerVisible, setSelectFaviconFileManagerVisible] = useState(false);
    const [faviconUrl, setFaviconUrl] = useState<string | undefined>(settings?.application?.faviconUrl);
    const [selectLogoFileManagerVisible, setSelectLogoFileManagerVisible] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | undefined>(settings?.application?.logoUrl);

    const onFinish = (values: FormValues) => {
        const settingsApplicationUpdateInputType: SettingsApplicationUpdateInputType = {
            title: values.title,
            faviconUrl: faviconUrl,
            logoUrl: logoUrl,
        }
        dispatch(settingsActions.updateApplicationAsync(settingsApplicationUpdateInputType));
    };

    const onDiscardChanges = () => {
        form.resetFields()
        setFaviconUrl(settings?.application?.faviconUrl)
        setLogoUrl(settings?.application?.logoUrl)
    }

    const onSelectFaviconUrl = (item: FileManagerItem) => {
        setSelectFaviconFileManagerVisible(false)
        setFaviconUrl(item.path);
    }

    const onSelectLogoUrl = (item: FileManagerItem) => {
        setSelectLogoFileManagerVisible(false)
        setLogoUrl(item.path);
    }


    const initialValues: FormValues = {
        title: settings?.application?.title,
    }

    return (
        <Form
            form={form}
            name="SettingsApplicationUpdateForm"
            onFinish={onFinish}
            labelCol={formStyles}
            initialValues={initialValues}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Title"
                        name={nameof<FormValues>('title')}
                    >
                        <Input placeholder={'Title'} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Favicon url"
                        name={'faviconUrl'}
                        rules={[
                            {
                                pattern: new RegExp(linkRegexPattern),
                                message: 'Favicon url must be url'
                            }
                        ]}
                    >
                        <Input.Group compact>
                            <Input
                                placeholder={'Favicon url'}
                                style={{ width: 'calc(100% - 32px)' }}
                                value={faviconUrl}
                                onChange={e => setFaviconUrl(e.target.value)}
                            />
                            <FileManagerOpenButton
                                visible={selectFaviconFileManagerVisible}
                                setVisible={setSelectFaviconFileManagerVisible}
                                onSelectFile={onSelectFaviconUrl}
                            />
                        </Input.Group>
                    </Form.Item>
                    <div className={'mt--10'}>
                        <Text type={'secondary'}>Recommended size 16 x 16 px</Text>
                    </div>
                    {faviconUrl && !form.getFieldError('faviconUrl').length &&
                        <div className={'imagePreview'}>
                            <Image src={faviconUrl} />
                        </div>
                    }
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Logo url"
                        name={'logoUrl'}
                        rules={[
                            {
                                pattern: new RegExp(linkRegexPattern),
                                message: 'Favicon url must be url'
                            }
                        ]}
                    >
                        <Input.Group compact>
                            <Input
                                placeholder={'Logo url'}
                                style={{ width: 'calc(100% - 32px)' }}
                                value={logoUrl}
                                onChange={e => setLogoUrl(e.target.value)}
                            />
                            <FileManagerOpenButton
                                visible={selectLogoFileManagerVisible}
                                setVisible={setSelectLogoFileManagerVisible}
                                onSelectFile={onSelectLogoUrl}
                            />
                        </Input.Group>
                    </Form.Item>
                    <div className={'mt--10'}>
                        <Text type={'secondary'}>Recommended size 120 x 30 px</Text>
                    </div>
                    {logoUrl && !form.getFieldError('logoUrl').length &&
                        <div className={'imagePreview'}>
                            <Image src={logoUrl} />
                        </div>
                    }
                </Col>
            </Row>
            <ExtraHeaderButtons
                onDiscardChanges={onDiscardChanges}
                onSaveChanges={form.submit}
                loading={settingsLoadingUpdate}
            />
        </Form>
    );
};