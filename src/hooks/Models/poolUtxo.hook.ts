import { getNextPageParam, getPreviousPageParam, setGraphQLParameters } from '@/api/GraphQL/Parameter';
import { queryPoolUtxo, queryPoolUtxos } from '@/api/GraphQL/PoolUtxo/Query';
import { queryOrderBookBuyPoolUtxos, queryOrderBookSellPoolUtxos } from '@/api/GraphQL/PoolUtxo/QueryOrderBook';
import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const BASE_POOL_UTXO_KEY = 'pool';
export const ORDER_BOOK_POOL_UTXO_KEY = 'order_book';
export const ACTIVITY_FEED_POOL_UTXO_KEY = 'activity_feed';

//---------------------------------------------------------------------------------------------------//
// Pool Hooks and Functions
//---------------------------------------------------------------------------------------------------//
export const useGetPoolUtxos = (graphQLParameters: GraphQLParameters = {}, enabled = true) =>
    useInfiniteQuery({
        queryKey: [BASE_POOL_UTXO_KEY, 'infinite', graphQLParameters.where],
        queryFn: async ({ pageParam }) => {
            if (!enabled) return null;
            setGraphQLParameters(graphQLParameters, pageParam);
            return await queryPoolUtxos(graphQLParameters);
        },
        initialPageParam: null,
        getNextPageParam: getNextPageParam,
        getPreviousPageParam: getPreviousPageParam,
        refetchOnWindowFocus: false,
        enabled,
    });

//---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------//
// Order Book Pool Hooks and Functions
//---------------------------------------------------------------------------------------------------//
export const useGetOrderBookSellPoolUtxos = (address: string, graphQLParameters: GraphQLParameters = {}, enabled = true) =>
    useInfiniteQuery({
        queryKey: [ORDER_BOOK_POOL_UTXO_KEY, 'infinite', 'LIMIT_SELL_ORDER', address, graphQLParameters.where],
        queryFn: async ({ pageParam }) => {
            if (!enabled) return null;
            setGraphQLParameters(graphQLParameters, pageParam);
            return await queryOrderBookSellPoolUtxos(address, graphQLParameters);
        },
        initialPageParam: null,
        getNextPageParam: getNextPageParam,
        getPreviousPageParam: getPreviousPageParam,
        refetchOnWindowFocus: false,
        enabled,
    });

export const useGetOrderBookBuyPoolUtxos = (address: string, graphQLParameters: GraphQLParameters = {}, enabled = true) =>
    useInfiniteQuery({
        queryKey: [ORDER_BOOK_POOL_UTXO_KEY, 'infinite', 'LIMIT_BUY_ORDER', address, graphQLParameters.where],
        queryFn: async ({ pageParam }) => {
            if (!enabled) return null;
            setGraphQLParameters(graphQLParameters, pageParam);
            return await queryOrderBookBuyPoolUtxos(address, graphQLParameters);
        },
        initialPageParam: null,
        getNextPageParam: getNextPageParam,
        getPreviousPageParam: getPreviousPageParam,
        refetchOnWindowFocus: false,
        enabled,
    });
//---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------//
// Activity Feed Pool Hooks and Functions
//---------------------------------------------------------------------------------------------------//
export const useGetActivityFeedPoolUtxos = (graphQLParameters: GraphQLParameters = {}, enabled = true) =>
    useInfiniteQuery({
        queryKey: [ACTIVITY_FEED_POOL_UTXO_KEY, 'infinite', graphQLParameters.where],
        queryFn: async ({ pageParam }) => {
            setGraphQLParameters(graphQLParameters, pageParam);
            return await queryPoolUtxos(graphQLParameters);
        },
        initialPageParam: null,
        getNextPageParam: getNextPageParam,
        getPreviousPageParam: getPreviousPageParam,
        refetchOnWindowFocus: false,
        enabled,
    });

//---------------------------------------------------------------------------------------------------//
