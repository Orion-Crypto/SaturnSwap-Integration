import { GraphQLClient } from 'graphql-request';

export const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_API_URL as string);

export const getGraphQLHeaders = async () => {
    const headers: any = {} as HeadersInit;
    try {
        // const jwt = '';
        // headers['Authorization'] = `Bearer ${jwt}`;

        return headers;
    } catch (error) {
        console.error(error);
        return headers;
    }
};
