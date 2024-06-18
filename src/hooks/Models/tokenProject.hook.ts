import { getNextPageParam, getPreviousPageParam, setGraphQLParameters } from '@/api/GraphQL/Parameter';
import { queryTokenProject, queryTokenProjects, queryUserTokenProjects } from '@/api/GraphQL/TokenProject/Query';
import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const BASE_TOKEN_PROJECT_KEY = 'token-project';

export const BASE_USER_TOKEN_PROJECT_KEY = 'user-token-project';

//---------------------------------------------------------------------------------------------------//
// Pool Hooks and Functions
//---------------------------------------------------------------------------------------------------//
export const useGetTokenProjects = (graphQLParameters: GraphQLParameters = {}) =>
    useInfiniteQuery({
        queryKey: [BASE_TOKEN_PROJECT_KEY, 'infinite', graphQLParameters.where],
        queryFn: async ({ pageParam }) => {
            setGraphQLParameters(graphQLParameters, pageParam);
            return await queryTokenProjects(graphQLParameters);
        },
        initialPageParam: null,
        getNextPageParam: getNextPageParam,
        getPreviousPageParam: getPreviousPageParam,
        refetchOnWindowFocus: false,
    });
//---------------------------------------------------------------------------------------------------//
