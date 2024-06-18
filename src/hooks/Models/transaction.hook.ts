import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';

export const SIGN_SELECTION_KEY = ['transaction', 'sign', 'count'];

//---------------------------------------------------------------------------------------------------//
// Sign Selection Functions
//---------------------------------------------------------------------------------------------------//
export const getSignatureCount = () => {
    return queryClient.getQueryData(SIGN_SELECTION_KEY);
};
export const setSignatureCount = (signatureCount: number | null) => queryClient.setQueryData(SIGN_SELECTION_KEY, signatureCount);

export const useGetSignatureCount = () => useQuery({ queryKey: SIGN_SELECTION_KEY, queryFn: () => getSignatureCount() ?? null });
//---------------------------------------------------------------------------------------------------//
