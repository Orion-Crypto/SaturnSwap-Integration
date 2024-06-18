import { getGraphQLHeaders, graphQLClient } from '@/api/Api';
import { calculateStringFromParameters } from '@/api/GraphQL/Parameter';
import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';
import { gql } from 'graphql-request';

//---------------------------------------------------------------------------------------------------//
// Get Token Project Functions
//---------------------------------------------------------------------------------------------------//
export const queryTokenProject = async (parameters?: GraphQLParameters) => {
    graphQLClient.setHeaders(await getGraphQLHeaders());
    const response: any = await graphQLClient.request(
        gql`
            query {
                tokenProject(${calculateStringFromParameters(parameters)}) {
                    id
                    name
                    image
                    policy_id
                    asset_name
                    ticker
                    decimals
                    is_verified
                    supply
                    max_supply
                    token_project_stats {
                        token_project_id
                        tvl
                        volume_1d
                        user_fees_earned_1d
                        volume_7d
                        user_fees_earned_7d
                        volume_30d
                        user_fees_earned_30d
                        volume_all
                        user_fees_earned_all
                        price_change_1d
                        price_change_7d
                        price_change_30d
                    }
                }
            }
        `
    );
    const tokenProject: any = response?.tokenProject || {};
    return tokenProject;
};

export const queryTokenProjects = async (parameters?: GraphQLParameters) => {
    graphQLClient.setHeaders(await getGraphQLHeaders());
    const response: any = await graphQLClient.request(
        gql`
            query {
                tokenProjects(${calculateStringFromParameters(parameters)}) {
                    edges {
                        cursor
                        node {
                            id
                            name
                            image
                            policy_id
                            asset_name
                            ticker
                            decimals
                            precision
                            is_verified
                            supply
                            max_supply
                            price
                            token_project_stats {
                                token_project_id
                                tvl
                                volume_1d
                                user_fees_earned_1d
                                price_change_1d
                                volume_7d
                                user_fees_earned_7d
                                price_change_7d
                                volume_30d
                                user_fees_earned_30d
                                price_change_30d
                                volume_all
                                user_fees_earned_all
                            }
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
    const tokenProjects: any = response?.tokenProjects || {};
    return tokenProjects;
};

export const queryUserTokenProjects = async (userAddress: string, parameters?: GraphQLParameters) => {
    if (!userAddress) return null;

    graphQLClient.setHeaders(await getGraphQLHeaders());
    const input = { userAddress: userAddress };
    const response: any = await graphQLClient.request(
        gql`
            query UserTokenProject($userAddress: String!) {
                userTokenProjects(userAddress: $userAddress , ${calculateStringFromParameters(parameters)}) {
                    edges {
                        cursor
                        node {
                            id
                            name
                            image
                            policy_id
                            asset_name
                            ticker
                            decimals
                            is_verified
                            supply
                            max_supply
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
        `,
        input
    );
    const userTokenProjects: any = response?.userTokenProjects || {};
    return userTokenProjects;
};
//---------------------------------------------------------------------------------------------------//
