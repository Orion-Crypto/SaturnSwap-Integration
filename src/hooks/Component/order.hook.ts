import { queryClient } from '@/hooks/default';
import { OrderContainerType } from '@/types/Enums/OrderContainerType';
import { OrderFilterType } from '@/types/Enums/OrderFilterType';
import { OrderStatusFilterType } from '@/types/Enums/OrderStatusFilterType';
import { TradeFilterType } from '@/types/Enums/TradeFilterType';
import { useQuery } from '@tanstack/react-query';

const BASE_ORDER_KEY = 'order';
export const ORDER_KEY = [BASE_ORDER_KEY];
export const ORDER_CONTAINER_KEY = [BASE_ORDER_KEY, 'container'];
export const SHOW_ORDERS = [BASE_ORDER_KEY, 'show'];
export const ORDER_FILTER_KEY = [BASE_ORDER_KEY, 'order', 'filter'];
export const TRADE_FILTER_KEY = [BASE_ORDER_KEY, 'trade', 'filter'];
export const ORDER_STATUS_FILTER_KEY = [BASE_ORDER_KEY, 'order-status', 'filter'];

//---------------------------------------------------------------------------------------------------//
// Order Container Type
//---------------------------------------------------------------------------------------------------//
export const getOrderContainerType = () => queryClient.getQueryData(ORDER_CONTAINER_KEY);
export const setOrderContainerType = (orderContainerType: OrderContainerType) =>
    queryClient.setQueryData(ORDER_CONTAINER_KEY, orderContainerType);

export const useGetOrderContainerType = () =>
    useQuery({ queryKey: ORDER_CONTAINER_KEY, queryFn: () => getOrderContainerType() ?? OrderContainerType.YourOrders });
//---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------//
// All Order Functions
//---------------------------------------------------------------------------------------------------//
export const getShowOrders = () => queryClient.getQueryData(SHOW_ORDERS);
export const setShowOrders = (show: boolean) => queryClient.setQueryData(SHOW_ORDERS, show);
export const useGetShowOrders = () => useQuery({ queryKey: SHOW_ORDERS, queryFn: () => getShowOrders() ?? true });
//---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------//
// Order Filter Type
//---------------------------------------------------------------------------------------------------//
export const getOrderFilterType = () => queryClient.getQueryData(ORDER_FILTER_KEY);
export const setOrderFilterType = (orderFilterType: OrderFilterType) => queryClient.setQueryData(ORDER_FILTER_KEY, orderFilterType);

export const useGetOrderFilterType = () =>
    useQuery({ queryKey: ORDER_FILTER_KEY, queryFn: () => getOrderFilterType() ?? OrderFilterType.Market });
//---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------//
// Trade Filter Type
//---------------------------------------------------------------------------------------------------//
export const getTradeFilterType = () => queryClient.getQueryData(TRADE_FILTER_KEY);
export const setTradeFilterType = (tradeFilterType: TradeFilterType) => queryClient.setQueryData(TRADE_FILTER_KEY, tradeFilterType);

export const useGetTradeFilterType = () => useQuery({ queryKey: TRADE_FILTER_KEY, queryFn: () => getTradeFilterType() ?? TradeFilterType.All });
//---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------//
// Order Status Type
//---------------------------------------------------------------------------------------------------//
export const getOrderStatusFilterType = () => queryClient.getQueryData(ORDER_STATUS_FILTER_KEY);
export const setOrderStatusFilterType = (orderStatusFilterType: OrderStatusFilterType) =>
    queryClient.setQueryData(ORDER_STATUS_FILTER_KEY, orderStatusFilterType);

export const useGetOrderStatusFilterType = () =>
    useQuery({ queryKey: ORDER_STATUS_FILTER_KEY, queryFn: () => getOrderStatusFilterType() ?? OrderStatusFilterType.All });
//---------------------------------------------------------------------------------------------------//
