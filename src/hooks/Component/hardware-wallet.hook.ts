import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';

const BASE_HARDWARE_WALLET_KEY = 'hard-ware-wallet';
export const IS_HARDWARE_WALLET_KEY = [BASE_HARDWARE_WALLET_KEY, 'is-hardware-wallet'];

//---------------------------------------------------------------------------------------------------//
// Info Tab Functions
//---------------------------------------------------------------------------------------------------//
export const getIsHardwareWallet = () => queryClient.getQueryData(IS_HARDWARE_WALLET_KEY);
export const setIsHardwareWallet = (isHardwareWallet: boolean) => queryClient.setQueryData(IS_HARDWARE_WALLET_KEY, isHardwareWallet);
export const useGetIsHardwareWallet = () => useQuery({ queryKey: IS_HARDWARE_WALLET_KEY, queryFn: () => getIsHardwareWallet() ?? false });
//---------------------------------------------------------------------------------------------------//
