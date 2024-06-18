import { getGraphQLHeaders, graphQLClient } from '@/api/Api';
import { calculateStringFromParameters } from '@/api/GraphQL/Parameter';
import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';
import { gql } from 'graphql-request';

//---------------------------------------------------------------------------------------------------//
// Get Cryptocurrency Functions
//---------------------------------------------------------------------------------------------------//
export const queryCryptocurrency = async (parameters?: GraphQLParameters) => {
    graphQLClient.setHeaders(await getGraphQLHeaders());
    const response: any = await graphQLClient.request(
        gql`
            query {
                cryptocurrency(${calculateStringFromParameters(parameters)}) {
                    id
                    blockchain
                    name
                    symbol
                    cmc_rank
                    price
                    volume_24h
                    volume_change_24h
                    percent_change_1h
                    percent_change_24h
                    percent_change_7d
                    percent_change_30d
                    market_cap
                    market_cap_dominance
                    fully_diluted_market_cap
                    cmc_last_updated
                }
            }
        `
    );
    const cryptocurrency: any = response?.cryptocurrency;
    return cryptocurrency;
};

//---------------------------------------------------------------------------------------------------//
