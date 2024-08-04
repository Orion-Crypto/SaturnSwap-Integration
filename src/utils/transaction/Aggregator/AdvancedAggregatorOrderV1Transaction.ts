import { CreateAdvancedTransactionInputDTO } from '@/api/REST/Transaction/AdvancedAggregator/Data/CreateAdvancedTransactionInputDTO';
import { SignAdvancedTransactionInputDTO } from '@/api/REST/Transaction/AdvancedAggregator/Data/SignAdvancedTransactionInputDTO';
import { SignAdvancedTransactionPayloadDTO } from '@/api/REST/Transaction/AdvancedAggregator/Data/SignAdvancedTransactionPayloadDTO';
import { SignAdvancedTransactionAPI } from '@/api/REST/Transaction/AdvancedAggregator/SignTransaction';
import { CreateSimpleTransactionAPI } from '@/api/REST/Transaction/SimpleAggregator/CreateTransaction';
import { CreateSimpleTransactionInputDTO } from '@/api/REST/Transaction/SimpleAggregator/Data/CreateSimpleTransactionInputDTO';
import { CreateSimpleTransactionPayloadDTO } from '@/api/REST/Transaction/SimpleAggregator/Data/CreateSimpleTransactionPayloadDTO';
import { setInfoTab } from '@/hooks/Component/info-tab.hook';
import { setSignatureCount } from '@/hooks/Models/transaction.hook';
import { ConnectWalletError, InvalidInputError, InvalidTransactionSignatureError } from '@/types/Classes/SaturnSwapError';
import { InfoTabType } from '@/types/Enums/InfoTabType';
import { SuccessTransaction } from '@/types/Transactions/SuccessTransaction';
import { TransactionResult } from '@/types/Transactions/TransactionResult';
import CardanoWallet from '@/utils/cardano/wallet';
import { CreateSimpleTransactionInput, IsValidSimpleInput } from '@/utils/transaction/Aggregator/SimpleAggregatorOrderV1Transaction';
import { SignTransactionKeepingWitnessOrder } from '@/utils/transaction/GeneralTransactionUtils';

export const AdvancedComposableOrderV1Transaction = async ({
    limitOrderComponents = [],
    marketOrderComponents = [],
    cancelComponents = [],
}: any = {}): Promise<TransactionResult> => {
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

        const createTransaction: CreateSimpleTransactionPayloadDTO = await CreateSimpleTransactionAPI(createInput);
        const successTransactions = createTransaction?.successTransactions;
        if (!successTransactions || successTransactions.length <= 0) {
            return { error: createTransaction?.error } as TransactionResult;
        }

        if (createTransaction?.error?.message == 'Some of the transactions are already cancelled') {
            setInfoTab({
                infoType: InfoTabType.Success,
                data: {
                    message: 'Some Transactions have already been cancelled. Those transactions will appear on chain momentarily.',
                },
            });
        }

        if (successTransactions.length > 1) {
            setSignatureCount(successTransactions.length);
        }

        const submitSuccesses: SuccessTransaction[] = [];
        for (const successTransaction of successTransactions) {
            const transactionId: any = successTransaction?.transactionId;
            const hexTransaction: any = successTransaction?.hexTransaction;

            // Sign each transaction
            const signedHexTx = await SignTransactionKeepingWitnessOrder(hexTransaction);
            if (!signedHexTx) {
                setSignatureCount(null);
                return {
                    error: InvalidTransactionSignatureError,
                } as TransactionResult;
            }

            const submitSuccess: SuccessTransaction = {
                transactionId: transactionId,
                hexTransaction: signedHexTx,
            };
            submitSuccesses.push(submitSuccess);
        }

        const hexTransactions: any = [];
        for (const success of submitSuccesses) {
            hexTransactions.push(success.hexTransaction);
        }

        // Test Sign (This submits too for instant liquidity system)
        const submitInput: SignAdvancedTransactionInputDTO = {
            paymentAddress: paymentAddress,
            hexTransactions: hexTransactions,
        };
        const submitTransaction: SignAdvancedTransactionPayloadDTO = await SignAdvancedTransactionAPI(submitInput);

        const transactionIds: any = [];
        if (submitTransaction?.successTransactions) {
            for (const transaction of submitTransaction.successTransactions) {
                transactionIds.push(transaction.transactionId);
            }
        }

        if (!transactionIds || transactionIds.length <= 0 || !!submitTransaction.error) {
            setSignatureCount(null);
            return { error: submitTransaction?.error } as TransactionResult;
        }

        setSignatureCount(null);
        return { transactionIds: transactionIds } as TransactionResult;
    } catch (error: any) {
        console.error(error);
        setSignatureCount(null);
        return { error: { message: JSON.stringify(error), code: error?.code } } as TransactionResult;
    }
};

const IsValidAdvancedInput = (createInput: CreateAdvancedTransactionInputDTO) => {
    const { paymentAddress, limitOrderComponents, marketOrderComponents, cancelComponents } = createInput;
    if (!paymentAddress) return false;

    const arrays = [limitOrderComponents, marketOrderComponents, cancelComponents];

    const allNull = arrays.every((array) => array === null);
    const allEmpty = arrays.every((array) => array && array.length <= 0);

    return !(allNull || allEmpty);
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
