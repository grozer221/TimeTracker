import React, { CSSProperties } from "react";
import { DayKind } from "../behaviour/enums/DayKind";
import { Moment } from "moment";
import { CalendarDay } from "../modules/calendarDays/graphQL/calendarDays.types";
import { Tooltip } from "antd";
import { uppercaseToWords } from "../utils/stringUtils";

export const dateRender = (current: Moment, calendarDays: CalendarDay[]) => {
    const style: CSSProperties = {};
    const currentCalendarDay = calendarDays.find(d => d.date === current.format("YYYY-MM-DD"));
    if (currentCalendarDay) {
        switch (currentCalendarDay.kind) {
            case DayKind.DayOff:
                style.border = '2px solid #dcdde1';
                break;
            case DayKind.Holiday:
                style.border = '2px solid #e84118';
                style.borderRadius = '50%';
                break;
            case DayKind.ShortDay:
                style.border = '2px solid #fbc531';
                style.borderRadius = '50%';
                break;
        }
    }
    return (
        <Tooltip
            title={currentCalendarDay && `${currentCalendarDay.title || ''} (${uppercaseToWords(currentCalendarDay.kind)})`}
        >
            <div className="ant-picker-cell-inner" style={style}>
                {current.date()}
            </div>
        </Tooltip>

    );
}