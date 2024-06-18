import { SignTransactionInputDTO } from '@/api/REST/Transaction/OrderTransaction/Data/SignTransactionInputDTO';
import { SuccessTransaction } from '@/types/Transactions/SuccessTransaction';

// This API is for testing signing transactions for aggregators - This should not be used for non testing purposes
export const SignOrderTransactionAPI = async (paymentAddress: string, successTransactions: SuccessTransaction[]) => {
    const baseURL = process.env.NEXT_PUBLIC_REST_API_URL as string;
    const url = `${baseURL}v1/aggregator/sign-order-transaction`;

    // Test Partner Id
    const partnerId = 'dbbec7a7-fd0b-422a-9af0-15f1cdf4bd2b';
    const body: SignTransactionInputDTO = {
        paymentAddress: paymentAddress,
        successTransactions: successTransactions,
        partnerId: partnerId,
    };

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
