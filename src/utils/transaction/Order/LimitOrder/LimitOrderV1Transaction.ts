import { setInfoTab } from '@/hooks/Component/info-tab.hook';
import { InfoTabType } from '@/types/Enums/InfoTabType';
import { connectIfNotConnected } from '@/utils/cardano/connect';
import { TransactionInfoTab } from '@/utils/transaction/GeneralTransactionUtils';
import { ComposableOrderV1Transaction } from '@/utils/transaction/Order/OrderV1Transaction';

export const LimitOrderV1Transaction = async (pool: any, tokenAmountSell: number, tokenAmountBuy: number, limitOrderType: string) => {
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

    const limitOrderComponents = [
        {
            poolId: pool.id,
            tokenAmountSell: tokenAmountSell,
            tokenAmountBuy: tokenAmountBuy,
            limitOrderType: limitOrderType,
            version: 1,
        },
    ];

    const result = await ComposableOrderV1Transaction({ limitOrderComponents: limitOrderComponents });
    TransactionInfoTab(result);
    return result;
};
