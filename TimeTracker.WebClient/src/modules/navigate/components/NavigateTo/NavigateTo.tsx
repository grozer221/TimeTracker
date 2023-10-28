import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../behaviour/store";
import { useNavigate } from "react-router-dom";
import { navigateActions } from "../../store/navigate.slice";

export const NavigateTo = () => {
    const to = useSelector((s: RootState) => s.navigate.to)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const toCopy = to;
        if (toCopy) {
            dispatch(navigateActions.removeNavigate())
            // @ts-ignore
            navigate(toCopy)
        }
    }, [to])

    return null
};