import {DayKind} from "../../../graphQL/enums/DayKind";

export type CalendarDay = {
    id: string,
    date: string,
    title?: string | null,
    kind: DayKind,
    percentageWorkHours: number,
    createdAt: string,
    updatedAt: string,
}