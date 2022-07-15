import React, {FC} from 'react';
import {Link} from 'react-router-dom';
import {Button, Result} from 'antd';

type Props = {
    statusCode?: number,
}

export const Error: FC<Props> = ({statusCode}) => {
    switch (statusCode) {
        case 403:
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="You do not have permission."
                    extra={
                        <Link to={'/'}>
                            <Button type="primary">Home</Button>
                        </Link>
                    }
                />
            );
        default:
            return (
                <Result
                    status="404"
                    title="404"
                    subTitle="Page not found"
                    extra={
                        <Link to={'/'}>
                            <Button type="primary">Home</Button>
                        </Link>
                    }
                />
            );
    }
};
