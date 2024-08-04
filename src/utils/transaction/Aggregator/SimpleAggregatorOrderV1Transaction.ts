import { mutateCreateOrderTransaction, mutateSubmitOrderTransaction } from '@/api/GraphQL/Transaction/OrderTransaction/Mutation';
import { CreateSimpleTransactionAPI } from '@/api/REST/Transaction/SimpleAggregator/CreateTransaction';
import { CreateSimpleTransactionInputDTO } from '@/api/REST/Transaction/SimpleAggregator/Data/CreateSimpleTransactionInputDTO';
import { CreateSimpleTransactionPayloadDTO } from '@/api/REST/Transaction/SimpleAggregator/Data/CreateSimpleTransactionPayloadDTO';
import { SubmitSimpleTransactionInputDTO } from '@/api/REST/Transaction/SimpleAggregator/Data/SubmitSimpleTransactionInput';
import { SubmitSimpleTransactionPayloadDTO } from '@/api/REST/Transaction/SimpleAggregator/Data/SubmitSimpleTransactionPayload';
import { SubmitSimpleTransactionAPI } from '@/api/REST/Transaction/SimpleAggregator/SubmitTransaction';
import { setInfoTab } from '@/hooks/Component/info-tab.hook';
import { setSignatureCount } from '@/hooks/Models/transaction.hook';
import { ConnectWalletError, InvalidInputError, InvalidTransactionSignatureError } from '@/types/Classes/SaturnSwapError';
import { InfoTabType } from '@/types/Enums/InfoTabType';
import { SuccessTransaction } from '@/types/Transactions/SuccessTransaction';
import { TransactionResult } from '@/types/Transactions/TransactionResult';
import CardanoWallet from '@/utils/cardano/wallet';
import { SignTransactionKeepingWitnessOrder } from '@/utils/transaction/GeneralTransactionUtils';

export const SimpleComposableOrderV1Transaction = async ({
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

        // Test Sign Aggregator Transaction - Only use to test aggregators, don't use otherwise
        // const order = await SignOrderTransactionAPI(paymentAddress, submitSuccesses);
        // console.info(order);
        // return {} as any;

        // Test Submit Order Transaction
        const submitInput: SubmitSimpleTransactionInputDTO = {
            paymentAddress: paymentAddress,
            successTransactions: submitSuccesses,
        };
        const submitTransaction: SubmitSimpleTransactionPayloadDTO = await SubmitSimpleTransactionAPI(submitInput);

        const transactionIds: any = submitTransaction?.transactionIds;
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

export const IsValidSimpleInput = (createInput: CreateSimpleTransactionInputDTO) => {
    const { paymentAddress, limitOrderComponents, marketOrderComponents, cancelComponents } = createInput;
    if (!paymentAddress) return false;

    const arrays = [limitOrderComponents, marketOrderComponents, cancelComponents];

    const allNull = arrays.every((array) => array === null);
    const allEmpty = arrays.every((array) => array && array.length <= 0);

    return !(allNull || allEmpty);
};

export const CreateSimpleTransactionInput = (
    paymentAddress: string,
    limitOrderComponents: any[],
    marketOrderComponents: any[],
    cancelComponents: any[]
) => {
    const createInput: CreateSimpleTransactionInputDTO = {
        paymentAddress: paymentAddress,
        limitOrderComponents: limitOrderComponents,
        marketOrderComponents: marketOrderComponents,
        cancelComponents: cancelComponents,
    };
    return createInput;
};
