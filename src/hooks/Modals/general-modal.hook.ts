import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';

const MODAL_IS_OPEN_KEY = (type: string) => ['modal', 'is-open', type];

// General Modals
export const WALLET_IS_OPEN_MODAL_KEY = MODAL_IS_OPEN_KEY('wallet');
export const TOKEN_SELECT_IS_OPEN_MODAL_KEY = MODAL_IS_OPEN_KEY('token-select');
export const POOL_SELECT_IS_OPEN_MODAL_KEY = MODAL_IS_OPEN_KEY('pool-select');
export const TRANSACTION_SUCCESS_IS_OPEN_MODAL_KEY = MODAL_IS_OPEN_KEY('transaction-success');

export const MODAL_DATA_KEY = ['modal', 'data'];
export const EXIT_MODAL_KEY = ['modal', 'exit'];

//---------------------------------------------------------------------------------------------------//
// IsOpen Modal Functions
//---------------------------------------------------------------------------------------------------//
export const getIsOpenModal = (key: any) => {
    return queryClient.getQueryData(key);
};
export const setIsOpenModal = (key: any, isOpen: boolean) => queryClient.setQueryData(key, isOpen);

export const useGetIsOpenModal = (key: any) => useQuery({ queryKey: key, queryFn: () => getIsOpenModal(key) ?? false });

//---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------//
// Pool Data Functions
//---------------------------------------------------------------------------------------------------//
export const getModalData = () => queryClient.getQueryData(MODAL_DATA_KEY);
export const setModalData = (data: any) => queryClient.setQueryData(MODAL_DATA_KEY, data);
export const useGetModalData = () => useQuery({ queryKey: MODAL_DATA_KEY, queryFn: () => getModalData() ?? null });
//---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------//
// Animation State Functions
//---------------------------------------------------------------------------------------------------//
export const getExitingModal = () => queryClient.getQueryData(EXIT_MODAL_KEY);
export const setExitingModal = (exiting: boolean) => queryClient.setQueryData(EXIT_MODAL_KEY, exiting);
export const useGetExitingModal = () => useQuery({ queryKey: EXIT_MODAL_KEY, queryFn: () => getExitingModal() ?? false });
//---------------------------------------------------------------------------------------------------//
