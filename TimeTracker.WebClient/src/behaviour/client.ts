import {ApolloClient, from, InMemoryCache} from '@apollo/client';
import {schema} from './schema';
import {setContext} from '@apollo/client/link/context';
import {getJwtToken} from "../utils/localStorageUtils";
import {createUploadLink} from 'apollo-upload-client';
import {onError} from "@apollo/client/link/error";

const authLink = setContext((_, {headers}) => ({
    headers: {
        ...headers,
        authorization: getJwtToken() || '',
    },
}));

const httpLink = createUploadLink({
    uri: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'https://localhost:7041/graphql' : '/graphql',
});

export const client = new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
            notifyOnNetworkStatusChange: true,
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
            notifyOnNetworkStatusChange: true,
        },
    },
    typeDefs: schema
});
