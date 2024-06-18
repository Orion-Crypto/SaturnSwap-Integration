import { getNextPageParam, getPreviousPageParam, setGraphQLParameters } from '@/api/GraphQL/Parameter';
import { queryPools } from '@/api/GraphQL/Pool/Query';
import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';
import { useInfiniteQuery } from '@tanstack/react-query';

export const BASE_POOL_KEY = 'pool';

export const BASE_USER_POOL_KEY = 'user-pool';

//---------------------------------------------------------------------------------------------------//
// Pool Hooks and Functions
//---------------------------------------------------------------------------------------------------//
export const useGetPools = (graphQLParameters: GraphQLParameters = {}, enabled = true) =>
    useInfiniteQuery({
        queryKey: [BASE_POOL_KEY, 'infinite', graphQLParameters.where],
        queryFn: async ({ pageParam }) => {
            setGraphQLParameters(graphQLParameters, pageParam);
            return await queryPools(graphQLParameters);
        },
        initialPageParam: null,
        getNextPageParam: getNextPageParam,
        getPreviousPageParam: getPreviousPageParam,
        refetchOnWindowFocus: false,
        enabled,
    });

//---------------------------------------------------------------------------------------------------//
