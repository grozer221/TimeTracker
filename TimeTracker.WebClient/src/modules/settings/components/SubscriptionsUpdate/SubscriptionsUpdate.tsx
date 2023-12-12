import styles from './SubscriptionsUpdate.module.css';
import React, { FC } from 'react';
import { useForm } from "antd/es/form/Form";
import { formStyles } from "../../../../assets/form";
import { SettingsEmailUpdateInputType, SettingsVacationRequestsUpdateInputType } from "../../graphQL/settings.mutations";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../behaviour/store";
import { nameof } from "../../../../utils/stringUtils";
import { ExtraHeaderButtons } from "../../../../components/ExtraHeaderButtons";
import { settingsActions } from "../../store/settings.slice";
import { Button } from 'antd';
import { SubscriptionKind } from '../../graphQL/settings.types';

type FormValues = {
    amountDaysPerYear: number,
};

export const SubscriptionsUpdate: FC = ({ }) => {
    const [form] = useForm();
    const dispatch = useDispatch();
    const settingsLoadingUpdate = useSelector((s: RootState) => s.settings.loadingUpdate)
    const settings = useSelector((s: RootState) => s.settings.settings)

    const onFinish = (values: FormValues) => {
        const settingsVacationRequestsUpdateInputType: SettingsVacationRequestsUpdateInputType = {
            amountDaysPerYear: values.amountDaysPerYear,
        }
        dispatch(settingsActions.updateVacationRequestsAsync(settingsVacationRequestsUpdateInputType));
    };

    const initialValues: FormValues = {
        amountDaysPerYear: settings?.vacationRequests.amountDaysPerYear || 0
    }

    const getTitle = (kind: SubscriptionKind) => {
        switch (kind) {
            case SubscriptionKind.None:
                return 'None'
            case SubscriptionKind.Pro:
                return 'Pro'
            case SubscriptionKind.Advanced:
                return 'Advanced'
            case SubscriptionKind.Unlimited:
                return 'Unlimited'
            default:
                return null;
        }
    }

    return (
        <div className={styles.subscriptions}>
            {settings?.subscriptions.all.map(subscription => (
                <div className={styles.subscription}>
                    <div className={styles.title}>{getTitle(subscription.kind)}</div>
                    <div>Company emploee max count: {subscription.companyEmploeeMaxCount}</div>
                    <div className={styles.price}>{subscription.priceUsd} USD</div>
                    <div className={styles.status}>
                        {subscription.kind === settings.subscriptions.current.kind
                            ? <div className={styles.active}>Active</div>
                            : subscription.kind !== SubscriptionKind.None && <Button>Subscribe</Button>}
                    </div>
                </div>
            ))}
        </div>
    );
};