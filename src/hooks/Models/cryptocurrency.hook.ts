import { queryCryptocurrency } from '@/api/GraphQL/Cryptocurrency/Query';
import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';
import { useQuery } from '@tanstack/react-query';

export const BASE_CRYPTOCURRENCY_KEY = 'cryptocurrency';

//---------------------------------------------------------------------------------------------------//
// Cryptocurrency Functions
//---------------------------------------------------------------------------------------------------//
export const useGetCryptocurrency = (graphQLParameters: GraphQLParameters = {}) =>
    useQuery({
        queryKey: [BASE_CRYPTOCURRENCY_KEY, 'detail', graphQLParameters.where],
        queryFn: async () => await queryCryptocurrency(graphQLParameters),
    });
//---------------------------------------------------------------------------------------------------//
