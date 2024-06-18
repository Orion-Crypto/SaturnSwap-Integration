import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';

const BASE_SLIPPAGE_KEY = 'slippage';
export const SLIPPAGE_TYPE_KEY = [BASE_SLIPPAGE_KEY, 'type'];
export const SLIPPAGE_VALUE_KEY = [BASE_SLIPPAGE_KEY, 'value'];

export const getSlippageType = () => queryClient.getQueryData(SLIPPAGE_TYPE_KEY);
export const setSlippageType = (slippage: string) => queryClient.setQueryData(SLIPPAGE_TYPE_KEY, slippage);

export const useGetSlippageType = () => useQuery({ queryKey: SLIPPAGE_TYPE_KEY, queryFn: () => getSlippageType() ?? 'Auto' });

export const getSlippageValue = () => queryClient.getQueryData(SLIPPAGE_VALUE_KEY);
export const setSlippageValue = (slippage: any) => queryClient.setQueryData(SLIPPAGE_VALUE_KEY, slippage);

export const useGetSlippageValue = () => useQuery({ queryKey: SLIPPAGE_VALUE_KEY, queryFn: () => getSlippageValue() ?? null });
