import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';

export const BASE_ORDER_BOOK_KEY = 'order-book';

export const SHOW_ORDER_BOOK_SWAP = [BASE_ORDER_BOOK_KEY, 'swap', 'show'];
export const SHOW_ORDER_BOOK_LIQUIDITY = [BASE_ORDER_BOOK_KEY, 'liquidity', 'show'];
export const SHOW_ORDER_BOOK_PRO = [BASE_ORDER_BOOK_KEY, 'pro', 'show'];

//---------------------------------------------------------------------------------------------------//
// Orderbook Swap Functions
//---------------------------------------------------------------------------------------------------//
export const getShowOrderBookSwap = () => queryClient.getQueryData(SHOW_ORDER_BOOK_SWAP);
export const setShowOrderBookSwap = (show: boolean) => queryClient.setQueryData(SHOW_ORDER_BOOK_SWAP, show);
export const useGetShowOrderBookSwap = () => useQuery({ queryKey: SHOW_ORDER_BOOK_SWAP, queryFn: () => getShowOrderBookSwap() ?? false });
//---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------//
// Orderbook Liquidity Functions
//---------------------------------------------------------------------------------------------------//
export const getShowOrderBookLiquidity = () => queryClient.getQueryData(SHOW_ORDER_BOOK_LIQUIDITY);
export const setShowOrderBookLiquidity = (show: boolean) => queryClient.setQueryData(SHOW_ORDER_BOOK_LIQUIDITY, show);
export const useGetShowOrderBookLiquidity = () =>
    useQuery({ queryKey: SHOW_ORDER_BOOK_LIQUIDITY, queryFn: () => getShowOrderBookLiquidity() ?? false });
//---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------//
// Orderbook Pro Functions
//---------------------------------------------------------------------------------------------------//
export const getShowOrderBookPro = () => queryClient.getQueryData(SHOW_ORDER_BOOK_PRO);
export const setShowOrderBookPro = (show: boolean) => queryClient.setQueryData(SHOW_ORDER_BOOK_PRO, show);
export const useGetShowOrderBookPro = () => useQuery({ queryKey: SHOW_ORDER_BOOK_PRO, queryFn: () => getShowOrderBookPro() ?? true });
//---------------------------------------------------------------------------------------------------//
