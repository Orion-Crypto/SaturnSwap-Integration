import { TransactionInfoTab } from '@/utils/transaction/GeneralTransactionUtils';
import { ComposableOrderV1Transaction } from '@/utils/transaction/Order/OrderV1Transaction';

export const CancelV1Transaction = async (poolItems: any[]) => {
    if (!poolItems || poolItems.length <= 0) return null;

    //create a list of cancelComponents with our poolItems
    const cancelPoolItems = poolItems.map((poolItem: any) => {
        return {
            poolUtxoId: poolItem,
            version: 1,
        };
    });

    const result = await ComposableOrderV1Transaction({ cancelComponents: cancelPoolItems });
    TransactionInfoTab(result);
    return result;
};
