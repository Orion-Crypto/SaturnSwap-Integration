import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';

export const BASE_SEARCH_KEY = 'search';
export const TOKEN_PROJECT_SEARCH_KEY = [BASE_SEARCH_KEY, 'token-project'];
export const POOL_SEARCH_KEY = [BASE_SEARCH_KEY, 'pool'];

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
