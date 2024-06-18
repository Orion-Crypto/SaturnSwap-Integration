import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';

export const BASE_SELECTED_POOL_KEY = 'selected-pool';
export const SELECTED_POOL_KEY = [BASE_SELECTED_POOL_KEY];

//---------------------------------------------------------------------------------------------------//
// Selected Pool Functions
//---------------------------------------------------------------------------------------------------//
export const getSelectedPool = () => queryClient.getQueryData(SELECTED_POOL_KEY);
export const setSelectedPool = (pool: any) => queryClient.setQueryData(SELECTED_POOL_KEY, pool);
export const useGetSelectedPool = () => useQuery({ queryKey: SELECTED_POOL_KEY, queryFn: () => getSelectedPool(), initialData: null });
//---------------------------------------------------------------------------------------------------//
