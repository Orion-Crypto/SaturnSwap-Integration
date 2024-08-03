import { queryClient } from '@/hooks/default';
import { SlippageType } from '@/types/Enums/SlippageType';
import { useQuery } from '@tanstack/react-query';

const BASE_SLIPPAGE_KEY = 'slippage';
export const SLIPPAGE_TYPE_KEY = [BASE_SLIPPAGE_KEY, 'type'];
export const SLIPPAGE_VALUE_KEY = [BASE_SLIPPAGE_KEY, 'value'];

export const getSlippageType = () => queryClient.getQueryData(SLIPPAGE_TYPE_KEY);
export const setSlippageType = (slippageType: SlippageType) => queryClient.setQueryData(SLIPPAGE_TYPE_KEY, slippageType);

export const useGetSlippageType = () => useQuery({ queryKey: SLIPPAGE_TYPE_KEY, queryFn: () => getSlippageType() ?? SlippageType.Number });

export const getSlippageValue = () => queryClient.getQueryData(SLIPPAGE_VALUE_KEY);
export const setSlippageValue = (slippage: any) => queryClient.setQueryData(SLIPPAGE_VALUE_KEY, slippage);

export const useGetSlippageValue = () => useQuery({ queryKey: SLIPPAGE_VALUE_KEY, queryFn: () => getSlippageValue() ?? 2 });
