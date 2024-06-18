import { setInfoTab } from '@/hooks/Component/info-tab.hook';
import { InfoTabType } from '@/types/Enums/InfoTabType';
import { OrderType } from '@/types/Enums/OrderType';
import { connectIfNotConnected } from '@/utils/cardano/connect';
import { TransactionInfoTab } from '@/utils/transaction/GeneralTransactionUtils';
import { ComposableOrderV1Transaction } from '@/utils/transaction/Order/OrderV1Transaction';

// A Liquidity Order is simply 2 limit orders
export const LiquidityOrderV1Transaction = async (pool: any, tokenAmountSell: number, tokenAmountBuy: number) => {
    const isConnected = await connectIfNotConnected();
    if (!isConnected) {
        setInfoTab({
            infoType: InfoTabType.Error,
            data: {
                message: 'Please connect your wallet to transact.',
            },
        });
        return;
    }

    // A Liquidity Order will purchase one more token then the buy amount for a given sell amount
    // and purchase one 1 more token of the sell amount for a given buy amount

    // Example, if I am providing 100 ada and 200 token of liquidity, I will:
    // Be putting a limit orders buying 201 tokens with 100 ada
    // and selling 200 tokens for 101 ada

    const tokenAmountSellOne = tokenAmountSell;
    const tokenAmountBuyOne = tokenAmountBuy + 1;
    const tokenAmountSellTwo = tokenAmountBuy;
    const tokenAmountBuyTwo = tokenAmountSell + 1;

    const limitOrderComponents = [
        {
            poolId: pool.id,
            tokenAmountSell: tokenAmountSellOne,
            tokenAmountBuy: tokenAmountBuyOne,
            limitOrderType: 'LIMIT_BUY_ORDER',
            version: 1,
        },
        {
            poolId: pool.id,
            tokenAmountSell: tokenAmountSellTwo,
            tokenAmountBuy: tokenAmountBuyTwo,
            limitOrderType: 'LIMIT_SELL_ORDER',
            version: 1,
        },
    ];

    const result = await ComposableOrderV1Transaction({ limitOrderComponents: limitOrderComponents });
    TransactionInfoTab(result);
    return result;
};
