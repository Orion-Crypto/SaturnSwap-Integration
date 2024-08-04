import { CreateAdvancedTransactionAPI } from '@/api/REST/Transaction/AdvancedAggregator/CreateTransaction';
import { CreateAdvancedTransactionInputDTO } from '@/api/REST/Transaction/AdvancedAggregator/Data/CreateAdvancedTransactionInputDTO';
import { CreateAdvancedTransactionPayloadDTO } from '@/api/REST/Transaction/AdvancedAggregator/Data/CreateAdvancedTransactionPayloadDTO';
import { CreateSimpleTransactionInputDTO } from '@/api/REST/Transaction/SimpleAggregator/Data/CreateSimpleTransactionInputDTO';
import { ConnectWalletError, InvalidInputError } from '@/types/Classes/SaturnSwapError';

import { TransactionResult } from '@/types/Transactions/TransactionResult';
import CardanoWallet from '@/utils/cardano/wallet';
import { CreateSimpleTransactionInput, IsValidSimpleInput } from '@/utils/transaction/Aggregator/SimpleAggregatorOrderV1Transaction';

export const ReserveAdvancedComposableOrderV1Transaction = async ({
    limitOrderComponents = [],
    marketOrderComponents = [],
    cancelComponents = [],
}: any = {}) => {
    try {
        const paymentAddress = await CardanoWallet.lucid?.wallet.address();
        if (!paymentAddress) return { error: ConnectWalletError } as TransactionResult;

        const createInput: CreateSimpleTransactionInputDTO = CreateSimpleTransactionInput(
            paymentAddress,
            limitOrderComponents,
            marketOrderComponents,
            cancelComponents
        );
        if (!IsValidSimpleInput(createInput)) {
            return {
                error: InvalidInputError,
            } as TransactionResult;
        }

        const createTransaction: CreateAdvancedTransactionPayloadDTO = await CreateAdvancedTransactionAPI(createInput);
        console.log('createTransaction', createTransaction);
        return;
    } catch (error) {
        console.error(error);
    }
};

export const CreateAdvancedTransactionInput = (
    paymentAddress: string,
    limitOrderComponents: any[],
    marketOrderComponents: any[],
    cancelComponents: any[]
) => {
    const createInput: CreateAdvancedTransactionInputDTO = {
        paymentAddress: paymentAddress,
        limitOrderComponents: limitOrderComponents,
        marketOrderComponents: marketOrderComponents,
        cancelComponents: cancelComponents,
    };
    return createInput;
};
