import { getSlippageValue } from '@/hooks/Component/slippage.hook';
import { setSwapInformation } from '@/hooks/Component/swap.hook';
import { BASE_POOL_UTXO_KEY } from '@/hooks/Models/poolUtxo.hook';
import { queryClient } from '@/hooks/default';
import { OrderType } from '@/types/Enums/OrderType';
import { SwapType } from '@/types/Enums/SwapType';
import { LimitOrderV1Transaction } from '@/utils/transaction/Order/LimitOrder/LimitOrderV1Transaction';
import { MarketOrderV1Transaction } from '@/utils/transaction/Order/MarketOrder/MarketOrderV1Transaction';

// Transaction Functions
export const Order = async (pool: any, swapType: any, orderType: any, setSwap: any) => {
    if (swapType === SwapType.Market) {
        await MarketOrder(pool, orderType);
    } else if (swapType === SwapType.Limit) {
        await LimitOrder(pool, orderType);
    }

    setSwap({
        tokenAmountSell: 0,
        tokenAmountBuy: 0,
        tokenSellUpdated: false,
        tokenBuyUpdated: false,
    });
};

export const LimitOrder = async (pool: any, orderType: any) => {
    let tokenAmountSell = parseFloat((document.getElementById(`token_amount_sell`) as HTMLInputElement)?.value);
    let tokenAmountBuy = parseFloat((document.getElementById(`token_amount_buy`) as HTMLInputElement)?.value);

    let limitOrderType = 'LIMIT_BUY_ORDER';
    if (orderType === OrderType.Buy) {
        limitOrderType = 'LIMIT_BUY_ORDER';
    } else if (orderType === OrderType.Sell) {
        limitOrderType = 'LIMIT_SELL_ORDER';
    }

    setSwapInformation({
        pool: pool,
        orderType: orderType,
        tokenAmountBuy: tokenAmountBuy,
        tokenAmountSell: tokenAmountSell,
    });

    await LimitOrderV1Transaction(pool, tokenAmountSell, tokenAmountBuy, limitOrderType);
    queryClient.invalidateQueries({ queryKey: [BASE_POOL_UTXO_KEY] });
};

export const MarketOrder = async (pool: any, orderType: any) => {
    let tokenAmountSell = parseFloat((document.getElementById(`token_amount_sell`) as HTMLInputElement)?.value);
    let tokenAmountBuy = parseFloat((document.getElementById(`token_amount_buy`) as HTMLInputElement)?.value);

    let marketOrderType = 'MARKET_BUY_ORDER';
    if (orderType === OrderType.Buy) {
        marketOrderType = 'MARKET_BUY_ORDER';
    } else if (orderType === OrderType.Sell) {
        marketOrderType = 'MARKET_SELL_ORDER';
    }

    setSwapInformation({
        pool: pool,
        orderType: orderType,
        tokenAmountBuy: tokenAmountBuy,
        tokenAmountSell: tokenAmountSell,
    });

    const slippage = getSlippageValue() as number;

    await MarketOrderV1Transaction(pool, tokenAmountSell, tokenAmountBuy, slippage, marketOrderType);
    queryClient.invalidateQueries({ queryKey: [BASE_POOL_UTXO_KEY] });
};
