import { getGraphQLHeaders, graphQLClient } from '@/api/Api';
import { calculateStringFromParameters } from '@/api/GraphQL/Parameter';
import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';
import { gql } from 'graphql-request';

//---------------------------------------------------------------------------------------------------//
// Get Token Project Functions
//---------------------------------------------------------------------------------------------------//
const poolQuery = `
    id
    name
    is_swap_active
    is_liquidity_active
    is_verified
    token_project_one {
        id
        name
        image
        policy_id
        asset_name
        decimals
        precision
        ticker
        price
    }
    token_project_two {
        id
        name
        image
        policy_id
        asset_name
        decimals
        precision
        ticker
        price
        description
        is_current_liftoff
        website
        twitter
        discord
        telegram
        token_project_stats {
            id
            market_cap
            volume_all
        }
        liftoff_project {
            id
            is_successful
            bonding_curve_success_time
        }
    }
    pool_stats {
        pool_id
        price
        highest_bid
        lowest_ask
        tvl
        volume_1d
        buy_volume_1d
        sell_volume_1d
        transactions_1d
        buys_1d
        sells_1d
        user_fees_earned_1d
        average_apy_1d
        volume_7d
        buy_volume_7d
        sell_volume_7d
        transactions_7d
        buys_7d
        sells_7d
        user_fees_earned_7d
        average_apy_7d
        volume_30d
        buy_volume_30d
        sell_volume_30d
        transactions_30d
        buys_30d
        sells_30d
        user_fees_earned_30d
        average_apy_30d
        volume_all
        buy_volume_all
        sell_volume_all
        transactions_all
        buys_all
        sells_all
        user_fees_earned_all
    }
    liftoff_project {
        id
        king_of_the_hill_time
        is_king_of_the_hill
        percent_complete
        is_successful
        bonding_curve_success_time
    }
`;

export const queryPool = async (id?: string | null, policyId?: string | null) => {
    if (!id && !policyId) return null;

    graphQLClient.setHeaders(await getGraphQLHeaders());
    const input = { id: id, policyId: policyId };
    const response: any = await graphQLClient.request(
        gql`
            query Pool($id: String, $policyId: String) {
                pool(id: $id, policyId: $policyId) {
                    ${poolQuery}
                }
            }
        `,
        input
    );
    const pool: any = response?.pool || {};
    return pool;
};

export const queryPools = async (parameters?: GraphQLParameters) => {
    graphQLClient.setHeaders(await getGraphQLHeaders());
    const response: any = await graphQLClient.request(
        gql`
            query {
                pools(${calculateStringFromParameters(parameters)}) {
                    edges {
                        cursor
                        node {
                            ${poolQuery}
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
    const pools: any = response?.pools || {};
    return pools;
};
//---------------------------------------------------------------------------------------------------//
