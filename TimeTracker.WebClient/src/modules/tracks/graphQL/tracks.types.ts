import { TrackKind } from "../../../behaviour/enums/TrackKind";
import { TrackCreation } from "../../../behaviour/enums/TrackCreation";

export type Track = {
    id: string
    userId: string,
    title: string,
    kind: TrackKind,
    creation: TrackCreation,
    editedBy: string,
    startTime: string,
    endTime: string,
    createdAt: string,
    updatedAt: string
}