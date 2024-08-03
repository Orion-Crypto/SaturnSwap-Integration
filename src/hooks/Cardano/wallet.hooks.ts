import { queryClient } from '@/hooks/default';
import { Wallet } from '@/types/Classes/wallet';
import { connectIfNotConnected } from '@/utils/cardano/connect';
import CardanoWallet from '@/utils/cardano/wallet';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const BASE_WALLET_KEY = 'wallet';
export const IS_CONNECTED_KEY = [BASE_WALLET_KEY, 'isConnected'];
export const CONNECTED_WALLET_KEY = [BASE_WALLET_KEY, 'connected'];

export const WALLET_ADDRESS_KEY = [BASE_WALLET_KEY, 'address'];
export const WALLET_BALANCE_KEY = (asset: string | null) => [BASE_WALLET_KEY, 'balance', asset];
export const WALLET_BALANCE_ALL_KEY = [BASE_WALLET_KEY, 'balance', 'all'];
export const WALLET_TRANSACT_KEY = [BASE_WALLET_KEY, 'transact'];

//---------------------------------------------------------------------------------------------------//
// Connected and Signed In Wallet Data Functions
//---------------------------------------------------------------------------------------------------//
export const getConnectedWallet = () => queryClient.getQueryData(CONNECTED_WALLET_KEY);
export const setConnectedWallet = async (wallet: Wallet | null) => queryClient.setQueryData(CONNECTED_WALLET_KEY, wallet);
export const useGetConnectedWallet = () => useQuery({ queryKey: CONNECTED_WALLET_KEY, queryFn: () => getConnectedWallet() ?? null });

// Used for testing
// export const useGetConnectedWallet = () =>
//     useQuery({
//         queryKey: CONNECTED_WALLET_KEY,
//         queryFn: () => {
//             return { address: 'addr1qyphwjngpr8e3wcllf0k7uqf9hf4h7anq3tpxknp2u0yudwj0dkyhedv7fk9w95gp7485ceghudarq6j8yp43uzh6n9ste76xq' };
//         },
//     });
//---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------//
// Wallet Hooks
//---------------------------------------------------------------------------------------------------//
export const useIsConnected = () => useQuery({ queryKey: IS_CONNECTED_KEY, queryFn: async () => await CardanoWallet.isConnected() });

export const useAutoConnect = (wallet: any) =>
    useEffect(() => {
        const connectWallet = async () => {
            if (!wallet?.address) {
                await connectIfNotConnected();
                queryClient.invalidateQueries({ queryKey: CONNECTED_WALLET_KEY });
            }
        };
        connectWallet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

// Only use this when you require event reloading for the wallet button
export const useGetAddress = () =>
    useQuery({
        queryKey: WALLET_ADDRESS_KEY,
        queryFn: async () => await CardanoWallet.getAddress(),
    });

// Used for testing
// export const useGetAddress = () =>
//     useQuery({
//         queryKey: WALLET_ADDRESS_KEY,
//         queryFn: async () => 'addr1qyphwjngpr8e3wcllf0k7uqf9hf4h7anq3tpxknp2u0yudwj0dkyhedv7fk9w95gp7485ceghudarq6j8yp43uzh6n9ste76xq',
//     }); // await CardanoWallet.getAddress() });

export const useGetBalance = (asset: string | null = null, decimals = 6, price: any = null) =>
    useQuery({ queryKey: WALLET_BALANCE_KEY(asset), queryFn: async () => await CardanoWallet.getBalance(asset, decimals, price) });

export const useGetAssetBalances = () =>
    useQuery({ queryKey: WALLET_BALANCE_ALL_KEY, queryFn: async () => await CardanoWallet.getAllAssetBalances() });

export const useGetCanTransact = () =>
    useQuery({
        queryKey: WALLET_TRANSACT_KEY,
        queryFn: async () => {
            const minimumBalance = 25;
            const balanceData: any = await CardanoWallet.getBalance();
            const spendBalance = balanceData?.showBalance ?? 0;
            return spendBalance && spendBalance >= minimumBalance;
        },
    });
//---------------------------------------------------------------------------------------------------//
