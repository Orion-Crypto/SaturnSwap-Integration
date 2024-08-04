import { SubmitAdvancedTransactionInputDTO } from '@/api/REST/Transaction/AdvancedAggregator/Data/SubmitAdvancedTransactionInput';
import { SubmitAdvancedTransactionPayloadDTO } from '@/api/REST/Transaction/AdvancedAggregator/Data/SubmitAdvancedTransactionPayload';

export const SubmitAdvancedTransactionAPI = async (input: SubmitAdvancedTransactionInputDTO) => {
    const baseURL = process.env.NEXT_PUBLIC_REST_API_URL as string;
    const url = `${baseURL}v1/aggregator/advanced/submit-order-transaction`;

    const body = JSON.stringify(input);
    const response = await fetch(url, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data: SubmitAdvancedTransactionPayloadDTO = await response.json();
    return data;
};
