import { setInfoTab } from '@/hooks/Component/info-tab.hook';
import { InfoTabType } from '@/types/Enums/InfoTabType';
import { connectIfNotConnected } from '@/utils/cardano/connect';
import { TransactionInfoTab } from '@/utils/transaction/GeneralTransactionUtils';
import { ComposableOrderV1Transaction } from '@/utils/transaction/Order/OrderV1Transaction';

export const MarketOrderV1Transaction = async (
    pool: any,
    tokenAmountSell: number,
    tokenAmountBuy: number,
    slippage: number,
    marketOrderType: string
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

    const marketOrderComponents = [
        {
            poolId: pool.id,
            tokenAmountSell: tokenAmountSell,
            tokenAmountBuy: tokenAmountBuy,
            marketOrderType: marketOrderType,
            slippage: slippage,
            version: 1,
        },
    ];

    const result = await ComposableOrderV1Transaction({ marketOrderComponents: marketOrderComponents });
    TransactionInfoTab(result);
    return result;
};
