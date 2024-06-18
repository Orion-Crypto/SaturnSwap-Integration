import { queryClient } from '@/hooks/default';
import { InfoData } from '@/types/Classes/info';
import { useQuery } from '@tanstack/react-query';

const BASE_INFO_TAB_KEY = 'info-tab';
export const INFO_TAB_KEY = [BASE_INFO_TAB_KEY];

//---------------------------------------------------------------------------------------------------//
// Info Tab Functions
//---------------------------------------------------------------------------------------------------//
export const getInfoTab = () => queryClient.getQueryData(INFO_TAB_KEY);
export const setInfoTab = (info: InfoData) => queryClient.setQueryData(INFO_TAB_KEY, info);
export const useGetInfoTab = () => useQuery({ queryKey: INFO_TAB_KEY, queryFn: () => getInfoTab() ?? {} });
//---------------------------------------------------------------------------------------------------//
