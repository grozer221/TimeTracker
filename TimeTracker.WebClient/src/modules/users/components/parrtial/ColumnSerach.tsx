import { ColumnType } from "antd/es/table";
import { User } from "../../graphQL/users.types";
import React from "react";
import { FilterConfirmProps } from "antd/es/table/interface";
import { usersActions } from "../../store/users.slice";
import { Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../behaviour/store";

type DataIndex = keyof User

//getColumnSearchProps - generate dropdowns for filters wit input field
export const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<User> => {
    const dispatch = useDispatch()
    let filter = useAppSelector(s => s.users.filter)

    const handleSearch = (
        selectedKeys: React.Key[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex
    ) => {
        if (dataIndex != 'permissions' && dataIndex != 'role' && dataIndex != 'employment') {
            dispatch(usersActions.setFilter({ ...filter, [dataIndex]: selectedKeys[0] }))
        }
    };

    const handleReset = (confirm: (param?: FilterConfirmProps | undefined) => void,
        selectedKeys: React.Key[], dataIndex: DataIndex) => {
        dispatch(usersActions.setFilter({ ...filter, [dataIndex]: "" }))
    };

    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => {
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={(e) => {
                            if (selectedKeys) setSelectedKeys([])
                            handleReset(confirm, selectedKeys, dataIndex)
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        )
    }
}