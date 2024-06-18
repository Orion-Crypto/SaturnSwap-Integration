import { getGraphQLHeaders, graphQLClient } from '@/api/Api';
import { calculateStringFromParameters } from '@/api/GraphQL/Parameter';
import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';
import { gql } from 'graphql-request';

//---------------------------------------------------------------------------------------------------//
// Get OrderBook Pool Utxo Functions
//---------------------------------------------------------------------------------------------------//
export const queryOrderBookSellPoolUtxos = async (address: string, parameters?: GraphQLParameters) => {
    if (!parameters) return null;
    graphQLClient.setHeaders(await getGraphQLHeaders());

    const parametersString = `address: "${address}", ${calculateStringFromParameters(parameters)}`;
    const response: any = await graphQLClient.request(
        gql`
            query {
                orderBookSellPoolUtxos(${parametersString}) {
                    edges {
                        cursor
                        node {
                            pool_id
                            price
                            token_amount_sell
                            token_amount_buy
                            count
                        }
                    }
                    pageInfo {
                        startCursor
                        endCursor
                        hasNextPage
                        hasPreviousPage
                    }
                    totalCount
                }
            }
        `
    );
    const orderBookSellPoolUtxos: any = response?.orderBookSellPoolUtxos || {};
    return orderBookSellPoolUtxos;
};

export const queryOrderBookBuyPoolUtxos = async (address: string, parameters?: GraphQLParameters) => {
    if (!address || !parameters) return null;
    graphQLClient.setHeaders(await getGraphQLHeaders());

    const parametersString = `address: "${address}", ${calculateStringFromParameters(parameters)}`;
    const response: any = await graphQLClient.request(
        gql`
            query {
                orderBookBuyPoolUtxos(${parametersString}) {
                    edges {
                        cursor
                        node {
                            pool_id
                            price
                            token_amount_sell
                            token_amount_buy
                            count
                        }
                    }
                    pageInfo {
                        startCursor
                        endCursor
                        hasNextPage
                        hasPreviousPage
                    }
                    totalCount
                }
            }
        `
    );
    const orderBookBuyPoolUtxos: any = response?.orderBookBuyPoolUtxos || {};
    return orderBookBuyPoolUtxos;
};
//---------------------------------------------------------------------------------------------------//
