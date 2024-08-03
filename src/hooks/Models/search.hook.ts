import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';

export const BASE_SEARCH_KEY = 'search';
export const TOKEN_PROJECT_SEARCH_KEY = [BASE_SEARCH_KEY, 'token-project'];
export const POOL_SEARCH_KEY = [BASE_SEARCH_KEY, 'pool'];
export const POOL_UTXO_POOL_SEARCH_KEY = [BASE_SEARCH_KEY, 'pool-utxo', 'pool'];
export const SMART_CONTRACT_SEARCH_KEY = [BASE_SEARCH_KEY, 'smart-contract'];
export const LEADERBOARD_SEARCH_KEY = [BASE_SEARCH_KEY, 'leaderboard'];
export const LIFTOFF_PROJECT_SEARCH_KEY = [BASE_SEARCH_KEY, 'liftoff-project'];

//---------------------------------------------------------------------------------------------------//
// Has Search Value Functions
//---------------------------------------------------------------------------------------------------//
export const getSearchValue = (key: any) => queryClient.getQueryData(key);
export const setSearchValue = (key: any, searchValue: any) => queryClient.setQueryData(key, searchValue);
export const useGetSearchValue = (key: any) => useQuery({ queryKey: key, queryFn: () => getSearchValue(key), initialData: null });

export const getInputValue = (key: any) => queryClient.getQueryData(key);
export const setInputValue = (key: any, searchInput: any) => queryClient.setQueryData(key, searchInput);
export const useGetInputValue = (key: any) => useQuery({ queryKey: key, queryFn: () => getInputValue(key), initialData: null });
//---------------------------------------------------------------------------------------------------//
