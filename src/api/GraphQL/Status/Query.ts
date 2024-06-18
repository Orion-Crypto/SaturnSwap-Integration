import { getGraphQLHeaders, graphQLClient } from '@/api/Api';
import { gql } from 'graphql-request';

//---------------------------------------------------------------------------------------------------//
// Get Parameters Function
//---------------------------------------------------------------------------------------------------//
export const queryStatus = async () => {
    graphQLClient.setHeaders(await getGraphQLHeaders());
    const response: any = await graphQLClient.request(gql`
        query {
            status {
                chain_percentage_day_ago
                chain_percentage_hour_ago
            }
        }
    `);
    const status = response?.status || {};
    return status;
};
//---------------------------------------------------------------------------------------------------//
