import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';

const BASE_TRANSACTION_KEY = 'transaction';
export const SUCCESS_TRANSACTION_KEY = [BASE_TRANSACTION_KEY, 'success'];

export const getTransactionIds = () => queryClient.getQueryData(SUCCESS_TRANSACTION_KEY);
export const setTransactionIds = (transaction: any) => queryClient.setQueryData(SUCCESS_TRANSACTION_KEY, transaction);
export const useGetTransactionIds = () => useQuery({ queryKey: SUCCESS_TRANSACTION_KEY, queryFn: () => getTransactionIds() ?? null });
