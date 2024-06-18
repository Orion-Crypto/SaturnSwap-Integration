import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';
export const BASE_MOBILE_NAVBAR_KEY = 'navbar-mobile';
export const MOBILE_NAVBAR_SHOWING_KEY = [BASE_MOBILE_NAVBAR_KEY, 'showing'];

//---------------------------------------------------------------------------------------------------//
// Extended Functions
//---------------------------------------------------------------------------------------------------//
export const getIsMobileNavbarShowing = () => {
    return queryClient.getQueryData(MOBILE_NAVBAR_SHOWING_KEY);
};
export const setIsMobileNavbarShowing = (isShowing: boolean) => queryClient.setQueryData(MOBILE_NAVBAR_SHOWING_KEY, isShowing);

export const useGetIsMobileNavbarShowing = () =>
    useQuery({ queryKey: MOBILE_NAVBAR_SHOWING_KEY, queryFn: () => getIsMobileNavbarShowing() ?? false });
//---------------------------------------------------------------------------------------------------//
