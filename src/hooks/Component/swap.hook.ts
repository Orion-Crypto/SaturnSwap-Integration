import { SwapTokens } from '@/components/PageComponents/Swap/Utils/SwapUtils/SwapUtils';
import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';

const BASE_SWAP_KEY = 'swap';
export const SWAP_KEY = [BASE_SWAP_KEY];
export const SWAP_INFORMATION_KEY = [BASE_SWAP_KEY, 'information'];

//---------------------------------------------------------------------------------------------------//
// Swap Functions
//---------------------------------------------------------------------------------------------------//
export const getSwap = (): SwapTokens => queryClient.getQueryData(SWAP_KEY) as SwapTokens;
export const setSwap = (swap: SwapTokens) => queryClient.setQueryData(SWAP_KEY, swap);

export const useGetSwap = () => useQuery({ queryKey: SWAP_KEY, queryFn: () => getSwap() ?? null });
//---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------//
// Swap Information Functions
//---------------------------------------------------------------------------------------------------//
export const getSwapInformation = () => queryClient.getQueryData(SWAP_INFORMATION_KEY);
export const setSwapInformation = (swap: any) => queryClient.setQueryData(SWAP_INFORMATION_KEY, swap);
export const useGetSwapInformation = () => useQuery({ queryKey: SWAP_INFORMATION_KEY, queryFn: () => getSwap() ?? null });
//---------------------------------------------------------------------------------------------------//
