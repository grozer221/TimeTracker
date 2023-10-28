import { VacationRequestStatus } from "../behaviour/enums/VacationRequestStatus";
import { Tag } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { uppercaseToWords } from "../utils/stringUtils";

export const vacationRequestStatusToTag = (status: VacationRequestStatus) => {
    switch (status) {
        case VacationRequestStatus.New:
            return <Tag icon={<ClockCircleOutlined />} color="processing">{uppercaseToWords(status)}</Tag>
        case VacationRequestStatus.Approved:
            return <Tag icon={<CheckCircleOutlined />} color="success">{uppercaseToWords(status)}</Tag>
        case VacationRequestStatus.NotApproved:
            return <Tag icon={<CloseCircleOutlined />} color="error">{uppercaseToWords(status)}</Tag>
    }
}