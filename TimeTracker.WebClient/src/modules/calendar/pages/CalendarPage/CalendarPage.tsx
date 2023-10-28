import React, { useEffect } from 'react';
import { Calendar, Row, Space, Typography } from "antd";
import moment, { Moment } from 'moment';
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { calendarDaysActions } from "../../../calendarDays/store/calendarDays.slice";
import { useAppSelector } from "../../../../behaviour/store";
import s from './CalendarPage.module.css';
import { ButtonCreate } from "../../../../components/ButtonCreate";
import { DayKind } from "../../../../behaviour/enums/DayKind";
import { ButtonRemove } from "../../../../components/ButtonRemove";
import { uppercaseToWords } from "../../../../utils/stringUtils";
import { isAdministratorOrHavePermissions } from "../../../../utils/permissions";
import { Loading } from "../../../../components/Loading/Loading";
import { getDate } from "../../../../utils/dateUtils";
import { Permission } from "../../../../behaviour/enums/Permission";
import { ButtonUpdate } from "../../../../components/ButtonUpdate";

const { Text } = Typography;

export const CalendarPage = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const calendarDays = useAppSelector(s => s.calendarDays.calendarDays)
    const selectedDate = useAppSelector(s => s.calendarDays.selectedDate)
    const loading = useAppSelector(s => s.calendarDays.loadingGet)

    useEffect(() => {
        const fromTo = getFromTo(selectedDate);
        dispatch(calendarDaysActions.getAsync({
            from: fromTo[0],
            to: fromTo[1]
        }));
    }, [])

    const getFromTo = (date: string): string[] => {
        let dateObj = new Date(date);
        const from = new Date(dateObj.setMonth(dateObj.getMonth() - 1));
        from.setDate(15);
        const to = new Date(dateObj.setMonth(dateObj.getMonth() + 2));
        to.setDate(15);
        return [getDate(from), getDate(to)]
    }

    const onSelect = (newDate: Moment) => {
        dispatch(calendarDaysActions.setSelectedDate(newDate.format("YYYY-MM-DD")));
    };

    const onPanelChange = (newDate: Moment) => {
        const fromTo = getFromTo(newDate.format("YYYY-MM-DD"));
        dispatch(calendarDaysActions.getAsync({
            from: fromTo[0],
            to: fromTo[1]
        }));
    };

    const dateCellRender = (current: Moment) => {
        let dayKindClass;
        const currentCalendarDay = calendarDays?.find(d => d.date === current.format("YYYY-MM-DD"));
        if (currentCalendarDay) {
            switch (currentCalendarDay?.kind) {
                case DayKind.DayOff:
                    dayKindClass = s.dayOff;
                    break;
                case DayKind.Holiday:
                    dayKindClass = s.holiday;
                    break;
                case DayKind.ShortDay:
                    dayKindClass = s.shortDay;
                    break;
            }
            return (
                <Link to={`days/${currentCalendarDay?.date}`} state={{ popup: location }}>
                    <div className={[s.day, dayKindClass].join(' ')}>
                        <div className={s.titleAndKind}>
                            <Text style={{ textAlign: 'center' }}>{currentCalendarDay?.title}</Text>
                            <Text style={{ fontSize: '12px' }}
                                type="secondary">{currentCalendarDay && uppercaseToWords(currentCalendarDay.kind)}</Text>
                        </div>
                        {isAdministratorOrHavePermissions([Permission.UpdateCalendar]) &&
                            <Row align={'bottom'} className={s.buttons}>
                                <Space size={3}>
                                    <ButtonUpdate to={`days/update/${currentCalendarDay?.date}`} popup={location} />
                                    <ButtonRemove to={`days/remove/${currentCalendarDay?.date}`} popup={location} />
                                </Space>
                            </Row>
                        }
                    </div>
                </Link>
            );
        }
        if (isAdministratorOrHavePermissions([Permission.UpdateCalendar]))
            return (
                <div className={s.day}>
                    <Row align={'bottom'} className={s.buttons}>
                        <ButtonCreate to={`days/create?date=${current.format('YYYY-MM-DD')}`} popup={location} />
                    </Row>
                </div>
            )
    }

    return (
        <div className={s.wrapperPage}>
            {loading && <div className={s.absoluteCenter}>
                <Loading />
            </div>}
            {isAdministratorOrHavePermissions([Permission.UpdateCalendar]) &&
                <Space size={3}>
                    <ButtonCreate to={'days/create'} popup={location} />
                    <ButtonRemove to={'days/remove'} popup={location} />
                </Space>
            }
            <Calendar
                value={moment(selectedDate)}
                onSelect={onSelect}
                onPanelChange={onPanelChange}
                // validRange={[moment('2021-01-25'), moment('2023-01-25')]}
                dateCellRender={dateCellRender}
            />
        </div>
    );
};