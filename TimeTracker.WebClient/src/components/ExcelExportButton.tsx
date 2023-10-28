import React, { FC, useEffect } from 'react';
import { Button } from "antd";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { excelExportActions } from "../modules/excelExport/store/excelExport.slice";
import { useAppSelector } from "../behaviour/store";

export const ExcelExportButton: FC = () => {

    return (
        <Button type={"primary"}>Excel export</Button>
    )
}