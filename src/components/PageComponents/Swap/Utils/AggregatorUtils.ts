import { setInfoTab } from '@/hooks/Component/info-tab.hook';
import { InfoTabType } from '@/types/Enums/InfoTabType';
import { connectIfNotConnected } from '@/utils/cardano/connect';
import { AdvancedComposableOrderV1Transaction } from '@/utils/transaction/Aggregator/AdvancedAggregatorOrderV1Transaction';
import { ReserveAdvancedComposableOrderV1Transaction } from '@/utils/transaction/Aggregator/ReserveAdvancedAggregatorOrderV1Transaction copy';
import { SimpleComposableOrderV1Transaction } from '@/utils/transaction/Aggregator/SimpleAggregatorOrderV1Transaction';
import { TransactionInfoTab } from '@/utils/transaction/GeneralTransactionUtils';

export const SimpleOrder = async (
    poolId: any,
    tokenAmountSell: number,
    tokenAmountBuy: number,
    slippage: number | null,
    marketOrderType: number
) => {
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

    // Simple orders use the nike / bob pool
    const marketOrderComponents = [
        {
            poolId: poolId,
            tokenAmountSell: tokenAmountSell,
            tokenAmountBuy: tokenAmountBuy,
            marketOrderType: marketOrderType,
            slippage: slippage,
            version: 1,
        },
    ];

    const result = await SimpleComposableOrderV1Transaction({ marketOrderComponents: marketOrderComponents });
    TransactionInfoTab(result);
    return result;
};

export const AdvancedOrder = async (
    poolId: any,
    tokenAmountSell: number,
    tokenAmountBuy: number,
    slippage: number | null,
    marketOrderType: number
) => {
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

    // Simple orders use the nike / bob pool
    const marketOrderComponents = [
        {
            poolId: poolId,
            tokenAmountSell: tokenAmountSell,
            tokenAmountBuy: tokenAmountBuy,
            marketOrderType: marketOrderType,
            slippage: slippage,
            version: 1,
        },
    ];

    const result = await AdvancedComposableOrderV1Transaction({ marketOrderComponents: marketOrderComponents });
    TransactionInfoTab(result);
    return result;
};

export const ReserveAdvancedOrder = async (
    poolId: any,
    tokenAmountSell: number,
    tokenAmountBuy: number,
    slippage: number | null,
    marketOrderType: number
) => {
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

    // Simple orders use the nike / bob pool
    const marketOrderComponents = [
        {
            poolId: poolId,
            tokenAmountSell: tokenAmountSell,
            tokenAmountBuy: tokenAmountBuy,
            marketOrderType: marketOrderType,
            slippage: slippage,
            version: 1,
        },
    ];

    await ReserveAdvancedComposableOrderV1Transaction({ marketOrderComponents: marketOrderComponents });
};
