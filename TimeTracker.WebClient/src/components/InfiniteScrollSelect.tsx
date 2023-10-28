import { FC, useEffect, useState } from "react";
import { usersActions } from "../modules/users/store/users.slice";
import { Select } from "antd";
import * as React from "react";
import { User } from "../modules/users/graphQL/users.types";
import { useAppSelector } from "../behaviour/store";
import { useDispatch } from "react-redux";

type Props = {
    notFetchedUsers?: User[],
    onChange: (e: string[]) => void,
    initialValues?: string[]
}

export const InfiniteScrollSelect: FC<Props> = ({ notFetchedUsers, onChange, initialValues }) => {
    const dispatch = useDispatch()

    let usersInfinityLoad = useAppSelector(s => s.users.usersInfinityLoad)
    let usersForVacationLoading = useAppSelector(s => s.users.usersInfinityLoadLoading)
    let [usersForVacationEmail, setUsersForVacationEmail] = useState('')
    let [currentPage, setCurrentPage] = useState(0)
    let [usersPageSize, setUsersPageSize] = useState(10)

    useEffect(() => {
        dispatch(usersActions.fetchUsersInfinityLoad({
            filter: { email: '' },
            take: usersPageSize,
            skip: 0,
        }))
    }, [])

    return <Select
        className={'w-100'}
        mode="multiple"
        allowClear
        placeholder="Users"
        filterOption={false}
        value={initialValues}
        onChange={onChange}
        onPopupScroll={(e) => {
            let target = e.target as HTMLSelectElement
            if (!usersForVacationLoading && target.scrollTop + target.offsetHeight === target.scrollHeight) {
                if (currentPage < (usersInfinityLoad?.total || 0)) {
                    target.scrollTo(0, target.scrollHeight)
                    dispatch(usersActions.fetchUsersInfinityLoad({
                        filter: { email: usersForVacationEmail },
                        take: usersPageSize,
                        skip: currentPage + 1,
                    }))
                    setCurrentPage(currentPage + 1)
                }
            }
        }}
        onSearch={(email) => {
            setUsersForVacationEmail(email)
            dispatch(usersActions.fetchUsersInfinityLoad({
                filter: { email },
                take: usersPageSize,
                skip: 0,
            }))
            setCurrentPage(0)
        }}
    >
        {usersInfinityLoad?.entities.map((user) => (
            <Select.Option key={user.id} value={user.id}>
                {user.email}
            </Select.Option>
        ))}

        {notFetchedUsers?.map((user) => (
            <Select.Option key={user.id} value={user.id}>
                {user.email}
            </Select.Option>
        ))}
    </Select>
}