import { OrderFilterType } from '@/types/Enums/OrderFilterType';
import { OrderStatusFilterType } from '@/types/Enums/OrderStatusFilterType';
import { TradeFilterType } from '@/types/Enums/TradeFilterType';
import { getNikePoolId } from '@/utils/hostname';

export const CalculatePercent = (amount: number) => {
    if (amount >= 100000) {
        return 100;
    } else if (amount >= 50000) {
        return 90;
    } else if (amount >= 25000) {
        return 80;
    } else if (amount >= 10000) {
        return 70;
    } else if (amount >= 5000) {
        return 60;
    } else if (amount >= 2500) {
        return 50;
    } else if (amount >= 1000) {
        return 40;
    } else if (amount >= 500) {
        return 30;
    } else if (amount >= 30) {
        return 20;
    } else if (amount >= 100) {
        return 10;
    } else if (amount >= 50) {
        return 5;
    }
    return 2;
};

export const getOrderContainerWidths = (isPro: boolean) => {
    if (isPro) {
        const columnSizes = {
            timeSize: 'w-24',
            pairSize: 'w-56',
            typeSize: 'w-32',
            sizeAdaSize: 'w-36',
            sizeTokenSize: 'w-36',
            priceSize: 'w-36',
            orderTypeSize: 'w-32',
            statusSize: 'w-28',
            actionSize: 'w-16',
        };
        return columnSizes;
    } else {
        const columnSizes = {
            timeSize: 'w-28',
            pairSize: 'w-56',
            typeSize: 'w-36',
            sizeAdaSize: 'w-40',
            sizeTokenSize: 'w-40',
            priceSize: 'w-36',
            orderTypeSize: 'w-36',
            statusSize: 'w-28',
            actionSize: 'w-28',
        };
        return columnSizes;
    }
};

export const getOrderType = (order: any, address?: string) => {
    const isLimit = order.active_status === 'COMPLETE' && order.spend_status !== 'PENDING' && order.spend_status !== 'COMPLETE';
    const isLimitPending = order.active_status === 'PENDING';
    const isCancel =
        order.active_status === 'COMPLETE' &&
        order.spend_type === 'CANCELLED' &&
        (order.spend_status === 'PENDING' || order.spend_status === 'COMPLETE');

    if (isLimit || isLimitPending) {
        return 'Limit';
    } else if (isCancel) {
        return 'Cancel';
    }

    // Determine if a a spent order is your limit order
    const isUserAddress = !!address && order.user_address === address;
    const isSpendUserAddress = !!address && order.spend_user_address === address;
    if (isUserAddress && !isSpendUserAddress) {
        return 'Limit';
    } else if (isUserAddress && isSpendUserAddress) {
        return 'Both';
    }

    return 'Market';
};

export const getStatus = (order: any) => {
    if (order.active_status === 'PENDING') {
        return 'Pending';
    }

    if (order.active_status === 'COMPLETE' && order.spend_status === 'PENDING') {
        return 'Pending';
    }

    if (order.active_status === 'COMPLETE' && order.spend_status !== 'Pending' && order.spend_status !== 'COMPLETE') {
        return 'Active';
    }

    const isComplete = order.active_status === 'COMPLETE' && order.spend_status === 'COMPLETE';
    if (isComplete && order.spend_type === 'CANCELLED') {
        return 'Cancelled';
    }

    if (isComplete) {
        return 'Complete';
    }

    return 'Complete';
};

export const FilterOrders = (
    tradeFilterType: TradeFilterType,
    orderFilterType: OrderFilterType,
    orderStatusFilterType: OrderStatusFilterType,
    address: string | null = null,
    search: string | null = null,
    isNike: boolean = false,
    pool: any = null,
    isLiftoff: boolean = false
) => {
    if (!!address) return FilterYourOrders(tradeFilterType, orderFilterType, orderStatusFilterType, address, search, isNike);

    return FilterAllOrders(tradeFilterType, orderFilterType, orderStatusFilterType, isNike, pool, isLiftoff);
};

// Order Functions
export const FilterAllOrders = (
    tradeFilterType: TradeFilterType,
    orderFilterType: OrderFilterType,
    orderStatusFilterType: OrderStatusFilterType,
    isNike: boolean = false,
    pool: any = null,
    isLiftoff: boolean = false
) => {
    let base: any = [];

    const nikePoolId = getNikePoolId();
    let poolFilter = isNike && !isLiftoff ? `pool_id: { eq: "${nikePoolId}" }` : '';

    // Don't include incomplete liftoff projects
    let liftoffFilter = '';
    if (!isLiftoff) {
        liftoffFilter = `token_project_two: { is_current_liftoff: { eq: false } } `;
    }

    if (pool && isLiftoff) {
        poolFilter = `pool_id: { eq: "${pool.id}" }`;
        liftoffFilter = '';
    }

    // Transaction Filter
    const transactionFilter = 'transaction_status_timestamp: { neq: null }';

    // Order Filters
    const allOrderFilter = 'order_type: { in: [LIMIT_ORDER, MARKET_ORDER] }';
    const limitOrderFilter = 'order_type: { eq: LIMIT_ORDER }';
    const marketOrderFilter = 'order_type: { eq: MARKET_ORDER }';

    // Trade Filters
    const allTradeFilter = 'trade_type: { in: [BUY, SELL] }';
    const buyTradeFilter = 'trade_type: { eq: BUY }';
    const sellTradeFilter = 'trade_type: { eq: SELL }';

    // Status Filters
    const completeOrPendingFilter = 'transaction_status: { in: [PENDING, COMPLETE] }';
    const completeFilter = 'transaction_status: { eq: COMPLETE }';
    const pendingFilter = 'transaction_status: { eq: PENDING }';
    const cancelFilter = 'transaction_status: { eq: CANCELLED }';

    // Compose Filters
    let orderFilter = allOrderFilter;
    if (orderFilterType === OrderFilterType.Limit) {
        orderFilter = limitOrderFilter;
    } else if (orderFilterType === OrderFilterType.Market) {
        orderFilter = marketOrderFilter;
    }

    let tradeFilter = allTradeFilter;
    if (tradeFilterType === TradeFilterType.Buy) {
        tradeFilter = buyTradeFilter;
    } else if (tradeFilterType === TradeFilterType.Sell) {
        tradeFilter = sellTradeFilter;
    }

    let orderStatusFilter = completeOrPendingFilter;
    if (orderStatusFilterType === OrderStatusFilterType.Complete) {
        orderStatusFilter = completeFilter;
    } else if (orderStatusFilterType === OrderStatusFilterType.Pending) {
        orderStatusFilter = pendingFilter;
    } else if (orderStatusFilterType === OrderStatusFilterType.Cancelled) {
        orderStatusFilter = cancelFilter;
    }

    base.push(`${liftoffFilter}`);
    base.push(`${poolFilter}`);
    base.push(`${orderFilter}`);
    base.push(`${tradeFilter}`);
    base.push(`${orderStatusFilter}`);
    base.push(`${transactionFilter}`);

    const filter = `{ ${base.join(', ')} }`;
    return filter;
};

export const FilterYourOrders = (
    tradeFilterType: TradeFilterType,
    orderFilterType: OrderFilterType,
    orderStatusFilterType: OrderStatusFilterType,
    address: string | null,
    search: string | null,
    isNike: boolean = false
) => {
    let base: any = [];

    const nikePoolId = getNikePoolId();

    const poolFilter = isNike ? `pool_id: { eq: "${nikePoolId}" }` : '';

    // Address Filters
    const userAddressFilter = `user_address: { eq: "${address}" }`;
    const spendUserAddressFilter = `spend_user_address: { eq: "${address}" }`;
    const allAddressFilter = `or: [ { ${userAddressFilter} }, { ${spendUserAddressFilter} } ]`;

    // Transaction Filter
    const transactionFilter = 'transaction_status_timestamp: { neq: null }';

    // Order Filters
    const allOrderFilter = 'order_type: { in: [LIMIT_ORDER, MARKET_ORDER] }';
    const limitOrderFilter = 'order_type: { eq: LIMIT_ORDER }';
    const marketOrderFilter = 'order_type: { eq: MARKET_ORDER }';

    // Trade Filters
    const allTradeFilter = 'trade_type: { in: [BUY, SELL] }';
    const buyTradeFilter = 'trade_type: { eq: BUY }';
    const sellTradeFilter = 'trade_type: { eq: SELL }';

    // Status Filters
    const completeOrPendingFilter = 'transaction_status: { in: [PENDING, COMPLETE] }';
    const completeFilter = 'transaction_status: { eq: COMPLETE }';
    const pendingFilter = 'transaction_status: { eq: PENDING }';
    const cancelFilter = 'transaction_status: { eq: CANCELLED }';

    // Compose Filters
    let addressFilter = allAddressFilter;

    let orderFilter = allOrderFilter;
    if (orderFilterType === OrderFilterType.Limit) {
        orderFilter = limitOrderFilter;
        addressFilter = userAddressFilter;
    } else if (orderFilterType === OrderFilterType.Market) {
        orderFilter = marketOrderFilter;
        addressFilter = spendUserAddressFilter;
    }

    let tradeFilter = allTradeFilter;
    if (tradeFilterType === TradeFilterType.Buy) {
        tradeFilter = buyTradeFilter;
    } else if (tradeFilterType === TradeFilterType.Sell) {
        tradeFilter = sellTradeFilter;
    }

    let orderStatusFilter = completeOrPendingFilter;
    if (orderStatusFilterType === OrderStatusFilterType.Complete) {
        orderStatusFilter = completeFilter;
    } else if (orderStatusFilterType === OrderStatusFilterType.Pending) {
        orderStatusFilter = pendingFilter;
    } else if (orderStatusFilterType === OrderStatusFilterType.Cancelled) {
        orderStatusFilter = cancelFilter;
    }

    base.push(`${poolFilter}`);
    base.push(`${addressFilter}`);
    base.push(`${orderFilter}`);
    base.push(`${tradeFilter}`);
    base.push(`${orderStatusFilter}`);
    base.push(`${transactionFilter}`);
    base.push(`${search ?? ''}`);

    const filter = `{ ${base.join(', ')} }`;
    return filter;
};

export const SortOrders = () => {
    return `{ transaction_status_timestamp: DESC }`;
};
