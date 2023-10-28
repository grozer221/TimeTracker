import { VacationRequestStatus } from "../../../behaviour/enums/VacationRequestStatus";
import { User } from "../../users/graphQL/users.types";

export type VacationRequest = {
    id: string,
    dateStart: string,
    dateEnd: string,
    comment?: string,
    status: VacationRequestStatus,
    userId: string,
    user: User,
    createdAt: string,
    updatedAt: string,
}