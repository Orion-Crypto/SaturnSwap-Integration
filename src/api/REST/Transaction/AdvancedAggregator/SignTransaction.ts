import { SignAdvancedTransactionInputDTO } from '@/api/REST/Transaction/AdvancedAggregator/Data/SignAdvancedTransactionInputDTO';
import { SignAdvancedTransactionPayloadDTO } from '@/api/REST/Transaction/AdvancedAggregator/Data/SignAdvancedTransactionPayloadDTO';

export const SignAdvancedTransactionAPI = async (input: SignAdvancedTransactionInputDTO) => {
    const baseURL = process.env.NEXT_PUBLIC_REST_API_URL as string;
    const url = `${baseURL}v1/aggregator/advanced/sign-order-transaction`;

    const body = JSON.stringify(input);
    const response = await fetch(url, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data: SignAdvancedTransactionPayloadDTO = await response.json();
    return data;
};
