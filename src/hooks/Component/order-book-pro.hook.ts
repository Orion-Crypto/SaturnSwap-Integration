import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';

export const BASE_ORDER_BOOK_PRO_KEY = 'order-book-pro';

export const SHOW_ORDER_BOOK_PRO = [BASE_ORDER_BOOK_PRO_KEY, 'show'];

//---------------------------------------------------------------------------------------------------//
// Info Tab Functions
//---------------------------------------------------------------------------------------------------//
export const getShowOrderBookPro = () => queryClient.getQueryData(SHOW_ORDER_BOOK_PRO);
export const setShowOrderBookPro = (show: boolean) => queryClient.setQueryData(SHOW_ORDER_BOOK_PRO, show);
export const useGetShowOrderBookPro = () => useQuery({ queryKey: SHOW_ORDER_BOOK_PRO, queryFn: () => getShowOrderBookPro() ?? true });
//---------------------------------------------------------------------------------------------------//
