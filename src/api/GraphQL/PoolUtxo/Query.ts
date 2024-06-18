import { getGraphQLHeaders, graphQLClient } from '@/api/Api';
import { calculateStringFromParameters } from '@/api/GraphQL/Parameter';
import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';
import { gql } from 'graphql-request';

//---------------------------------------------------------------------------------------------------//
// Get Pool Utxo Functions
//---------------------------------------------------------------------------------------------------//
export const queryPoolUtxo = async (id: string) => {
    if (!id) return null;

    graphQLClient.setHeaders(await getGraphQLHeaders());
    const input = { id: id };
    const response: any = await graphQLClient.request(
        gql`
            query PoolUtxo($id: String!) {
                poolUtxo(id: $id) {
                    id
                }
            }
        `,
        input
    );
    const poolUtxo: any = response?.poolUtxo || {};
    return poolUtxo;
};

export const queryPoolUtxos = async (parameters?: GraphQLParameters) => {
    if (!parameters) return null;
    graphQLClient.setHeaders(await getGraphQLHeaders());
    const response: any = await graphQLClient.request(
        gql`
            query {
                poolUtxos(${calculateStringFromParameters(parameters)}) {
                    edges {
                        cursor
                        node {
                            id
                            owner_address
                            token_project_one
                            {
                                name
                                image
                                policy_id
                                asset_name
                                ticker
                                decimals
                            }
                            policy_id_buy
                            asset_name_buy
                            token_amount_buy
                            token_project_two
                            {
                                name
                                image
                                policy_id
                                asset_name
                                ticker
                                decimals
                            }
                            policy_id_sell
                            asset_name_sell
                            token_amount_sell
                            valid_before
                            price
                            active_status
                            active_type
                            active_status_timestamp
                            spend_tx_hash
                            spend_status
                            spend_type
                            spend_status_timestamp
                            split_token_amount_buy
                            split_token_amount_sell

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
    const poolUtxos: any = response?.poolUtxos || {};
    return poolUtxos;
};
//---------------------------------------------------------------------------------------------------//
