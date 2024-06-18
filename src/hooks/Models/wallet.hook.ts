import CardanoWallet from '@/utils/cardano/wallet';
import { useQuery } from '@tanstack/react-query';

export const BASE_WALLET_KEY = 'wallet';
export const WALLET_BALANCE_KEY = (asset: string | null) => [BASE_WALLET_KEY, 'balance', asset];

//---------------------------------------------------------------------------------------------------//
// Wallet Hooks and Functions
//---------------------------------------------------------------------------------------------------//
export const useGetBalance = (asset: string | null = null, decimals = 6) =>
    useQuery({ queryKey: WALLET_BALANCE_KEY(asset), queryFn: async () => await CardanoWallet.getBalance(asset, decimals) });

//---------------------------------------------------------------------------------------------------//
