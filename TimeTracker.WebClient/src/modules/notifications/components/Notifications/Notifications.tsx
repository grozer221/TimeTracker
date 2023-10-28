import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../behaviour/store";
import { message } from "antd";
import { notificationsActions } from '../../store/notifications.slice';

export const Notifications = () => {
    const notifications = useSelector((s: RootState) => s.notifications.notifications);
    const dispatch = useDispatch();

    useEffect(() => {
        if (notifications.length) {
            notifications.map(n => {
                switch (n.type) {
                    case 'Success':
                        message.success(n.text)
                        break;
                    case 'Error':
                        message.error(n.text)
                        break;
                    case 'Info':
                        message.info(n.text)
                        break;
                    case 'Warning':
                        message.warning(n.text)
                        break;
                }
            });
            dispatch(notificationsActions.removeNotification());
        }
    }, [notifications])

    return null;
};