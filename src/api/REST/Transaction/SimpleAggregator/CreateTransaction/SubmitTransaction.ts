import { SubmitSimpleTransactionInputDTO } from '@/api/REST/Transaction/SimpleAggregator/Data/SubmitSimpleTransactionInput';
import { SubmitSimpleTransactionPayloadDTO } from '@/api/REST/Transaction/SimpleAggregator/Data/SubmitSimpleTransactionPayload';

export const SubmitSimpleTransactionAPI = async (input: SubmitSimpleTransactionInputDTO) => {
    const baseURL = process.env.NEXT_PUBLIC_REST_API_URL as string;
    const url = `${baseURL}v1/aggregator/simple/submit-order-transaction`;

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(input),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log(response);

    const data: SubmitSimpleTransactionPayloadDTO = await response.json();
    console.log(data);
    return data;
};
