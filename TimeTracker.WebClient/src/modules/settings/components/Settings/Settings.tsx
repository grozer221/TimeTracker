import React, {FC, useEffect} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/store";
import Favicon from '../../../../assets/images/clockify-logo.png';

type Props = {};
export const Settings: FC<Props> = ({}) => {
    const settings = useSelector((state: RootState) => state.settings.settings)

    useEffect(() => {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (settings?.application.faviconUrl) {
            link.href = settings.application.faviconUrl;
        } else {
            link.href = Favicon;
        }
    }, [settings?.application.faviconUrl])

    useEffect(() => {
        if (settings?.application.title) {
            let title = document.querySelector("title") as HTMLTitleElement;
            title.innerHTML = settings.application.title;
        }

    }, [settings?.application.title])

    return null
};