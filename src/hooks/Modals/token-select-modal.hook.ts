import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';

export const BASE_SELECTED_TOKEN_KEY = 'selected-token';
export const SELECTED_TOKEN_KEY = [BASE_SELECTED_TOKEN_KEY];

//---------------------------------------------------------------------------------------------------//
// Selected Token Functions
//---------------------------------------------------------------------------------------------------//
export const getSelectedToken = () => queryClient.getQueryData(SELECTED_TOKEN_KEY);
export const setSelectedToken = (token: any) => queryClient.setQueryData(SELECTED_TOKEN_KEY, token);
export const useGetSelectedToken = () => useQuery({ queryKey: SELECTED_TOKEN_KEY, queryFn: () => getSelectedToken(), initialData: null });
//---------------------------------------------------------------------------------------------------//
