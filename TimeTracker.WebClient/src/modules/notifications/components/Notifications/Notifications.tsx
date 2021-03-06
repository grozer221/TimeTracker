import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/store";
import {message} from "antd";
import {notificationsActions} from "../../store/notifications.actions";

export const Notifications = () => {
    const notifications = useSelector((s: RootState) => s.notifications.notifications);
    const dispatch = useDispatch();

    useEffect(() => {
        notifications.map(n => {
            switch (n.type){
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
            dispatch(notificationsActions.removeNotification(n));
        });
    }, [notifications])

    return null;
};